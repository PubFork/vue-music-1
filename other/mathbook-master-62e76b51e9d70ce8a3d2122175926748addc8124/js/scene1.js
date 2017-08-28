// create a namespace for main function to use - we use the module pattern
// which is what zim uses as well - see https://youtu.be/Yy7bD1Q9PKI from zim Learn
var story = function(story) {

    var stageW, stageH;

    // here is the function to make the scene that the main file calls
    // note, we collect the callback function so we can call that when scene1 is ready
    story.makeScene1 = function(frame, call) {
        stageW = stage.canvas.width;
        stageH = stage.canvas.height;

        // we will store anything the main function might need on this object
        // and then return the object at the end to the main function
        var s = {};

        // Preload the assets including the spritesheet, spritesheet data, backings and sound
        // We store the resulting zim.Queue object in a variable
        // This is optional but it lets us put a "complete" event on the specific Queue
        // rather than the more generic frame "complete" event which fires for any loadAssets() call
        // This way, if multiple loadAssets() calls are made, we don't accidentally call wrong complete events
        // Alternatively, we would stagger complete events and make sure we delete them as they are used
        // by setting the fourth parameter of the on() method to true to run the event only once
        var assets = frame.loadAssets([
    		"spritesheet.png", "spritesheet.json",
    		"ground.png", "foreground.png", "midground.png", "background.png",
    		"shoot.mp3", "sneak.mp3"
    	], "img/measureup_story/0_lab/");

    	// call a function when the asset loading is complete
    	assets.on("complete", function() {

            // store any asset we need to control from the main file on s
            // s is an object that gets returned by this function
            // so the main file gets access to anything stored on s
            // We will have to pause this sound when we go to the second scene
            // the pausing is done in the main file so store sneak on s
    		s.sneak = frame.asset("sneak.mp3").play({loop:-1, volume:.5});

    		// SCENES
    		// Put all the assets for a scene into a Container
    		// This allows us to add and remove the scene all at once
    		// We will also make a zim.Scene object to control scroller and sprite speeds all at once

            // we need access to the laboratory and the scene in the main file
            // but it is handy to store local variables here too so we don't have to use s.scene, etc. all the time!
    		var laboratory = s.laboratory = new zim.Container(stageW, stageH);
            console.log(laboratory);
            zim.addTo(laboratory, world_current);
    		var accelerator = s.accelerator = new zim.Accelerator();

    		// DYNAMIC SPRITE CREATION
    		// In this example, we control the speed of the scrollers and sprites with mouse position
    		// Use a zim.Dynamo to dynamically control the speed of a zim.Sprite

    		var sprite = s.sprite = new zim.Sprite({json:frame.asset("spritesheet.json")})
    			.centerReg(laboratory)
    			.mov(0, 110);

            // give the dynamo a default speed and add the dynamo to the scene object
            // the Accelerator object will control the percentSpeed of this sprite and the scrollers
    		var dynamo = new zim.Dynamo({sprite:sprite, speed:30, label:"walk", reversable:false});
    		accelerator.add(dynamo);

    		// SCROLLERS
            // Scrollers animate the backgrounds
    		// They add a second copy of the object being scrolled and swap them as needed
    		// The second copy gets added to the scrolled object's Container as they are created
    		// If the sprite is on the stage, the copy may go overtop of the sprite
    		// So we put any scrollers for objects behind the sprite in a container behind the sprite
    		// this prevents the copy from coming up above the sprite
            // NOTE: we are adding the Scrollers to the Accelerator as well
            // so their percentSpeed will be controlled with the sprite's percentSpeed

    		var backings = new zim.Container(stageW, stageH);              
            zim.addTo(backings, laboratory, 0); // backings at level 0 in laboratory scene

            var background = frame.asset("background.png");
            zim.addTo(background, backings);
            var ground = frame.asset("ground.png");
            zim.addTo(ground, backings);
            var midground = frame.asset("midground.png");
            zim.addTo(midground, backings);
            var foreground = frame.asset("foreground.png");
            zim.addTo(foreground, laboratory);

    		accelerator.add([
    			new zim.Scroller(background, 1),
    			new zim.Scroller(ground.mov(0,-150), 3),
    			new zim.Scroller(midground, 2),
    			// the foreground is in front of the sprite, so it can just get added to the laboratory above the sprite
    			new zim.Scroller({
    				backing: foreground.mov(0,-150),
    				speed:5, gapFix:2 // with starting a stopping, sometimes need a gapFix
    			})
    		]);
    		//frame.color = "white"; // can help hide slight gap in backing - or use gapFix


    		// SPRITE INTERACTION ANIMATION
    		// We want to make the sprite shoot when we click on the stage or press the space bar
    		// We will pause the Dynamo at the last walk cycle frame
    		// And, will not let them shoot again while they are currently shooting
    		// This uses a three way check variable to advance through states of ready, shoot and wait

    		var shootState = "ready";
    		laboratory.on("click", shoot);
    		frame.on("keydown", function(e) {if (e.keyCode==32) shoot();});

    		function shoot() {
    			// only set shootState to shoot if the animation is in the ready state (not currently shooting)
    			if (shootState == "ready") {
    				shootState = "shoot";
    				accelerator.pause();
    				// alternatively slow to stop
    				// accelerator.pause(true, 500);
    				// or stop on a certain frame (will override the slow parameter)
    				// accelerator.pause(true, null, dynamo.totalFrames-1);

    				// not really needed for immediate pause but would use with delayed pauses
    				// note we delete this after being used once - the last parameter is true
    				accelerator.on("pause", function() {
    					testShoot();
    				}, null, true);
    			}
    		}

    		function testShoot() {
    			if (shootState == "shoot") {
    				shootState = "wait";
    				// play the sound for the first shot
    				frame.asset("shoot.mp3").play();
    				sprite.run({
    					label:"shoot",
    					time:650,
    					loop:true,
    					loopCount:zim.rand(1,3), // make sure this is non-zero - which would loop forever
    					loopCall:function(){frame.asset("shoot.mp3").play();}, // play the sound as we loop
    					call:function(){
    						shootState = "ready";
    						accelerator.pause(false);
    					} // calls when animation done
    				});
    			}
    		}

            // call back to main script to let it know loading is complete
            if (call && typeof call == 'function') {(call)();}

    	}); // end asset loading

        return s;
    }

    return story; // for the module pattern
}(story||{})
