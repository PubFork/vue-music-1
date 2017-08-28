var appendages, wordclouds, wrong_answer_poof, 
    wrong_answer_x, selectedAnswer, choices, answers, 
    wordchoices, numLines, machines, redx_offx, redx_offy; 

function prep_quizmopie(transition){
	////**console.log('function: prep_quizmopie');
    console.log(currentPage + ":" + pagenames[currentPage]);
	world_current = worlds[pagenames[currentPage]];
    world_current.removeAllChildren();
	
	ticker_world = (function(){
		tick_quizmopie();
	});
	end_world = (function(){
		end_quizmopie();
	});
	narrDone = (function(){
		narrDone_quizmopie();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmopie();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;

    init_machine(3);
    init_appendage(3);
    init_pie(3);

	_quizActive = false;
	isCorrect=false;
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmopie);

}

function init_pie(choiceNumber) {
	pie = new createjs.Bitmap(images['quizmo_pie']);
	world_current.addChild(pie);
	pie.regX = pie.image.width/2;
	pie.regY = pie.image.height/2;
	pie.scaleX = pie.scaleY = .4;
	pie.rotation=-90;

	pie.visible=false;

	pie_thrown = new createjs.Container();
	world_current.addChild(pie_thrown);
	pie_thrown.visible = false;
	
	pie_remains = new createjs.Bitmap(images['quizmo_pie_remains']);
	pie_splat = new createjs.Bitmap(images['quizmo_pie_splat']);
	pie_splat.x = 15;
	pie_thrown.addChild(pie_remains);
	pie_thrown.addChild(pie_splat);
}

function init_appendage(choiceNumber) {
    for (var i = 0; i < choiceNumber; i++) {
	    // Appendage - Splat - correct answer
	    var appendage = new createjs.Sprite( spritesheets["pie_appendage"] );
	    appendage.gotoAndStop(0);
	    world_current.addChild(appendage);
        world_current.setChildIndex(appendage, 1);
	    appendage.x = 160 + 310 * i;
	    appendage.y = machines[0].y - 190;
	    appendage.on("animationend", throwPie);
        appendages.push(appendage);
    }
}

function init_machine(choiceNumber) { 
    appendages = [];
    wordclouds = [];
    choices = [];
    answers = [];
    wordchoices = [];
    numLines = [];
    machines = []; 
    selectedAnswer = -1;

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
    //console.log(stage.getChildIndex(world_current));
    console.log(questioncloud.parent);
    console.log(world_current.getChildIndex(questioncloud));
    console.log(stage.getChildIndex(questioncloud));
    world_current.setChildIndex(questioncloud, 10);
    console.log(world_current.getChildIndex(questioncloud));
    //console.log(world_current);
    //console.log(stage);


	//randomize all cake positions between 3 possible spots. word/item positions will relate to bowl of same #
	//array defining choice1.x,choice2.x,choice3.x
	positions = [];
	positions.push(60,370,680);	
	//store the positions from left to right BEFORE doing the shuffle
	posLEFT = positions[0];
	posMID = positions[1];
	posRIGHT = positions[2];	
	positions = shuffle(positions);

    for (var i = 0; i < choiceNumber; i++) {
	    var machine = new createjs.Bitmap( images['quizmo_machine'] );
        machines.push(machine);
	    machine.x = positions[i];
	    machine.y = 450;

	    world_current.addChild(machine);

	    //wordclouds:
	    var wordcloud_bg = new createjs.Bitmap(images['quizmo_text_box']);
        wordclouds.push(wordcloud_bg);
	    wordcloud_bg.x = machines[i].x + 14;
	    wordcloud_bg.y = machines[i].y + 40;

	    world_current.addChild(wordcloud_bg);
    }

	// Appendage - Poof - wrong answer
	wrong_answer_poof = new createjs.Sprite( spritesheets["wrong_answer_poof"] );
	wrong_answer_poof.gotoAndStop(0);
	world_current.addChild(wrong_answer_poof);
	wrong_answer_poof.x = 0; //300 * i;
	wrong_answer_poof.y = 125;
	wrong_answer_poof.alpha = 0;

	//red X for wrong answers:
	redx_offx = 122;
	redx_offy = 180;

	wrong_answer_x = new createjs.Bitmap(images['quizmo_redx']);	
	wrong_answer_x.y = wrong_answer_poof.y + redx_offy;
	wrong_answer_x.alpha = 0;	
	world_current.addChild(wrong_answer_x);

    for (var i = 0; i < choiceNumber; i++) {
	    //choice1,choice2,choice3 are Containers that hold all contents for each answer choice.
	    //entire container can be faded in to include all associated children
	    var choice = new createjs.Container();
        choices.push(choice);
	    choice.alpha = 0;
	    choice.x = positions[i]; 
	    choice.y = 450;
	    world_current.addChild(choice);
    }

    for (var i = 0; i < choiceNumber; i++) {
        wordchoices.push(quiz_content[qWord][2][i]);
        // quiz_content {word: ["type", "question", [answer1, answer2, answer3...], difficulty]}
        // type: select, fill, drag, link
	    var answer = new createjs.Text(quiz_content[qWord][2][i], "30px Nunito", "black");
        answers.push(answer);
	    if(answer.getMeasuredWidth()+20>wordclouds[i].image.width){
	    	answer.font="25px Nunito";
	    }
	    answer.lineWidth = wordclouds[i].image.width-10;
	    answer.lineHeight = 35;
	    answer.textAlign = "center";
	    answer.x = 14 + (wordclouds[i].image.width/2 * wordclouds[i].scaleX);
	    answer.y = 40 + (wordclouds[i].image.height/2 - answers[i].getMeasuredHeight()/2);
	    choices[i].addChild(answer);
    }
	
    /*
    for (var i = 0; i < choiceNumber; i++) {
	    var numLine = (answers[i].getMeasuredHeight()  / answers[i].lineHeight) ;
        numLines.push(numLine);
    }*/
}

//level specific functions:
//called once this level is fully slid into place
function begin_quizmopie(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

    for (var i = 0; i < choices.length; i++) {
	    choices[i].alpha = 0;
    }

    for (var i = 0; i < machines.length; i++) {
	    machines[i].onPress = null;
    }

	playSound('q_'+ qWord);
}

function narrDone_quizmopie(){
	//**//**console.log("question has been read for quizmopie");

	btnNarration.visible = false;
	quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmopie(){
	if(snd_active) btnNarration.visible = true;

    for (var i = 0; i < machines.length; i++) {
	    machines[i].on('click', openMachinePie);
	    quiz_answerMouseOver(machines[i]);
    }

}

function openMachinePie(e){
	if (!_quizActive) return;

	//once choice is made, remove onPress functions to prevent other choices:
    for (var i = 0; i < machines.length; i++) {
	    machines[i].onPress = null;
    }

	//hide btnNarration
	btnNarration.visible = false;

	//upon making a choice - store which word has been chosen in quiz_finalchoice
    for (var i = 0; i < machines.length; i++) {
        if (e.target == machines[i]) {
            if (i == 0) {
		        isCorrect=true;
		        displayCorrectAnswer( e.target.x);
		        playSound('sfx_pie');
		        _quizActive = false;
            } else {
		        quiz_wiggleAll();
		        isCorrect=false;
		        displayIncorrectAnswer(e.target.x)
		        playSound('sfx_wrong',quiz_effect);
            }
            break;
        }
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

function displayCorrectAnswer(machinePosition, callback){
	
	if(machinePosition == posLEFT){
        selectedAnswer = 0;
		machineOffsetX = -120;
		appendages[0].gotoAndPlay("all");
	}

	if(machinePosition == posMID){
        selectedAnswer = 1;
		machineOffsetX = 20;
		appendages[1].gotoAndPlay("all");
	}

	if(machinePosition == posRIGHT){
        selectedAnswer = 2;
		appendages[2].gotoAndPlay("all");
	}

    if (callback) callback();
}

function throwPie(){
    if (appendages.length > 0 && selectedAnswer) appendages[selectedAnswer].gotoAndStop(0);
	pie.scaleX = pie.scaleY =.4;
	pie.rotation = -90;

	pie.x = appendages[selectedAnswer].x+80;;
	pie.y = appendages[selectedAnswer].y+10;
	pie.visible = true;

	createjs.Tween.get(pie)
		.to({rotation:-380, scaleX:2.6, scaleY:2.6},700,createjs.Ease.linear)
		.call(function(){
			pie.visible=false;
			//pie_splat.visible=true;
			//pie_splat.gotoAndPlay("all");
			world_current.addChild(pie_thrown);
			pie_thrown.visible=true;
			slide_pie_down();
	});

}

function slide_pie_down(){
	createjs.Tween.get(pie_splat)
		.to({y:2000}, 3000, createjs.Ease.quartIn)		
		.call(quiz_effect);
}

function resetPieSplat() {
	//pie_splat.gotoAndStop(0);
	//pie_splat.visible=false;
}

function displayIncorrectAnswer(machinePosition){
	if(machinePosition == posLEFT){
	    wrong_answer_poof.x = 0;
	    wrong_answer_x.x = wrong_answer_poof.x + redx_offx;
		wrong_answer_poof.gotoAndPlay("all");
		wrong_answer_poof.alpha = 1;
		wrong_answer_x.alpha = 1;
	}

	if(machinePosition == posMID){
	    wrong_answer_poof.x = 300;
	    wrong_answer_x.x = wrong_answer_poof.x + redx_offx;
		wrong_answer_poof.gotoAndPlay("all");
		wrong_answer_poof.alpha = 1;
		wrong_answer_x.alpha = 1;
	}

	if(machinePosition == posRIGHT){
	    wrong_answer_poof.x = 600;
	    wrong_answer_x.x = wrong_answer_poof.x + redx_offx;
		wrong_answer_poof.gotoAndPlay("all");
		wrong_answer_poof.alpha = 1;
		wrong_answer_x.alpha = 1;
	}
}

function tick_quizmopie(){
	stage.update();
}

function end_quizmopie(){
	//**//**console.log('end_quizmopie');	
	createjs.Ticker.removeEventListener(ticker_world);
}

