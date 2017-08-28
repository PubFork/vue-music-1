
var pages = function(pages) {

    pages.prep_6_policeofficer = function(transition){
    	//**//**console.log('function: prep_6_policeofficer');
    	world_current = worlds['6_policeofficer'];
    	
    	ticker_world = (function(){
    		tick_6_policeofficer();
    	});
    	end_world = (function(){
    		end_6_policeofficer();
    	});
    	narrDone = (function(){
    		narrDone_6_policeofficer();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	//** page assets:
    
    	cop = new createjs.Bitmap(images['6-cop']);
    	cop.x = 710;
    	cop.y = 62;
    
    	road = new createjs.Bitmap(images['6-road']);
    	road.x = 15;
    	road.y = 174;
    
    	car = new createjs.Container();
    	car.x = 55;
    	car.y = road.y - 52;
    	
    	carbody = new createjs.Bitmap(images['6-car-body']);
    
    	wheel1 = new createjs.Bitmap(images['6-car-wheel']);
    	wheel1.regX = wheel1.image.width/2;
    	wheel1.regY = wheel1.image.height/2;
    	wheel1.x = 70; wheel1.y = 75;
    
    	wheel2 = new createjs.Bitmap(images['6-car-wheel']);
    	wheel2.regX = wheel2.image.width/2;
    	wheel2.regY = wheel2.image.height/2;
    	wheel2.x = 222; wheel2.y = 75;	
    
    	car.startX = car.x;
    	car.leftX = 50;
    	car.farleftX = -300;
    	car.wheelspeed = 0;
    	
    	carTravelling = false; //becomes true when car is moving.
    	carTravelType = 0; //int to increment by 1 each time, use %2 to alternate between 'fast' and 'slow travel
    	
    	traveltime = []; //time in ms for tweens
    
    	car.addChild(carbody);
    	car.addChild(wheel1);
    	car.addChild(wheel2);
    
    	world_current.addChild(road);
    	world_current.addChild(car);
    	world_current.addChild(cop);
    
    	radar = new createjs.Bitmap(images['6-radar']);
    	radar.regX = radar.image.width/2;
    	radar.regY = radar.image.height/2;
    	radar.x = canvas.width/2 - 38;
    	radar.y = 380;
    	world_current.addChild(radar);
    
    	speedreading = new createjs.Container(); //show/hide this as needed. 
    	speedreading.x = radar.x - 18;
    	speedreading.y = radar.y - 5;
    	
    	speedtext = new createjs.Text("15", "36px Nunito", "black"); //update text content as needed
    	speedtext.x = 0; speedtext.y = 0;
    	speedtext.textBaseline = "middle";
    
    	mphtext = new createjs.Text("miles per hour", "24px Nunito", "black");
    	mphtext.x = speedtext.x - 53; mphtext.y = speedtext.y + 32;
    	mphtext.textBaseline = "middle";	
    
    	speedreading.addChild(speedtext);
    	speedreading.addChild(mphtext);
    
    	speedreading.alpha = 0;
    	world_current.addChild(speedreading);
    	//
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText();
    
    	//params: sndID, defintion words in array
    	renderNarration('6_policeofficer', ['measure', 'speed', 'check']);
    
    	setDefinitionText();
    	//********
    
    
    	//
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_6_policeofficer);
    
    
    
    }
    
    //level specific functions:
    
    function narrDone_6_policeofficer(){
    	
    	doPulse(radar);
    	addShadow(radar);
    
    	radar.on("click", moveCar);
    }
    
    function moveCar(e){
    	if(carTravelling) return;
    
    	removeShadow(radar);
    	createjs.Tween.removeTweens(car);
    	createjs.Tween.removeTweens(speedreading);
    	
    	speedreading.alpha = 0;
    
    	carTravelling = true;
    
    	createjs.Tween.get(car, {loop:false})
         .to({x: car.farleftX}, 1000, createjs.Ease.linear)
         .call(moveCarFullTravel);
        
    }
    
    function moveCarFullTravel(){
    
    	carTravelType++;
    	car.x = canvas.width + 200;
    
    	if(carTravelType % 2 == 1){
    		car.wheelspeed = 5;	
    		traveltime = 4400;
    		speedtext.text = "15";
    	} 
    	else{
    		car.wheelspeed = 12;	
    		traveltime = 2200;
    		speedtext.text = "45";
    	} 
    
    	createjs.Tween.get(car, {loop:false})
         .to({x: car.leftX}, traveltime, createjs.Ease.linear)
         .call(function(){
         	carTravelling = false;
    
    		if(!narrActive) playSound('car_horn');
    		
    		fadeInRadarTxt();
    	 });	
    
    
    }
    
    function fadeInRadarTxt(){
    	createjs.Tween.get(speedreading, {loop:false})
         .to({alpha: 1}, 300, createjs.Ease.linear);
    
         addShadow(radar);
    }
    
    //called once this level is fully slid into place
    function begin_6_policeofficer(){
    	//**//**console.log("WORLD 5 BEGIN");
    
    	playSound('6_policeofficer');	
    }
    
    
    
    function tick_6_policeofficer(){
    	if(carTravelling){
    		wheel1.rotation-= car.wheelspeed;
    		wheel2.rotation-= car.wheelspeed;		
    	}
    	
    	stage.update();
    }
    
    
    
    function end_6_policeofficer(){
    	//**//**console.log('end_6_policeofficer');	
    	createjs.Tween.removeTweens(car);
    	createjs.Tween.removeTweens(speedreading);
    
    	createjs.Ticker.removeEventListener(ticker_world);
    }
    return pages;
} (pages || {} );
