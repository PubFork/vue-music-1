var pages = function(pages) {
    var frame, waiter, scene1, scene2, innnerPages;
    var stageW;
    var stageH;

    pages.prep_0_lab = function(transition){
    	//**//**console.log('function: prep_0_lab');
    	world_current = worlds['0_lab'];
    	
    	ticker_world = (function(){
    		tick_0_lab();
    	});
    	end_world = (function(){
    		end_0_lab();
    	});
    	narrDone = (function(){
    		//narrDone_3_butcher();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = false;
    	arrowRight.visible = true;
    
        frame = new zim.Frame("fit", 1024, 618, "#000");
    
        init_lab(); 
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_0_lab);
    
    }
    
    function init_lab() {
    
    	stageW = frame.width;
    	stageH = frame.height;
    
    	// ALSO SEE http://zimjs.com/code/spritesheet/ for basic animation example
    	// ALSO SEE http://zimjs.com/code/spritesheet/skateboard.html for basic another animation example
    	// ALSO SEE http://wp.me/p6Nuw8-wJ for the News Article on SpriteSheets
    	// ALSO SEE https://youtu.be/WWEms6qy9KA for a video tutorial (note, made before Sprite Animation Series)
    	// ALSO SEE http://zimjs.com/code/docs.html?view=Sprite for the docs on Sprites
    	// ALSO SEE http://zimjs.com/code/docs.html?view=Scroller for the docs on a background Scroller
    	// ALSO SEE http://zimjs.com/code/docs.html?view=Dynamo for the docs on Dynamic Sprites
    	// ALSO SEE http://zimjs.com/code/docs.html?view=Accelerator for the docs on scene animation
    
    	// a little animated component to show content is loading
    	waiter = new zim.Waiter({container:stage, color:frame.pink, corner:0});
    	waiter.show();
    
    	// OVERVIEW
    	// The display objects for Scene 1 and 2 are in scene1.js and scene2.js
    	// We load the assets in these files and pass in a callback function
    	// When the assets for scene 1 load it calls back scene1Loaded
    	// We set up what we need to control scene 1 and then we load scene 2
    	// This way, we are not waiting for scene 2 assets to show scene 1 assets
    
    	// ASIDE - at this point, you may want to go into the scene1.js and scene2.js and see what is there
    
    	scene1 = story.makeScene1(frame, scene1Loaded);
    
    }
    
    function scene1Loaded() {
    	waiter.hide();
    
    	innerPages = new zim.Pages(stage, [{page:scene1.laboratory}], "slide");
    	zim.addTo(innerPages, world_current);
    
    	var pd = new zim.ProportionDamp(0, stageW, -200, 200);
    
    	// the Ticker will handle all pages so we break it down inside depending on the pages.page property
    	var ticker = zim.Ticker.add(function() {
    		if (innerPages.page == scene1.laboratory) {
    			scene1.accelerator.percentSpeed = pd.convert(stage.mouseX);
    
    			if ((stage.mouseX > stageW/2 && scene1.sprite.scaleX < 0) || (stage.mouseX < stageW/2 && scene1.sprite.scaleX > 0))  {
    				scene1.sprite.scaleX *= -1;
    			}
    		} else if (innerPages.page == scene2.space) {
    			// add any controls for space
    			if (scene2.asteroid) scene2.asteroid.rotation += 1;
    		}
    	}, stage);
    
    
    	scene2 = story.makeScene2(frame, scene2Loaded);
    
    } // end scene1 loaded
    
    
    function scene2Loaded() {
        
    	// here we add swipes to scene1 for either left or right
    	innerPages.addPage(scene2.space, [scene1.laboratory, scene1.laboratory, null, null]);
    	// remake scene1 with swipes now that scene2 exists
    	innerPages.addPage(scene1.laboratory, [scene2.space, scene2.space, null, null]);
    
    	// Add an arrow to go from one page to another
    	// could also be when the user is finished a task, etc.
    	var arrow = new zim.Button({
    		width:60, height:60, corner:30,
    		color:frame.grey, rollColor:frame.pink,
    		icon:pizzazz.makeIcon("arrow", "white", .7), // or use zim.Triangle()
    		label:"", shadowBlur:-1
    	});
    	zim.addTo(arrow, world_current);
    	zim.pos(arrow, stageW-100, stageH-90); // position
    	zim.animate(arrow, {obj:{alpha:0}, time:1000, from:true});
    
    	arrow.on("click", function(e) {
    		if (innerPages.page == scene1.laboratory) {
    			// the pages object has a go method
    			innerPages.go(scene2.space);
    		} else if (innerPages.page == scene2.space) {
        
    			innerPages.go(scene1.laboratory);
    		}
    	});
        
    	// both the click and swiping change pages so capture the page change
    	// and make adjustments in one place:
    	innerPages.on("page", function() {
    		if (innerPages.page == scene2.space) {
    			// run the accelerator for page 2 which was paused during asset creation in scene2.js
    			scene2.accelerator.pause(false);
    			// animate in the two taglines
    			innerPages.on("pagetransitioned", function() {
    				scene1.accelerator.pause();
    			}, null, true); // only run this once or else next time we go we would compound this event
    			scene2.nanora = frame.asset("nanora.mp3").play({volume:.5});
    			zim.animate({target:scene1.sneak, obj:{volume:0}, time:1000, ticker:false});
    		} else if (innerPages.page == scene1.laboratory) {
    			// unpause the scene 1 accelerator
    			scene1.accelerator.pause(false);
    			// now that scene 2 is off the screen take care of setting it back to a start state for next time
    			innerPages.on("pagetransitioned", function() {
    				scene2.accelerator.pause();
    				scene2.space.addChild(scene2.asteroid);
    			}, null, true); // only run this once or else next time we go we would compound this event
    			// animating volumes again - so use zim.animate with a target of the sound and a ticker to false - as mentioned
    			zim.animate({target:scene2.nanora, obj:{volume:0}, time:1000, ticker:false});
    			zim.animate({target:scene1.sneak, obj:{volume:.5}, time:1000, ticker:false});
    		}
    	})
        
    } // end scene2 loaded
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_0_lab(){
    	//**//**console.log("WORLD 0 BEGIN");
    	
    	//FIX FOR ANDROID: play ~100ms of silence muted before playing actual lab audio
        var empty0 =  sounds['empty'][0] * 1000;
        var empty1 =  sounds['empty'][1] * 1000;
        soundManager.mute('multisound');
    	playFromTo(empty0, empty1, audio_0_lab);     
    }
    
    function audio_0_lab(){
    	soundManager.unmute('multisound');
    	playSound('0_lab');
    }
    
    
    function tick_0_lab(){
    	stage.update();
    }
    
    function end_0_lab(){
    	//**//**console.log('end_0_lab');	
    	createjs.Ticker.removeEventListener(ticker_world);
    }
    return pages;
}(pages || {});
