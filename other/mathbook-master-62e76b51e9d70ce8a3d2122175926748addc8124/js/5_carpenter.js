
var pages = function(pages) {

    pages.prep_5_carpenter = function(transition){
    	//**//**console.log('function: prep_5_carpenter');
    	world_current = worlds['5_carpenter'];
    	
    	ticker_world = (function(){
    		tick_5_carpenter();
    	});
    	end_world = (function(){
    		end_5_carpenter();
    	});
    	narrDone = (function(){
    		narrDone_5_carpenter();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//teachertip:
    	teachertipcontainer.onPage = true;
    	teachertiptext.text = "Parent tip: Reinforce new words by using related words or different forms of the same word. Take a moment to talk together about things that are tall, taller, and tallest or small, smaller, and smallest. These words about size will help your child further understand height, width, and length. ";
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	//** page assets:
    	//td and board:
    	alice = new createjs.Bitmap(images['5-alice']);
    	alice.x = 150;
    	alice.y = 190;
    	world_current.addChild(alice);
    
    	door = new createjs.Bitmap(images['5-door']);
    	door.x = 480;
    	door.y = 100;
    	world_current.addChild(door);
    
    	//
    	mt_body = new createjs.Bitmap(images['4-measuringtape_body']);
    	mt_body.regX = mt_body.image.width/2|0;
    	mt_body.regY = mt_body.image.height/2|0;
    	mt_body.rotation = -90;
    	mt_body.scaleX = mt_body.scaleY = 0.85;
    	mt_body.x = 375;
    	mt_body.y = 82;
    
    	retractBtn = new createjs.Shape();
    	retractBtn.graphics.beginFill("white").drawRect(mt_body.x  - 40,mt_body.y + 15 , 60, 35);
    	retractBtn.alpha = 0.01;
    
    
    	tapeGrabber = new createjs.Shape();
    	tapeGrabber.graphics.beginFill("white").drawRect(mt_body.x, mt_body.y + 16,76,80);
    	tapeGrabber.alpha = 0.01;
    	
    	mt_tape = new createjs.Bitmap(images['4-tapewithtab']);
    	mt_tape.regX = mt_tape.image.width/2|0;
    	mt_tape.regY = mt_tape.image.height/2|0;
    	mt_tape.rotation = -90;
    	mt_tape.x = mt_body.x + 40;
    	mt_tape.y = tapeGrabber.y - 100;
    	mt_tape.scaleX = mt_tape.scaleY = 0.85;
    	
    	tapemask = new createjs.Shape();
    	tapemask.graphics.beginFill("green").drawRect(mt_body.x+5,mt_body.y+26,76,400);
    	//tapemask.graphics.beginFill("green").moveTo(mt_body.x+5,mt_body.y+400).lineTo(mt_body.x+5,mt_body.y+55).lineTo(mt_body.x+25,mt_body.y+30).lineTo(mt_body.x+76,mt_body.y+30).lineTo(mt_body.x+76,mt_body.y+400).closePath();
    	//drawRect(mt_body.x + 5, mt_body.y, 76, 400);
    	tapemask.alpha = 0.4;
    	mt_tape.mask = tapemask;
    
    	tapeText = new createjs.Text("0","22pt Nunito","#ddeeea");
    	tapeText.x = 370;
    	tapeText.y = 61;
    	tapeText.textBaseline = "middle";
    
    	tapeTextFt = new createjs.Text("feet","14pt Nunito","#ddeeea");
    	tapeTextFt.x = 363;
    	tapeTextFt.y = tapeText.y + 23;
    	tapeTextFt.textBaseline = "middle";
    
    	world_current.addChild(mt_body);
    	world_current.addChild(mt_tape);
    	world_current.addChild(retractBtn);	
    	world_current.addChild(tapeGrabber);
    	world_current.addChild(tapeText);
    	world_current.addChild(tapeTextFt);
    
    	//world_current.addChild(tapemask);
    
    
    	//
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText();
    
    	//params: sndID, defintion words in array
    	renderNarration('5_carpenter', ['determine', 'size.']);
    
    	setDefinitionText();
    	//********
    
    	//
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_5_carpenter);
    
    
    
    }
    
    //level specific functions:
    
    //start: tapegrabber: 0  , mt_tape: -128
    //end: tapeGrabber.y: 298.10046407874967, mt_tape.y: 170.10046407874967
    
    function dragTape5(obj){
    	(function(target) {
    		obj.on("click", function(evt) {
    			//**//**console.log(evt.target + " pressed!");
    
    			//if(!narrActive) playSound('tapemeasure_out');
    
    			// bump the target in front of it's siblings:
    			world_current.addChild(target);
    			var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
    
    			evt.onMouseMove = function(ev) {
    				if( (target.y <= 300) && (target.y >=0) ) 
    				{
    					target.y = ev.stageY+offset.y;
    					var diff = Math.floor((target.y/300)*6);
    					if(diff>=0) tapeText.text=diff;
    				}
    			}
    
    
    			evt.onMouseUp = function(ev){
    				//**//**console.log(target + " released!");
    				
    				if(target.y > 300) target.y = 300;	
    				if(target.y < 0) target.y = 0;
    				
    			}
    
    		});
    	})(obj);
    }
    
    function retractTape5(e)
    {
    	//**//**console.log('retract the tape!');
    
    	//if(!narrActive) playSound('tapemeasure_in');
    	tapeText.text="0";
    	createjs.Tween.get(tapeGrabber, {loop:false})
         .to({y:0}, 600, createjs.Ease.cubicInOut);
         //.call(tweenBall_forward);
    
    }
    
    //called once this level is fully slid into place
    function begin_5_carpenter(){
    	//**//**console.log("WORLD 5 BEGIN");
    	playSound('5_carpenter');
    }
    
    function narrDone_5_carpenter(){
    	addShadow(mt_tape);
    
    	doPulse(mt_tape, true);
    	doPulse(retractBtn);
    	doPulse(tapeGrabber);
    
    	retractBtn.on("click", retractTape5);
    	dragTape5(tapeGrabber);
    }
    
    
    
    function tick_5_carpenter(){
    	stage.update();
    
    	////**//**console.log("tapeGrabber.y: " + tapeGrabber.y);
    	////**//**console.log("mt_tape.y: " + mt_tape.y);
    	mt_tape.y = tapeGrabber.y - 100;
    
    }
    
    
    
    function end_5_carpenter(){
    	createjs.Tween.removeTweens(tapeGrabber);	
    	
    	//**//**console.log('end_5_carpenter');	
    	createjs.Ticker.removeEventListener(ticker_world);
    }

    return pages;
} (pages || {} );
