
var pages = function(pages) {

    pages.prep_3_butcher = function(transition){
    	//**//**console.log('function: prep_3_butcher');
    	world_current = worlds['3_butcher'];
    
    	ticker_world = (function(){
    		tick_3_butcher();
    	});
    	end_world = (function(){
    		end_3_butcher();
    	});
    	narrDone = (function(){
    		narrDone_3_butcher();
    	});
        task_finished = (function() {
    
        });
        task_correct = (function() {
    
        });
        task_incorrect = (function() {
    
        });
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//teachertip:
    	teachertipcontainer.onPage = true;
    	teachertiptext.text = "Parent tip: When children relate what they are reading to their own lives, it helps them to understand and remember information. Expand on the example or use another one that your child will recognize. \"What else have we weighed at the supermarket? That's right—we weighed those apples we bought last week.\"";
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    
    	//on page elements:
    	butcher = new createjs.Bitmap(images['3-butcher']);
    	//butcher.regX = steak.image.width/2|0;
    	//butcher.regY = steak.image.height/2|0;
    	butcher.x = 65;
    	butcher.y = 54;
    	world_current.addChild(butcher);
    
    	// the meats:
    	sausage = new createjs.Bitmap(images['3-sausage']);
    	sausage.regX = sausage.image.width/2|0;
    	sausage.regY = sausage.image.height/2|0;
    	sausage.x = 746;
    	sausage.y = 70;
    	sausage.startX = sausage.x;
    	sausage.startY = sausage.y;
    	world_current.addChild(sausage);
    
    	nuggets = new createjs.Bitmap(images['3-nuggets']);
    	nuggets.regX = nuggets.image.width/2|0;
    	nuggets.regY = nuggets.image.height/2|0;
    	nuggets.x = 485;
    	nuggets.y = 256;
    	nuggets.startX = nuggets.x;
    	nuggets.startY = nuggets.y;
    	world_current.addChild(nuggets);
    
    	steak = new createjs.Bitmap(images['3-steak']);
    	steak.regX = steak.image.width/2|0;
    	steak.regY = steak.image.height/2|0;
    	//steak.scaleX = steak.scaleY = 0.9;
    	steak.x = 410;
    	steak.y = 100;
    	steak.startX = steak.x;
    	steak.startY = steak.y;
    	world_current.addChild(steak);
    
    
    	sausages = new createjs.Bitmap(images['3-sausages']);
    	sausages.regX = sausages.image.width/2|0;
    	sausages.regY = sausages.image.height/2|0;
    	sausages.x = 586;
    	sausages.y = 95;
    	sausages.startX = sausages.x;
    	sausages.startY = sausages.y;
    	world_current.addChild(sausages);
    
    	roast = new createjs.Bitmap(images['3-roast']);
    	roast.regX = roast.image.width/2|0;
    	roast.regY = roast.image.height/2|0;
    	//roast.scaleX = roast.scaleY = 0.75;
    	roast.x = 780;
    	roast.y = 215;
    	roast.startX = roast.x;
    	roast.startY = roast.y;
    	world_current.addChild(roast);
    
    	meats = []; //arranged by weight in ascending order
    	meats.push(sausage,nuggets,steak,sausages,roast);
    
    	//thescale, hitregion, and readings. all positions dependent on scale bitmaps position
    	thescale = new createjs.Bitmap(images['3-scale'])
    	thescale.x = 430;
    	thescale.y = 310;
    	world_current.addChild(thescale);
    
    	scalereading = new createjs.Sprite( spritesheets['scale_readings'] );
    	scalereading.x = thescale.x + 338;
    	scalereading.y = thescale.y + 92;
    	scalereading.gotoAndStop(0);
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
    	renderNarration('3_butcher', ['scales', 'measure', 'weight']);
    
    	setDefinitionText();
    	//********
    
    
    	//
    	currentMeat = {};
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_3_butcher);
    
    
    
    }
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_3_butcher(){
    	//**//**console.log("WORLD 3 BEGIN");
    	
    	playSound('3_butcher');	
    }
    
    function narrDone_3_butcher(){
    	//**//**console.log("unique narrDone function just for butcher!");
    
    	for (var i=0;i<meats.length;i++){
    		meatDrag(meats[i]);
    	}
    
    }
    
    function meatDrag(obj, snapback){
    	addShadow(obj);
    	doPulse(obj);
    
    	(function(target) {
    		obj.on("mousedown", function(evt) {
    			if(!_active) return;
    			
    			target.scaleX = target.scaleY = 1.1;
    			////**//**console.log(evt.target + " pressed!");
    			
    			// bump the target in front of it's siblings:
    			world_current.addChild(target);
    			var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
            });
            obj.on("pressmove", function(evt) {
    				target.x = evt.stageX;
    				target.y = evt.stageY;
    		});
    
    	    obj.on("pressup", function(evt){
    			//**//**console.log(target + " released!");
    			target.scaleX = target.scaleY = 1;
    
    			//if hitTest w/ scalereading is true, then modify scale display, else, return the meat
    			var pt = target.localToLocal(target.regX, target.regY,scale_hitbox);
    			if (scale_hitbox.hitTest(pt.x, pt.y)) { 
    				//**//**console.log('target has hit the scale!');
    				meatOnScale(target);	
    			} else{
    				meat_snapback(target);	
    			}
    		});		
    	})(obj);	
    }
    
    
    function meatOnScale(target)
    {
    	var weightreading = meats.indexOf(target) + 1;
    	scalereading.gotoAndStop(weightreading);
    
    	for(var i=0;i<meats.length;i++){
    		if(meats[i] == target) continue;
    
    		meats[i].x = meats[i].startX;
    		meats[i].y = meats[i].startY;
    	}
    	
    	currentMeat = target;
    	if(!narrActive) playSound('toy_bell');
    }
    
    function meat_snapback(target){
    	target.x = target.startX;
    	target.y = target.startY;	
    	
    	if(!currentMeat || (currentMeat == target) ) {
    		currentMeat = {};
    		scalereading.gotoAndStop(0);	
    	}
    }
    
    
    function tick_3_butcher(){
    	stage.update();
    }
    
    function end_3_butcher(){
    	//**//**console.log('end_3_butcher');	
    	currentMeat = meats = null;
    	createjs.Ticker.removeEventListener(ticker_world);
    }
    return pages;
} (pages || {} );
