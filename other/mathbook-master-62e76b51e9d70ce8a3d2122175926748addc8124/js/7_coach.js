
var pages = function(pages) {

    pages.prep_7_coach = function(transition){
    	//**//**console.log('function: prep_7_coach');
    	world_current = worlds['7_coach'];
    	
    	ticker_world = (function(){
    		tick_7_coach();
    	});
    	end_world = (function(){
    		end_7_coach();
    	});
    	narrDone = (function(){
    		narrDone_7_coach();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	//** page assets:
    	racetrack = new createjs.Bitmap(images['7-track']);
    	racetrack.x = 75; racetrack.y = 200;
    	world_current.addChild(racetrack);
    
    	pops = new createjs.SpriteSheet(spritesheets['pops_walk_run']);
    	pops.startX = 580;
    	pops.leftX = -100; pops.rightX = 1150; //leftX is leftside destination when scale is -1. rightX rightside destination when scale is +1
    	
    	pops.gotoAndPlay('idle');
    	pops.x = pops.startX; pops.y = 60;
    	world_current.addChild(pops);
    	
    	
    	stopwatch = new createjs.Bitmap(images['7-stopwatch-start']);
    	stopwatch.regX = stopwatch.image.width/2;
    	stopwatch.regY = stopwatch.image.height/2;
    	stopwatch.x = canvas.width/2; stopwatch.y = 388;
    	stopwatch.scaleX = stopwatch.scaleY = 0.9;
    	world_current.addChild(stopwatch);
    
    	stopwatch_running = new createjs.Bitmap(images['7-stopwatch-running']);
    	stopwatch_running.regX = stopwatch_running.image.width/2;
    	stopwatch_running.regY = stopwatch_running.image.height/2;
    	stopwatch_running.x = stopwatch.x;
    	stopwatch_running.y = stopwatch.y;
    	stopwatch_running.scaleX = stopwatch_running.scaleY = 0.9;
    	stopwatch_running.visible = false;
    	world_current.addChild(stopwatch_running);
    
    	paceTimer = new createjs.Text("", "24px Nunito", "black");
    	paceTimer.count = 0;
    	paceTimer.on = false;
    	paceTimer.x = 446; paceTimer.y = 374;
    	world_current.addChild(paceTimer);
    
    	popsTravelling = false;
    	popsTravelType = 0; //randomInt time, use %2 to alternate between 'fast' and 'slow travel
    
    	//
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText(900);
    
    	//params: sndID, defintion words in array
    	renderNarration('7_coach', ['measure', 'amount', 'distance']);
    
    	setDefinitionText();
    	//********
    
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_7_coach);
    
    
    
    }
    
    //level specific functions:
    
    function trackGo(){
    	if(popsTravelling) return;
    
    	popsTravelling = true;
    	popsTravelType = randomInt(0,3);
    	createjs.Tween.removeTweens(pops);
    
    
    	var runSpeed;
    	if (popsTravelType % 2 == 0){		
    		runSpeed = 3000;
    		pops.gotoAndPlay('walk');
    		if(!narrActive) playSound('slow_pug');
    	} 
    
    	else{		
    		runSpeed = 1000;
    		pops.gotoAndPlay('run');
    		if(!narrActive) playSound('fast_pug');
    	}
    
    	stopwatch.visible = false;
    	stopwatch_running.visible = true;
    
    	var destX;
    	if(pops.scaleX > 0) destX = pops.rightX;
    	if(pops.scaleX < 0) destX = pops.leftX;
    
    
        paceTimer.count = 0;
        paceTimer.text = paceTimer.count;
    	paceTimer.on = true;
    
    	createjs.Tween.get(pops, {loop:false})
         .to({x: destX}, runSpeed, createjs.Ease.sineIn)
         .call(function(){
         	
         	pops.scaleX *= -1;
         	if(pops.scaleX < 0) pops.x -= 700;	
         	else pops.x += 700;
         	
         	//testing if a def is visible. only stop sound (stopwatch) if no definition audio is playing
         	var dvis = false;
         	
         	for(var i=0;i<definitionBoxes.length;i++){
         		if(definitionBoxes[i].visible) dvis = true; ////**console.log("A DEF IF VISIBLE");	
         	}
    
    		if(dvis==false){
    			////**console.log('ok to stop sound');
    			stopSound();	
    		} 
    
         	pops.gotoAndPlay('idle');
         	paceTimer.on = false;
    
    		stopwatch.visible = true;
    		stopwatch_running.visible = false;
    
         	popsTravelling = false;
         });
    
    }
    
    
    function narrDone_7_coach(){
    
    	doPulse(stopwatch);
    	addShadow(stopwatch);
    
    	stopwatch.on("click", trackGo);	
    
    }
    //called once this level is fully slid into place
    function begin_7_coach(){
    	//**//**console.log("WORLD 4 BEGIN");
    
    	playSound('7_coach');	
    }
    
    
    
    function tick_7_coach(){
    	stage.update();
    
    	if(paceTimer.on){
    		paceTimer.count++;
    		//paceTimer.text = paceTimer.count;
    		paceTimer.text = Math.round(paceTimer.count/25) + ' seconds';
    	}
    }
    
    
    
    function end_7_coach(){
    	//**//**console.log('end_7_coach');	
    	createjs.Ticker.removeEventListener(ticker_world);
    }

    return pages;
} (pages || {} );
