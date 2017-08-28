
var pages = function(pages) {

    pages.prep_10_end = function(transition){
    	//**//**console.log('function: prep_10_end');
    	world_current = worlds['10_end'];
    	
    	ticker_world = (function(){
    		tick_10_end();
    	});
    	end_world = (function(){
    		end_10_end();
    	});
    	narrDone = (function(){
    		narrDone_10_end();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//teachertip:
    	teachertipcontainer.onPage = true;
    	teachertiptext.text = "Parent tip: Put the last question into action by letting your child choose some things to measure. If you have a tape measure handy, help your child use it. Compare the items: Which one is the smallest? Which one is the tallest?";
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    
    	//on page elements:
    	martha = new createjs.Bitmap(images['10-martha'])
    	martha.x = 20;
    	martha.y = 130;
    	world_current.addChild(martha);
    
    	//the props:
    	apple = new createjs.Bitmap(images['10-apple']);
    	apple.regX = apple.image.width/2|0;
    	apple.regY = apple.image.height/2|0;
    	apple.x = 370;
    	apple.y = 250;
    	apple.startX = apple.x;
    	apple.startY = apple.y;
    	apple.readframe = 3;
    	world_current.addChild(apple);
    
    	ball = new createjs.Bitmap(images['10-ball']);
    	ball.regX = ball.image.width/2|0;
    	ball.regY = ball.image.height/2|0;
    	ball.x = 795;
    	ball.y = 120;
    	ball.startX = ball.x;
    	ball.startY = ball.y;
    	ball.readframe = 2;
    	world_current.addChild(ball);
    
    
    	carrot = new createjs.Bitmap(images['10-carrot']);
    	carrot.regX = carrot.image.width/2|0;
    	carrot.regY = carrot.image.height/2|0;
    	carrot.x = 620;
    	carrot.y = 110;
    	carrot.startX = carrot.x;
    	carrot.startY = carrot.y;
    	carrot.readframe = 4;
    	world_current.addChild(carrot);
    
    	flowers = new createjs.Bitmap(images['10-flowers']);
    	flowers.regX = flowers.image.width/2|0;
    	flowers.regY = flowers.image.height/2|0;
    	flowers.x = 220;
    	flowers.y = 280;
    	flowers.startX = flowers.x;
    	flowers.startY = flowers.y;
    	flowers.readframe = 1;
    	world_current.addChild(flowers);
    
    	helmet = new createjs.Bitmap(images['10-helmet']);
    	helmet.regX = helmet.image.width/2|0;
    	helmet.regY = helmet.image.height/2|0;
    	helmet.x = 390;
    	helmet.y = 120;
    	helmet.startX = helmet.x;
    	helmet.startY = helmet.y;
    	helmet.readframe = 5;
    	world_current.addChild(helmet);
    
    	pancake = new createjs.Bitmap(images['10-pancake']);
    	pancake.regX = pancake.image.width/2|0;
    	pancake.regY = pancake.image.height/2|0;
    	pancake.x = 360;
    	pancake.y = 390;
    	pancake.startX = pancake.x;
    	pancake.startY = pancake.y;
    	pancake.readframe = 6;
    	world_current.addChild(pancake);
    
    	skateboard = new createjs.Bitmap(images['10-skateboard']);
    	skateboard.regX = skateboard.image.width/2|0;
    	skateboard.regY = skateboard.image.height/2|0;
    	skateboard.x = 600;
    	skateboard.y = 245;
    	skateboard.startX = skateboard.x;
    	skateboard.startY = skateboard.y;
    	skateboard.readframe = 8;
    	world_current.addChild(skateboard);
    
    
    	violin = new createjs.Bitmap(images['10-violin']);
    	violin.regX = violin.image.width/2|0;
    	violin.regY = violin.image.height/2|0;
    	violin.x = 880;
    	violin.y = 200;
    	violin.startX = violin.x;
    	violin.startY = violin.y;
    	violin.readframe = 7;
    	world_current.addChild(violin);	
    
    	props = []; //arranged by weight in ascending order
    	props.push(apple,ball,carrot,flowers,helmet,pancake,skateboard,violin);
    
    
    	//thescale, hitregion, and readings. all positions dependent on scale bitmaps position
    	thescale = new createjs.Bitmap(images['3-scale'])
    	thescale.x = 430;
    	thescale.y = 310;
    	world_current.addChild(thescale);
    
    	scalereading = new createjs.Sprite( spritesheets['10_scale_readings'] );
    	scalereading.x = thescale.x;
    	scalereading.y = thescale.y;
    	scalereading.gotoAndStop(1); //error when showing this spritesheet at frame 0... so just hide when there is to be no reading, show & goto frame when there is reading.
    	scalereading.visible  =  false;
    	world_current.addChild(scalereading);
    
    	scale_hitbox = new createjs.Shape();
    	scale_hitbox.graphics.beginFill("blue").drawRect(thescale.x+45, thescale.y, 375, 84);	
    		//scale_hitbox.alpha = 0.5;
    		//world_current.addChild(scale_hitbox);
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText();
    
    	//params: sndID, defintion words in array
    	renderNarration('10_end', ['apply', 'measure']);
    
    	setDefinitionText();
    	//********
    
    	currentProp = {};
    	//
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_10_end);
    
    }
    
    //level specific functions:
    function narrDone_10_end(){
    	//**//**console.log("unique narrDone function just for 10_end");
    
    	//play PAWS audio for this page:
    	//playSound('10_end_PAWS');
    
    	for (var i=0;i < props.length;i++){
    		propDrag(props[i]);
    	}
    
    }
    
    function propDrag(obj, snapback){
    	addShadow(obj);
    	doPulse(obj);
    
    	(function(target) {
    		obj.on("click", function(evt) {
    			if(!_active) return;
    			
    			target.scaleX = target.scaleY = 1.1;
    			////**//**console.log(evt.target + " pressed!");
    			
    			// bump the target in front of it's siblings:
    			world_current.addChild(target);
    			var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
    
    			evt.onMouseMove = function(ev) {
    					target.x = ev.stageX;
    					target.y = ev.stageY;
    			}
    						
    			evt.onMouseUp = function(ev){
    				//**//**console.log(target + " released!");
    				target.scaleX = target.scaleY = 1;
    
    				//if hitTest w/ scalereading is true, then modify scale display, else, return the prop
    				var pt = target.localToLocal(target.regX, target.regY,scale_hitbox);
    				if (scale_hitbox.hitTest(pt.x, pt.y)) { 
    					//**//**console.log('target has hit the scale!');
    					propOnScale(target);	
    				}
    
    				else{
    					prop_snapback(target);	
    				}
    			}	
    			
    		});		
    	})(obj);	
    }
    
    
    function propOnScale(target)
    {
    	
    	scalereading.gotoAndStop(target.readframe);
    	scalereading.visible = true;
    
    	for(var i=0;i<props.length;i++){
    		if(props[i] == target) continue;
    
    		props[i].x = props[i].startX;
    		props[i].y = props[i].startY;
    	}
    	
    	currentProp = target;
    	if(!narrActive) playSound('ding');
    }
    
    function prop_snapback(target){
    	target.x = target.startX;
    	target.y = target.startY;	
    	
    	if(!currentProp || (currentProp == target) ) {
    		currentProp = {};
    		scalereading.visible = false;
    		scalereading.gotoAndStop(0);	
    	}
    	 
    }
    
    
    //called once this level is fully slid into place
    function begin_10_end(){
    	//**//**console.log("WORLD 10 BEGIN");
    	playSound('10_end');
    }
    
    
    
    function tick_10_end(){
    	stage.update();
    }
    
    
    
    function end_10_end(){
    	//**//**console.log('end_10_end');	
    
    	stopSound(); //if PAWS audio in narrDone function - make sure to stop it before going to next page	
    	
    	createjs.Ticker.removeEventListener(ticker_world);
    }

    return pages;
} (pages || {} );
