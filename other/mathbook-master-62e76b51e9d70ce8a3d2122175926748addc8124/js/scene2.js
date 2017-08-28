var story = function(story) {

    var stageW, stageH;

    story.makeScene2 = function(frame, call) {
        stageW = stage.canvas.width;
        stageH = stage.canvas.height;
        var s = {};

    	var assets = frame.loadAssets([
    		"space.jpg", "asteroid.png", "nanora.mp3",
    		"boom.png", "boom.mp3"
    		], "img/measureup_story/0_lab/");
    	assets.on("complete", function() {

    		var space = s.space = new zim.Container(stageW, stageH);
    		var accelerator = s.accelerator = new zim.Accelerator();
    		var backings = new zim.Container(stageW, stageH)
            zim.addTo(backings, space, 0); // backings at level 0 in laboratory scene
    		accelerator.add(new zim.Scroller({
    			backing:frame.asset("space.jpg").addTo(backings).scaleTo(stage,100),
    			speed:.5,
    			horizontal:false,
    			gapFix:2,
    			stage:stage // not added to stage yet so must pass in the stage
    		}));
    		var asteroid = s.asteroid = frame.asset("asteroid.png")
                .centerReg(space)
                .sca(.7);
    		asteroid.cursor = "pointer"; // cannot chain cursor on end as this would return "pointer" to var asteroid

    		var explosion = new zim.Sprite(frame.asset("boom.png"), 8, 6);
    		asteroid.on("click", function(){
    			frame.asset("boom.mp3").play();
    			explosion.centerReg(space)
    				.scale(2)
    				.pos(asteroid.x, asteroid.y).mov(-20,-10)
    				.run(1000);
    			setTimeout(function(){space.removeChild(asteroid);}, 500);
    		});

    		var tag = s.tag = new zim.Container();
    		zim.addTo(tag, space);
    		zim.pos(tag, -500, stageH-70);
    		s.subTag = new zim.Label({
    			text:"NOT BY ANTONIO",
    			backing:new zim.Rectangle(220,36,"black"),
    			color:"#AAA",
    			size:18
    		});
            zim.ske(s.subTag, 20);
            zim.addTo(s.subTag, tag);
            zim.pos(s.subTag, 0, 14);
    		var label = new zim.Label({
    			text:"MEANWHILE",
    			backing:new zim.Rectangle(250,60,frame.pink,frame.green,3),
    			color:"white"
    		});
            zim.ske(label, 20);
            zim.addTo(label, tag);

            // call back to main script to let it know loading is complete
            if (call && typeof call == 'function') {(call)();}

    	}, null, true); // end asset loading - only run this complete once

        return s;
    }

    return story;
}(story||{})
