
var pages = function(pages) {
    pages.prep_2_baker = function(transition){
    	//**//**console.log('function: prep_2_baker');
    	world_current = worlds['2_baker'];
    	
    	ticker_world = (function(){
    		tick_2_baker();
    	});
    	end_world = (function(){
    		end_2_baker();
    	});
    	narrDone = (function(){
    		narrDone_2_baker();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    
    	//on page elements:
    
    	img_chef_counter = new createjs.Bitmap(images['2-chef_counter']);
    	img_chef_counter.x = 15;
    	img_chef_counter.y = 15;
    	world_current.addChild(img_chef_counter);
    
    
    	emptycup  = new createjs.Bitmap(images['2-emptycup']);
    	emptycup.x = 368;
    	emptycup.y = 290;
    	world_current.addChild(emptycup);
    
        console.log(spritesheets['measurecup']);
    	measurecup = new createjs.Sprite( spritesheets['measurecup'] );
    	measurecup.x = 628;
    	measurecup.y = 292;
    	measurecup.gotoAndStop(0);
    	world_current.addChild(measurecup);
    
    	milkcarton = new createjs.Bitmap(images['2-milkcarton']);
    	milkcarton.regX = milkcarton.image.width/2|0;
    	milkcarton.regY = milkcarton.image.height/2|0;	
    	milkcarton.scaleX = milkcarton.scaleY = 0.9;
    	milkcarton.x = 288;
    	milkcarton.y = 315;
    	milkcarton.startX = milkcarton.x;
    	milkcarton.startY = milkcarton.y;
    
    
    	world_current.addChild(milkcarton);
    
    
    	milkcarton_pour = new createjs.Sprite( spritesheets['milkcarton_pour'] );
    	milkcarton_pour.x = 465;
    	milkcarton_pour.y = 146;
    	//milkcarton_pour.scaleX = milkcarton_pour.scaleY = 2.0;
    	milkcarton_pour.gotoAndStop(0);
    	milkcarton_pour.visible = false;
    	
    	world_current.addChild(milkcarton_pour);
    
    	_firstPour = true;
    
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText();
    
    	//params: sndID, defintion words in array
    	//renderNarration('2_baker', ['amounts']);
    	renderNarration('2_baker', ['measure', 'amount', 'ingredients,']);
    
    	setDefinitionText();
    	//********
    
    
    	//
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_2_baker);
    
    
    
    }
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_2_baker(){
    	//**//**console.log("2_baker BEGIN");
    	
    	playSound('2_baker');
    }
    
    function narrDone_2_baker(){
    	//**//**console.log("unique narrDone function just for baker!");
    
    	if(_firstPour) drag_milkcarton(milkcarton, 'lockX');
    	
    }
    
    function fillCup(e){
    	measurecup.gotoAndPlay('fillcup');
    }
    
    function cartonPour(e){
    	measurecup.gotoAndStop(0);
    	milkcarton.visible = false;
    	milkcarton.removeAllEventListeners();
    	milkcarton_pour.on("animationend", pourDone);
    	
    	milkcarton_pour.gotoAndPlay('pour');
    	
    	if(!narrActive){
    		setTimeout(function(){
    			playSound('milk_pour');
    		},650);
    	} 
    
    	world_current.addChild(measurecup);
    	measurecup.gotoAndPlay('pour');
    
    }
    function pourDone(){
    	milkcarton_pour.onAnimationEnd = null;
    	milkcarton.on("click", cartonPour);
    	milkcarton.visible = true;
    
    	if(!narrActive) stopSound();
    	
    }
    
    function drag_milkcarton(obj, lock){
    	addShadow(obj);
    	doPulse(obj);
        var offset;
    
    	(function(target) {
    		obj.on("mousedown",  function(evt) {
                console.log("milk mouse down");
    			if(!_active || !_firstPour) return;
    			
    			//**//**console.log(evt.target + " pressed!... target.y: " + evt.target.y);
    			// bump the target in front of it's siblings:
    			world_current.addChild(target);
    			offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
    
    			target.scaleX *= 1.03;
    			target.scaleY *= 1.03;
    			
    		});
    		obj.on("pressmove",  function(evt) {
    			if(!_active || !_firstPour) return;
    			target.y = evt.stageY+offset.y;
    			
    		});
    		obj.on("pressup",  function(evt) {
    			if(!_active || !_firstPour) return;
    			//**//**console.log(target + " released!");
    				
    			target.scaleX /= 1.03;
    			target.scaleY /= 1.03;
    			milkcarton.y = milkcarton.startY;					
    		});
    	})(obj);
    }
    
    
    function tick_2_baker(){
    	stage.update();
    
    	if(_firstPour){
    		if(milkcarton.y <= (220)){
    			_firstPour = false;
    			//**//**console.log('do pour now!');
    			milkcarton.off("click", null);
    			milkcarton.visible = false;
    
    			milkcarton.y = 250;
    			milkcarton.x = 312;
    			
    
    			milkcarton_pour.visible = true;
    			cartonPour();
    		}
    	}
    }
    
    
    
    function end_2_baker(){
    	//**//**console.log('end_2_baker');
    	milkcarton_pour.onAnimationEnd = null;	
    	milkcarton_pour.stop();
    	createjs.Ticker.removeEventListener(ticker_world);
    }
    return pages;
}(pages || {});
