function prep_quizmoburger(transition){
	//**console.log('function: prep_quizmoburger');
	world_current = worlds['quizmoburger'];
	
	ticker_world = (function(){
		tick_quizmoburger();
	});
	end_world = (function(){
		end_quizmoburger();
	});
	narrDone = (function(){
		narrDone_quizmoburger();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmoburger();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;

	//adding background color (shape) or image (bitmap, and white border (bitmap)
	bg = new createjs.Bitmap(images['quizmo_bg']);
	world_current.addChild(bg);

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
	
	//choice1,choice2,choice3 are Containers that hold all contents for each answer choice.
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

	selectedAnswer=0;


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

	// Appendage - Splat - correct answer
	appendage1 = new createjs.Sprite( spritesheets["burger_appendage"] );
	appendage1.gotoAndStop(0);

	appendage2 = new createjs.Sprite( spritesheets["burger_appendage"] );
	appendage2.gotoAndStop(0);

	appendage3 = new createjs.Sprite( spritesheets["burger_appendage"] );
	appendage3.gotoAndStop(0);

	world_current.addChild(appendage1);
	appendage1.x = 85;
	appendage1.y = machine1.y-240;
	
	world_current.addChild(appendage2);
	appendage2.x = 395;
	appendage2.y = machine2.y-240;

	world_current.addChild(appendage3);
	appendage3.x = 705;
	appendage3.y = machine3.y-240;	

	burger = new createjs.Bitmap(images['quizmo_burger']);	
	burger.regX = burger.image.width/2;
	burger.regY = burger.image.height/2;
	burger.scaleX=burger.scaleY=1;	
	burger.visible=false;

	burger_splat = new createjs.Bitmap(images['quizmo_burger_splat1']);
	burger_splat.visible=false;
	burger_splat.x=0;
	burger_splat.y=0;
	burger_splat.scaleX=burger_splat.scaleY=1.6;

	burger_splat_behind = new createjs.Bitmap(images['quizmo_burger_splat2']);
	burger_splat_behind.visible=false;
	burger_splat_behind.x=55;
	burger_splat_behind.y=70;
	burger_splat_behind.scaleX=burger_splat_behind.scaleY=1.6;

	appendage1.onAnimationEnd=throwburger;
	appendage2.onAnimationEnd=throwburger;
	appendage3.onAnimationEnd=throwburger;

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
	var redx_offx = 122;
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
	
	/*//**console.log("CLOUD: "+wordcloud2.image.width)
	//**console.log("1: "+answer1.getMeasuredHeight()+" / "+answer1.y)
	//**console.log("2: "+answer2.getMeasuredHeight()+" / "+answer2.y)
	//**console.log("3: "+answer3.getMeasuredHeight()+" / "+answer3.y)*/

	////**//**console.log("&*&* wordcloud1 #lines: " + numLines1 );
	numLines1 = (answer1.getMeasuredHeight()  / answer1.lineHeight) ;
	numLines2 = (answer2.getMeasuredHeight()  / answer2.lineHeight) ;
	numLines3 = (answer3.getMeasuredHeight()  / answer3.lineHeight) ;
	
	choice1.addChild(answer1);
	choice2.addChild(answer2);
	choice3.addChild(answer3);

	world_current.addChild(choice1);
	world_current.addChild(choice2);
	world_current.addChild(choice3);

	world_current.addChild(burger);
	world_current.addChild(burger_splat_behind);
	world_current.addChild(burger_splat);

	_quizActive = false;
	isCorrect=false;
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmoburger);

}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmoburger(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	choice1.alpha = 0;
	choice2.alpha = 0;
	choice3.alpha = 0;

	machine1.onPress = null;
	machine2.onPress = null;
	machine3.onPress = null;

	playSound('q_'+ qWord);
}

function narrDone_quizmoburger(){
	//**//**console.log("question has been read for quizmoburger");

	btnNarration.visible = false;
	quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmoburger(){
	if(snd_active) btnNarration.visible = true;

	machine1.onPress = openMachineburger;
	machine2.onPress = openMachineburger;
	machine3.onPress = openMachineburger;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function openMachineburger(e){
	////**console.log("PRESS - burger")
	if (!_quizActive) return;

	//once choice is made, remove onPress functions to prevent other choices:
	machine1.onPress = null;
	machine2.onPress = null;
	machine3.onPress = null;	

	//hide btnNarration
	btnNarration.visible = false;

	//upon making a choice - store which word has been chosen in quiz_finalchoice
	switch (e.target){
		case machine1: quiz_finalchoice = choice1; break;
		case machine2: quiz_finalchoice = choice2; break;
		case machine3: quiz_finalchoice = choice3; break;
	}

	//check if correct answer	
	if(e.target == machine1){
		////**console.log("YAY!!")
		isCorrect=true;

		displayCorrectburger( e.target.x);
		playSound('sfx_splat',quiz_effect);

		_quizActive = false;
		//e.target.gotoAndPlay('popup');
	}

	else{
		quiz_wiggleAll();
		isCorrect=false;
		displayIncorrectburger(e.target.x)

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

function displayCorrectburger(machinePosition){
	
	if(machinePosition == posLEFT){
		machineOffsetX = -120;
		selectedAnswer=0;
		appendage1.gotoAndPlay("all");
	}

	if(machinePosition == posMID){
		machineOffsetX = 20;
		selectedAnswer=1;
		appendage2.gotoAndPlay("all");
	}

	if(machinePosition == posRIGHT){
		machineOffsetX = 200;
		selectedAnswer=2;
		appendage3.gotoAndPlay("all");
	}
}

function throwburger(){
	var selectedAppendage;
	switch(selectedAnswer)
	{
		case 0:
		selectedAppendage=appendage1;
		break;

		case 1:
		selectedAppendage=appendage2;
		break;

		case 2:
		selectedAppendage=appendage3;
		break;
	}
	selectedAppendage.gotoAndStop(0);
	burger.scaleX=burger.scaleY=1;
	//burger.rotation=-90;

	burger.x=selectedAppendage.x+120;
	burger.y=selectedAppendage.y+120;
	burger.visible=true;

	createjs.Tween.get(burger)
		.to({rotation:-50, scaleX:5, scaleY:5}, 600, createjs.Ease.linear)
		.call(function(){
			throwburger2();
			burger.visible=false;
			burger_splat.visible=true;
			burger_splat_behind.visible=true;			
		});

}
function throwburger2(){
		createjs.Tween.get(burger_splat)
			.wait(500)
			.to({y:700},700,createjs.Ease.linear)
			.call(function(){
				burger_splat.visible=false;
		});
}

function displayIncorrectburger(machinePosition){
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

function tick_quizmoburger(){
	stage.update();
}



function end_quizmoburger(){
	//**//**console.log('end_quizmoburger');	
	createjs.Ticker.removeEventListener(ticker_world);
}

