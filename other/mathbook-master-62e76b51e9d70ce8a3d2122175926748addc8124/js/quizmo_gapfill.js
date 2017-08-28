var wordclouds, choices, answers, quizAnswer, 
    wordchoices, numLines, answerInput; 

function prep_quizmogapfill(transition){
	////**console.log('function: prep_quizmogapfill');
	//world_current = worlds['quizmogapfill'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmogapfill();
	});
	end_world = (function(){
		end_quizmogapfill();
	});
	narrDone = (function(){
		narrDone_quizmogapfill();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmogapfill();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible = false;
	arrowbgRight.visible = false;
	
	_quizActive = false;
	isCorrect=false;

    gapfill_init();
    init_dodo_celebration();
    init_dodo_punish();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmogapfill);

}

function gapfill_init() {

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

    // Create and place our text field on the canvas
    answerInput = new TextInput(gapfill_checkanswer);
    answerInput.x = 100;
    answerInput.y = 300; 
    answerInput.placeHolder = "?";
    world_current.addChild(answerInput);

    // Updates the text field to the new internal data (ie. placeholder)
    answerInput.update();

    quizAnswer = quiz_content[qWord][2];

	world_current.addChild(questioncloud);
	world_current.addChild(text_question);
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmogapfill(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmogapfill(){
	//**//**console.log("question has been read for quizmogapfill");

	btnNarration.visible = false;
	//quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmogapfill(){
	if(snd_active) btnNarration.visible = true;

}

function gapfill_checkanswer(inputAnswer){
	////**console.log("PRESS - gapfill")
	if (!_quizActive) return;

	//hide btnNarration
	btnNarration.visible = false;

	//check if correct answer	
	if(inputAnswer == quizAnswer){

		isCorrect=true;

		displayCorrectGapfill();
		//playSound('sfx_gapfill',quiz_effect);
		playSound('sfx_pie', quiz_effect);

		_quizActive = false;
		//e.target.gotoAndPlay('popup');
	}
	else{
		quiz_wiggleAll();
		isCorrect=false;
		displayIncorrectGapfill(e.target.x)

		//quiz_wiggleChoice(quiz_finalchoice);
		playSound('sfx_wrong',quiz_effect);
		
	}	
}

function displayCorrectGapfill(){
    right_animation1.alpha = 1;	
	right_animation1.gotoAndPlay("run");
    right_animation2.alpha = 1;	
	right_animation2.gotoAndPlay("run");
}

function displayIncorrectGapfill(machinePosition){
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

function tick_quizmogapfill(){
	stage.update();
}



function end_quizmogapfill(){
	//**//**console.log('end_quizmogapfill');	
	createjs.Ticker.removeEventListener(ticker_world);
}

