function prep_quizmobiscuit(transition){
	////**console.log('function: prep_quizmobiscuit');
	world_current = worlds['quizmobiscuit'];
	
	ticker_world = (function(){
		tick_quizmobiscuit();
	});
	end_world = (function(){
		end_quizmobiscuit();
	});
	narrDone = (function(){
		narrDone_quizmobiscuit();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmobiscuit();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;

	//adding background color (shape) or image (bitmap, and white border (bitmap)
	bg = new createjs.Bitmap(images['quizmo_bg']);
	world_current.addChild(bg);

	// PHYSICS stuff:	  
	  doPhysics = false; //bool set to false at start. set to true once narration is done
	  gravityX = 0;
	  gravityY = 20;

	  // physics objects
	  obj = {}; 
	  wall_top = {};
	  wall_bottom = {};
	  wall_left = {};
	  wall_right = {};	  
	  screen_top = 30; //y-pos of wall_top (ocean surface)
	  screen_bottom = 650; //y-pos of wall_bottom
	  screen_left = 60; //x-pos of wall_left
	  screen_right = canvas.width - screen_left;

	  foodbits = [];
	  foodBatch = 0;
	  shootAllowed = true;

	 

	text_question = new createjs.Text("", "32px Nunito", "black");
	text_question.x = canvas.width/2; 
	text_question.y = 100;
	text_question.lineWidth = 620;
	text_question.lineHeight = 36;
	text_question.textAlign = "center";
	text_question.text = qText;

	questioncloud = new createjs.Bitmap(images['quiz_questioncloud']);
	questioncloud.regX = questioncloud.image.width/2;
	questioncloud.regY = questioncloud.image.height/2;
	questioncloud.scaleX = 1;
	questioncloud.x = text_question.x;
	questioncloud.y = text_question.y + text_question.lineHeight +15;

	//move it where desired for particular quiz question
	btnNarration.x = questioncloud.x + questioncloud.regX - 50; 
	btnNarration.y = questioncloud.y + questioncloud.regY - 50;
	btnNarrationOver.x = btnNarration.x;
	btnNarrationOver.y = btnNarration.y;

	numLinesQ = (text_question.getMeasuredHeight()  / text_question.lineHeight) ;	
	questioncloud.scaleY = 1 + (.1 * numLinesQ);
	if(numLinesQ > 1) questioncloud.y += (numLinesQ -1) * 8;

	world_current.addChild(questioncloud);
	world_current.addChild(text_question);
	
	//choice1,choice2,choice3 are Containrs that hold all contents for each answer choice.
	//entire container can be faded in to include all associated children
	choice1 = new createjs.Container();
	choice2 = new createjs.Container();
	choice3 = new createjs.Container();
	
	choice1.alpha = 0;
	choice2.alpha = 0;
	choice3.alpha = 0;

	//randomize all cake positions between 3 possible spots. word/item positions will relate to bowl of same #
	//array defining choice1.x,choice2.x,choice3.x
	positions = [];
	positions.push(60,370,680);	
		//store the positions from left to right BEFORE doing the shuffle
		posLEFT = positions[0];
		posMID = positions[1];
		posRIGHT = positions[2];	
	positions = shuffle(positions);

	choice1.x = positions[0]; 
	choice1.y = 450;
	
	choice2.x = positions[1]; 
	choice2.y = 450;
	
	choice3.x = positions[2]; 
	choice3.y = 450;


	machine1 = new createjs.Bitmap( images['quizmo_machine'] );
	machine1.x = positions[0];
	machine1.y = 450;

	machine2 = new createjs.Bitmap( images['quizmo_machine'] );
	//machine2.regX = machine2.width / 2;
	machine2.x = positions[1];
	machine2.y = 450;

	machine3 = new createjs.Bitmap( images['quizmo_machine'] );
	machine3.x = positions[2];
	machine3.y = 450;

	world_current.addChild(machine1);
	world_current.addChild(machine2);
	world_current.addChild(machine3);

	//wordclouds:
	wordcloud1 = new createjs.Bitmap(images['quizmo_text_box']);
	wordcloud1.x = machine1.x + 14;
	wordcloud1.y = machine1.y + 40;

	wordcloud2 = new createjs.Bitmap(images['quizmo_text_box']);
	wordcloud2.x = machine2.x + 14;
	wordcloud2.y = machine2.y + 40;

	wordcloud3 = new createjs.Bitmap(images['quizmo_text_box']);
	wordcloud3.x = machine3.x + 14;
	wordcloud3.y = machine3.y + 40;
	
	world_current.addChild(wordcloud1);
	world_current.addChild(wordcloud2);
	world_current.addChild(wordcloud3);

	// Appendage - Biscuit - correct answer
	appendage1 = new createjs.Sprite( spritesheets["splat_appendage"] );
	appendage1.gotoAndStop(0);

	appendage2 = new createjs.Sprite( spritesheets["splat_appendage"] );
	appendage2.gotoAndStop(0);

	appendage3 = new createjs.Sprite( spritesheets["splat_appendage"] );
	appendage3.gotoAndStop(0);

	world_current.addChild(appendage1);
	appendage1.x = -250;
	appendage1.y = -75;

	world_current.addChild(appendage2);
	appendage2.x = 60;
	appendage2.y = -75;

	world_current.addChild(appendage3);
	appendage3.x = 370;
	appendage3.y = -75;	

	// Appendage - Poof - wrong answer
	wrong_answer_poof_1 = new createjs.Sprite( spritesheets["wrong_answer_poof"] );
	wrong_answer_poof_1.gotoAndStop(0);
	world_current.addChild(wrong_answer_poof_1);
	wrong_answer_poof_1.x = -5;
	wrong_answer_poof_1.y = 125;
	wrong_answer_poof_1.alpha = 0;

	wrong_answer_poof_2 = new createjs.Sprite( spritesheets["wrong_answer_poof"] );
	wrong_answer_poof_2.gotoAndStop(0);
	world_current.addChild(wrong_answer_poof_2);
	wrong_answer_poof_2.x = 300;
	wrong_answer_poof_2.y = 125;
	wrong_answer_poof_2.alpha = 0;

	wrong_answer_poof_3 = new createjs.Sprite( spritesheets["wrong_answer_poof"] );
	wrong_answer_poof_3.gotoAndStop(0);
	world_current.addChild(wrong_answer_poof_3);
	wrong_answer_poof_3.x = 615;
	wrong_answer_poof_3.y = 125;
	wrong_answer_poof_3.alpha = 0;

	//red X for wrong answers:
	var redx_offx = 125;
	var redx_offy = 180;

	wrong_answer_x_1 = new createjs.Bitmap(images['quizmo_redx']);	
	wrong_answer_x_1.x = wrong_answer_poof_1.x + redx_offx;
	wrong_answer_x_1.y = wrong_answer_poof_1.y + redx_offy;
	wrong_answer_x_1.alpha =0;	
	world_current.addChild(wrong_answer_x_1);

	wrong_answer_x_2 = new createjs.Bitmap(images['quizmo_redx']);	
	wrong_answer_x_2.x = wrong_answer_poof_2.x + redx_offx;
	wrong_answer_x_2.y = wrong_answer_x_1.y;
	wrong_answer_x_2.alpha =0;	
	world_current.addChild(wrong_answer_x_2);

	wrong_answer_x_3 = new createjs.Bitmap(images['quizmo_redx']);	
	wrong_answer_x_3.x = wrong_answer_poof_3.x + redx_offx;
	wrong_answer_x_3.y = wrong_answer_x_1.y;
	wrong_answer_x_3.alpha =0;	
	world_current.addChild(wrong_answer_x_3);

	//answers:
	wordchoice1 = quiz_content[qWord][1];	
	wordchoice2 = quiz_content[qWord][2];
	wordchoice3 = quiz_content[qWord][3];

	answer1 = new createjs.Text(wordchoice1, "30px Nunito", "black");
	answer2 = new createjs.Text(wordchoice2, "30px Nunito", "black");
	answer3 = new createjs.Text(wordchoice3, "30px Nunito", "black");
	
	if(answer1.getMeasuredWidth()+20>wordcloud1.image.width){
		answer1.font="25px Nunito";
	}
	answer1.lineWidth = wordcloud1.image.width-10;
	answer1.lineHeight = 35;
	answer1.textAlign = "center";
	answer1.x = 14 + (wordcloud1.image.width/2 * wordcloud1.scaleX);
	answer1.y = 40 + (wordcloud1.image.height/2 - answer1.getMeasuredHeight()/2);
	

	if(answer2.getMeasuredWidth()+20>wordcloud2.image.width){
		answer2.font="25px Nunito";
	}
	answer2.lineWidth = wordcloud2.image.width-10;
	answer2.lineHeight = 35;
	answer2.textAlign = "center";
	answer2.x = 14 + (wordcloud2.image.width/2 * wordcloud2.scaleX);
	answer2.y = 40 + (wordcloud2.image.height/2 - answer2.getMeasuredHeight()/2);
	

	if(answer3.getMeasuredWidth()+20>wordcloud3.image.width){
		answer3.font="25px Nunito";
	}
	answer3.lineWidth = wordcloud3.image.width-10;
	answer3.lineHeight = 35;
	answer3.textAlign = "center";
	answer3.x = 14 + (wordcloud3.image.width/2 * wordcloud3.scaleX);
	answer3.y = 40 + (wordcloud3.image.height/2 - answer3.getMeasuredHeight()/2);
	
	
	////**////**console.log("&*&* wordcloud1 #lines: " + numLines1 );
	numLines1 = (answer1.getMeasuredHeight()  / answer1.lineHeight) ;
	numLines2 = (answer2.getMeasuredHeight()  / answer2.lineHeight) ;
	numLines3 = (answer3.getMeasuredHeight()  / answer3.lineHeight) ;	

	choice1.addChild(answer1);
	choice2.addChild(answer2);
	choice3.addChild(answer3);

	world_current.addChild(choice1);
	world_current.addChild(choice2);
	world_current.addChild(choice3);

	makePhysics_6_inventor();

	_quizActive = false;
	isCorrect=false;
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	
	appendage1.gotoAndStop(0);

	//
	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmobiscuit);

}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmobiscuit(){
	////**console.log("BEGIN-- biscuits");
	_quizActive = true;

	choice1.alpha = 0;
	choice2.alpha = 0;
	choice3.alpha = 0;

	machine1.onPress = null;
	machine2.onPress = null;
	machine3.onPress = null;

	playSound('q_'+ qWord);
}

function narrDone_quizmobiscuit(){
	////**console.log("question has been read for quizmobiscuit");

	btnNarration.visible = false;
	quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmobiscuit(){
	if(snd_active) btnNarration.visible = true;

	machine1.onPress = crazyTime;
	machine2.onPress = crazyTime;
	machine3.onPress = crazyTime;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function crazyTime(e){
	////**console.log("QUIZ ACTIVE? "+_quizActive)
	if (!_quizActive) return;
	////**console.log("SELECTED...")
	//once choice is made, remove onPress functions to prevent other choices:
	machine1.onPress = null;
	machine2.onPress = null;
	machine3.onPress = null;	

	//hide btnNarration
	btnNarration.visible = false;

	//appendage1.play();

	//upon making a choice - store which word has been chosen in quiz_finalchoice
	switch (e.target){
		case machine1: quiz_finalchoice = choice1; break;
		case machine2: quiz_finalchoice = choice2; break;
		case machine3: quiz_finalchoice = choice3; break;
	}

	//check if correct answer
	if(e.target == machine1){

		isCorrect=true;

		displayCorrectBiscuit( e.target.x);
		playSound('sfx_biscuits',quiz_effect);

		_quizActive = false;
		//e.target.gotoAndPlay('popup');
	}

	else{
		quiz_wiggleAll();
		isCorrect=false;
		displayIncorrectBiscuits(e.target.x)

		//quiz_wiggleChoice(quiz_finalchoice);
		playSound('sfx_wrong',quiz_effect);
		
	}	
}

function quiz_effect(){
	var sndN = randomInt(1,2);
	if(isCorrect)
	{
		////**console.log("sndN: " + sndN);
		questionOutcome = 'correct_' + sndN.toString();
	}else{
		////**console.log("sndN: " + sndN);
		questionOutcome = 'incorrect_' +  + sndN.toString();
	}
	playSound(questionOutcome, quizQ_finalAudio);
}

function displayCorrectBiscuit(machinePosition){
		if(machinePosition == posLEFT){
			machineOffsetX = -190;
		}

		if(machinePosition == posMID){
			machineOffsetX = 60;
		}

		if(machinePosition == posRIGHT){
			machineOffsetX = 430;
		}

		doPhysics = true;
		shootAllowed = true;
		doShoot();
}

function displayIncorrectBiscuits(machinePosition){
	if(machinePosition == posLEFT){
		wrong_answer_poof_1.gotoAndPlay("all");
		wrong_answer_poof_1.alpha = 1;
		wrong_answer_x_1.alpha = 1;
	}

	if(machinePosition == posMID){
		wrong_answer_poof_2.gotoAndPlay("all");
		wrong_answer_poof_2.alpha = 1;
		wrong_answer_x_2.alpha = 1;
	}

	if(machinePosition == posRIGHT){
		wrong_answer_poof_3.gotoAndPlay("all");
		wrong_answer_poof_3.alpha = 1;
		wrong_answer_x_3.alpha = 1;
	}
}


function tick_quizmobiscuit(){
	stage.update();
	this.world.tick();
}



function end_quizmobiscuit(){
	//**////**console.log('end_quizmobiscuit');	
	createjs.Ticker.removeEventListener(ticker_world);
}

function makePhysics_6_inventor(){
	////**console.log("make stuff!")
	if(world_current != worlds['quizmobiscuit']) return;

    //var _this = this;
    //**////**console.log('this is: ' + this);

    this.world = new EaselBoxWorld(this, frameRate, canvas, gravityX, gravityY, pixelsPerMeter);
    

    wall_top = this.world.addEntity({
    type: 'static',
    color: "blue",
    alpha:0,
    widthPixels: canvas.width *2,
    heightPixels: 10,
    xPixels: 0,
    yPixels: screen_top
    });

	walltopY = wall_top.body.GetPosition().y;

    wall_bottom = this.world.addEntity({
    type: 'static',
    color: "blue",
    alpha:0,
    widthPixels: canvas.width *2,
    heightPixels: 10,
    xPixels: 0,
    yPixels: screen_bottom + 20
    });

	wallbottomY = wall_bottom.body.GetPosition().y;


    wall_right = this.world.addEntity({
    type: 'static',
    color: "blue",
    alpha:0,
    heightPixels: canvas.height *2,
    widthPixels: 50,
    xPixels: canvas.width - 10,
    yPixels: 0
    });

	wallrightX = wall_right.body.GetPosition().x;



	var ball_width = 15;

	machine1left = this.world.addEntity({
	    type: 'static',
	    color: "red",
	    alpha:0,
	    widthPixels: 10,
	    heightPixels: 170,
	    xPixels: 70,
	    yPixels: 560,	    
    });

    machine1right = this.world.addEntity({
	    type: 'static',
	    color: "red",
	    alpha:0,
	    widthPixels: 10,
	    heightPixels: 170,
	    xPixels: 310,
	    yPixels: 560,	    
    });

    machine1top = this.world.addEntity({
	    type: 'static',
	    color: "black",
	    alpha:0,
	    widthPixels: 240,
	    heightPixels: 35,
	    xPixels: 190,
	    yPixels: 480
    });


	machine2left = this.world.addEntity({
	    type: 'static',
	    color: "red",
	    alpha:0,
	    widthPixels: 10,
	    heightPixels: 170,
	    xPixels: 70 + 310,
	    yPixels: 560,	    
    });

    machine2right = this.world.addEntity({
	    type: 'static',
	    color: "red",
	    alpha:0,
	    widthPixels: 10,
	    heightPixels: 170 ,
	    xPixels: 310 + 310,
	    yPixels: 560,	    
    });

    machine2top = this.world.addEntity({
	    type: 'static',
	    color: "black",
	    alpha:0,
	    widthPixels: 240,
	    heightPixels: 35,
	    xPixels: 190 + 310,
	    yPixels: 480
    });


    machine3left = this.world.addEntity({
	    type: 'static',
	    color: "red",
	    alpha:0,
	    widthPixels: 10,
	    heightPixels: 170,
	    xPixels: 70 + 620,
	    yPixels: 560,	    
    });

    machine3right = this.world.addEntity({
	    type: 'static',
	    color: "red",
	    alpha:0,
	    widthPixels: 10,
	    heightPixels: 170 ,
	    xPixels: 310 + 620,
	    yPixels: 560,	    
    });

    machine3top = this.world.addEntity({
	    type: 'static',
	    color: "black",
	    alpha:0,
	    widthPixels: 240,
	    heightPixels: 35,
	    xPixels: 190 + 620,
	    yPixels: 480
    });

	

	
	//making sets of food pellets. create them as STATIC first, then on each machine press, a latest set is made dynamic as its moved into place.
	//foodpellets are hidden at first (visible of easelObj set to false). make easelObj visible TRUE before firing.
	var ballX = 392;  //starting x and y positioning of foodpellets into the machine, before they fire
	var ballY = 334;
	
	var b = 0;
	var randFood = [
		'foodbit1',
		'foodbit2',
		'foodbit3',
		'foodbit4',
		'foodbit5',
		'foodbit6',
		'foodbit7'
	];
	var rf = {};

	//first batch: foodbits[0]
	foodbits[0] = [];
    for (var i=0; i<2; i++){
    	for (var j=0;j<4;j++){
    		rf = randomInt(0, randFood.length-1);
    		var rImg = images[randFood[rf]];

		    foodbits[0][b] = this.world.addEntity({
		    type: 'static',
		    alpha:0, //sets .visible of easelObj to false
		    radiusPixels: ball_width/2,
		    imgSrc: rImg,
		    scaleX: ball_width / rImg.width,
		    scaleY: ball_width / rImg.width,    
		    xPixels: ballX + 15*j,		    
		    yPixels: ballY - 10*j		    
		    });
			
			foodbits[0][b].startX = foodbits[0][b].body.GetPosition().x;
		    foodbits[0][b].startY = foodbits[0][b].body.GetPosition().y;
		    
		    b++;
    	}
    }


    //additional foodbit batches: change # of loop iterations to adjust # of batches that can be fired 
    for (var f=1;f<20;f++){
    	
    	foodbits[f] = [];
    	b = 0;

    	for (var i=0; i<2; i++){
	    	for (var j=0;j<4;j++){
	    		rf = randomInt(0, randFood.length-1);
	    		var rImg = images[randFood[rf]];

			    foodbits[f][b] = this.world.addEntity({
			    type: 'static',
			    radiusPixels: ball_width/2,
			    imgSrc: rImg,
			    scaleX: ball_width / rImg.width,
			    scaleY: ball_width / rImg.width,    
			    xPixels: -30*f - 15*j,
			    yPixels: -30*f  - 15*i,
			    alpha:0,
			    });
				
				foodbits[f][b].startX = foodbits[0][b].startX;
			    foodbits[f][b].startY = foodbits[0][b].startY;
			    
			    b++;
	    	}
    	}
	}



}

function doShoot(){
	////**console.log('shoot!')
	if(world_current != worlds['quizmobiscuit']) return;
	////**console.log("shoot?")
	//foodshooterTop.visible=true;
	if(shootAllowed){
		shootAllowed = false;
		testFire();
		
		setTimeout(function(){
			shootAllowed = true;
		}, 1000);
	}

}

function testFire(){
	if(world_current != worlds['quizmobiscuit']) return;

	if(foodBatch >= foodbits.length) return;

	////**console.log('batch #: ' + foodBatch);

	for (var i=0; i<foodbits[foodBatch].length;i++){

		//////**console.log("machineOffsetX  " + machineOffsetX);

		foodbits[foodBatch][i].setState({
	      xPixels: (foodbits[foodBatch][i].startX*30) + machineOffsetX,
	      yPixels: (foodbits[foodBatch][i].startY*30) - 60
	    });			

	      foodbits[foodBatch][i].selected = false;
	      foodbits[foodBatch][i].setType("dynamic");
		  foodbits[foodBatch][i].easelObj.visible = true; //show hidden pellets just before they fire

		//forceX = randomNum(18,25);
		forceX = randomNum(-20,20);
		forceY = randomNum(-20,-10);
			
		foodbits[foodBatch][i].body.ApplyImpulse(this.world.vector(forceX, forceY), this.world.vector(foodbits[foodBatch][i].body.GetPosition().x, foodbits[foodBatch][i].body.GetPosition().y));
	}
	
	foodBatch++;
}

