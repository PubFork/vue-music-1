
var pages = function(pages) {

    pages.prep_9_kitchen = function(transition){
    	//**//**console.log('function: prep_9_kitchen');
    	world_current = worlds['9_kitchen'];
    	
    	ticker_world = (function(){
    		tick_9_kitchen();
    	});
    	end_world = (function(){
    		end_9_kitchen();
    	});
    	narrDone = (function(){
    		narrDone_9_kitchen();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//teachertip:
    	teachertipcontainer.onPage = false;	
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	//** page assets:
    	ovenbg = new createjs.Bitmap(images['9-oven']);
    	ovenbg.x = 20; ovenbg.y = 80;
    	
    	ovenfront = new createjs.Bitmap(images['9-oven-front']);
    	ovenfront.x = 126; ovenfront.y = 209;
    	
    
    	treats_burnt = new createjs.Bitmap(images['9-treats-burnt']);
    	treats_burnt.x = 145; treats_burnt.y = 240;
    	treats_burnt.visible = false;
    	treats_soggy = new createjs.Bitmap(images['9-treats-soggy']);
    	treats_soggy.x = 145; treats_soggy.y = 240;
    	treats_soggy.visible = false;
    	treats_good = new createjs.Bitmap(images['9-treats-good']);
    	treats_good.x = 145; treats_good.y = 240;
    	treats_good.visible = false;
    
    	skits_neutral = new createjs.Bitmap(images['9-skits-neutral']);
    	skits_neutral.x = 600; skits_neutral.y = 275;
    
    	skits_sad = new createjs.Bitmap(images['9-skits-sad']);
    	skits_sad.x = 600; skits_sad.y = 275;
    	skits_sad.visible = false;
    
    	skits_happy = new createjs.Bitmap(images['9-skits-happy']);
    	skits_happy.x = 600; skits_happy.y = 275;
    	skits_happy.visible = false;
    	
    	world_current.addChild(ovenbg);
    		
    	world_current.addChild(treats_burnt);
    	world_current.addChild(treats_soggy);
    	world_current.addChild(treats_good);
    	world_current.addChild(ovenfront);
    
    	world_current.addChild(skits_neutral);
    	world_current.addChild(skits_sad);
    	world_current.addChild(skits_happy);
    	
    
    	//holds x positions for oven_cursor for each oven/treat state:
    	//0: off, 1: soggy, 2: good, 3: burnt
    	oven_positions = [187, 288, 388, 488];
    
    
    	oven_meter = new createjs.Bitmap(images['9-meter']);
    	oven_meter.regX = oven_meter.image.width/2;
    	oven_meter.regY = oven_meter.image.height/2;
    	oven_meter.x = 338;
    	oven_meter.y = 153;
    	world_current.addChild(oven_meter);
    
    	oven_cursor = new createjs.Bitmap(images['9-cursor']);
    	oven_cursor.regX = oven_cursor.image.width/2;
    	oven_cursor.regY = oven_cursor.image.height/2;
    	oven_cursor.x = oven_positions[0];
    	oven_cursor.y = 180;
    	oven_cursor.startX = oven_cursor.x;
    	world_current.addChild(oven_cursor);
    
    
    	//
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText();
    
    	//params: sndID, defintion words in array
    	renderNarration('9_kitchen', ['temperature']);
    
    	setDefinitionText();
    	//********
    
    
    	//
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_9_kitchen);
    
    
    
    }
    
    //level specific functions:
    function narrDone_9_kitchen(){
    	drag_oven_cursor(oven_cursor);
    }
    
    //oven_cursor min/max: 164 - 509
    function drag_oven_cursor(obj){
    	doPulse(obj);
    	addShadow(obj);
    
    	(function(target) {
    		obj.on("click", function(evt) {
    			//**//**console.log(evt.target + " pressed!");
    			oven_cursor.startX = oven_cursor.x;
    			//if(!narrActive) playSound('tapemeasure_out');
    			// bump the target in front of it's siblings:
    			world_current.addChild(target);
    			var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
    
    			evt.onMouseMove = function(ev) {
    				//if( (target.x >= -420) && (target.x <=0) ) target.x = ev.stageX+offset.x;
    				if( (target.x >= 164) && (target.x <= 509) ) target.x = ev.stageX+offset.x;				
    			}
    
    
    			evt.onMouseUp = function(ev){
    				////**//**console.log( "oven_cursor released!");
    				////**//**console.log(oven_cursor.x);
    
    				var newPos = false;
    				var posX = target.x;
    				for (var i=0; i<oven_positions.length;i++){
    					if( (posX <= oven_positions[i] + 25) && (posX >= oven_positions[i] - 25) ){
    						oven_cursor.x = oven_positions[i];
    						newPos = true;
    						ovenChange(i);
    						break;
    					}
    				}
    				//if no new position for the cursor, return cursor back to where it was grabbed from
    				if (!newPos) oven_cursor.x = oven_cursor.startX;
    			}
    
    		});
    	})(obj);
    }
    
    
    function ovenChange(i){
    	skits_neutral.visible = true;
    	skits_happy.visible = false;
    	skits_sad.visible = false;
    
    	treats_soggy.visible = false;
    	treats_good.visible = false;
    	treats_burnt.visible = false;
    
    	
    	switch(i){
    		case 1: setTimeout(soggyPressed, 600); break;
    		case 2: setTimeout(justrightPressed, 600); break;
    		case 3: setTimeout(burntPressed, 600); break;
    	}
    }
    
    function soggyPressed(){
    	skits_neutral.visible = false;
    	skits_happy.visible = false;
    	skits_sad.visible = true;
    
    	treats_soggy.visible = true;
    	treats_good.visible = false;
    	treats_burnt.visible = false;
    
    	if(!narrActive) playSound('buzzer');
    }
    function burntPressed(){
    	skits_neutral.visible = false;
    	skits_happy.visible = false;
    	skits_sad.visible = true;
    
    
    	treats_soggy.visible = false;
    	treats_good.visible = false;
    	treats_burnt.visible = true;
    
    	if(!narrActive) playSound('buzzer');
    
    }
    function justrightPressed(){
    	skits_neutral.visible = false;
    	skits_sad.visible = false;
    	skits_happy.visible = true;
    
    	treats_soggy.visible = false;
    	treats_good.visible = true;
    	treats_burnt.visible = false;
    
    	if(!narrActive) playSound('ding');
    
    }
    
    //called once this level is fully slid into place
    function begin_9_kitchen(){
    	//**//**console.log("WORLD 9 BEGIN");
    	playSound('9_kitchen');
    }
    
    
    
    function tick_9_kitchen(){
    	stage.update();
    	
    }
    
    
    
    function end_9_kitchen(){
    	//**//**console.log('end_9_kitchen');	
    	createjs.Ticker.removeEventListener(ticker_world);
    }

    return pages;
} (pages || {} );
