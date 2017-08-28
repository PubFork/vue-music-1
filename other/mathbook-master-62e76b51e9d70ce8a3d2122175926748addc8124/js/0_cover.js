var pages = function(pages) {
    pages.prep_0_cover = function(transition){
    	//**//**console.log('function: prep_0_cover');
    	world_current = worlds['0_cover'];
    	
    	ticker_world = (function(){
    		tick_0_cover();
    	});
    	end_world = (function(){
    		end_0_cover();
    	});
    	narrDone = (function(){
    		//narrDone_3_butcher();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = false;
    	arrowRight.visible = true;
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	coverimg = new createjs.Bitmap(images['cover_story']);
    	world_current.addChild(coverimg);
    
    	//
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_0_cover);
    
    }
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_0_cover(){
    	//**//**console.log("WORLD 0 BEGIN");
    	
    	//FIX FOR ANDROID: play ~100ms of silence muted before playing actual cover audio
        var empty0 =  sounds['empty'][0] * 1000;
        var empty1 =  sounds['empty'][1] * 1000;
        soundManager.mute('multisound');
    	playFromTo(empty0, empty1, audio_0_cover);     
    }
    
    function audio_0_cover(){
    	soundManager.unmute('multisound');
    	playSound('0_cover');
    }
    
    
    function tick_0_cover(){
    	stage.update();
    }
    
    function end_0_cover(){
    	//**//**console.log('end_0_cover');	
    	createjs.Ticker.removeEventListener(ticker_world);
    }
    return pages;
}(pages || {});
