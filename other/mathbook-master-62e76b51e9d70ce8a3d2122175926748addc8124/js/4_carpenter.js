
var pages = function(pages) {

    pages.prep_4_carpenter = function(transition){
    	//**//**console.log('function: prep_4_carpenter');
    	world_current = worlds['4_carpenter'];
    	
    	ticker_world = (function(){
    		tick_4_carpenter();
    	});
    	end_world = (function(){
    		end_4_carpenter();
    	});
    	narrDone = (function(){
    		narrDone_4_carpenter();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText();
    
    	//params: sndID, defintion words in array
    	renderNarration('4_carpenter', ['calculate', 'width', 'length ']);
    
    	setDefinitionText();
    	//********
    
    
    	//** page assets:
    	//td and board:
    	td = new createjs.Bitmap(images['4-td']);
    	td.x = 115;
    	td.y = 50;
    	//td.rotation=-5;
    	world_current.addChild(td);
    
    	woodboard = new createjs.Bitmap(images['4-board']);
    	woodboard.x = 320;
    	woodboard.y = 255;
    	world_current.addChild(woodboard);
    
    	//
    	mt_body = new createjs.Bitmap(images['4-measuringtape_body']);
    	mt_body.regX = mt_body.image.width/2|0;
    	mt_body.regY = mt_body.image.height/2|0;
    	mt_body.x = 830;
    	mt_body.y = 180;
    
    	retractBtn = new createjs.Shape();
    	retractBtn.graphics.beginFill("white").drawRect(mt_body.x - 55,mt_body.y - 34, 35,52);
    	retractBtn.alpha = 0.01;
    
    	tapeGrabber = new createjs.Shape();
    	tapeGrabber.graphics.beginFill("white").drawRect(mt_body.x - 104, mt_body.y + 6,76,80);
    	tapeGrabber.alpha = 0.01;
    	
    	mt_tape = new createjs.Bitmap(images['4-tapewithtab']);
    	mt_tape.regX = mt_tape.image.width/2|0;
    	mt_tape.regY = mt_tape.image.height/2|0;
    	mt_tape.x = mt_body.x + 205;
    	mt_tape.y = mt_body.y + 46;
    	
    	tapemask = new createjs.Shape();
    	tapemask.graphics.beginFill("green").drawRect(0,mt_body.y+5,mt_body.x-30,mt_body.y+80);
    	tapemask.alpha = 0.9;
    	mt_tape.mask = tapemask;
    
    	tapeText = new createjs.Text("0","32pt Nunito","#ddeeea");
    	tapeText.x = 832;
    	tapeText.y = 178;
    	tapeText.textBaseline = "middle";
    
    	tapeTextFt = new createjs.Text("feet","18pt Nunito","#ddeeea");
    	tapeTextFt.x = 822;
    	tapeTextFt.y = tapeText.y + 30;
    	tapeTextFt.textBaseline = "middle";
    
    	world_current.addChild(mt_body);
    	world_current.addChild(mt_tape);
    	world_current.addChild(retractBtn);	
    	world_current.addChild(tapeGrabber);
    	world_current.addChild(tapeText);
    	world_current.addChild(tapeTextFt);
    	//world_current.addChild(tapemask);
    
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_4_carpenter);
    
    
    
    }
    
    //level specific functions:
    
    function dragTape4(obj){
    	(function(target) {
    		target.on("mousedown", function(evt) {
    			//**//**console.log(evt.target + " pressed!");
    
    			//if(!narrActive) playSound('tapemeasure_out');
    			
    			// bump the target in front of it's siblings:
    			world_current.addChild(target);
    			var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
    
    			target.on("pressmove", function(ev) {
    				if( (target.x >= -450) && (target.x <=0) )
    				{ 
    					target.x = ev.stageX+offset.x;
    					var diff = Math.floor((target.x/-450)*3);
    					if(diff>=0) tapeText.text=diff;
    					////**console.log("TAPE: "+diff)
    				}
    				//if( (target.x <= - 514) && (offset.x>0)) target.x = ev.stageX+offset.x;
    			});
    
    
    			target.on("pressup", function(ev){
    				//**//**console.log(target + " released!");
    				if(target.x < -450){
    					target.x = -450;	
    					////**console.log('<510');
    				} 
    				if(target.x > 0){
    					target.x = 0;
    					//**//**console.log('>0');
    				}
    			});
    
    		});
    	})(obj);
    }
    
    function retractTape4(e)
    {
    	//**//**console.log('retract the tape!');
    	//if(!narrActive) playSound('tapemeasure_in');
    	tapeText.text="0";
    	createjs.Tween.get(tapeGrabber, {loop:false})
         .to({x:0}, 600, createjs.Ease.cubicInOut);
         //.call(tweenBall_forward);
    
    }
    
    //called once this level is fully slid into place
    function begin_4_carpenter(){
    	//**//**console.log("WORLD 6 BEGIN");
    	playSound('4_carpenter');
    }
    
    function narrDone_4_carpenter(){
    	addShadow(mt_tape);
    	doPulse(mt_tape, true);
    	doPulse(retractBtn);
    	doPulse(tapeGrabber);
    	retractBtn.on("click", retractTape4);
    	dragTape4(tapeGrabber);
    }
    
    
    
    function tick_4_carpenter(){
    	stage.update();
    	////**//**console.log("tapeGrabber.x: " + tapeGrabber.x);
    	mt_tape.x = tapeGrabber.x + 1035;
    
    }
    
    
    
    function end_4_carpenter(){
    	createjs.Tween.removeTweens(tapeGrabber);	
    	
    	//**//**console.log('end_4_carpenter');	
    	createjs.Ticker.removeEventListener(ticker_world);
    
    }

    return pages;
} (pages || {} );
