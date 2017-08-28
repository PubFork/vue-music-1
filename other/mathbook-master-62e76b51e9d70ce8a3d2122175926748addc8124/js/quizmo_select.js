var appendages, wordclouds, right_animation1, 
    right_animation2, wrong_animation, choices, answers, 
    wordchoices, imageChoices, numLines, machines,
    positions, positionIndices, currentIndex, choiceNumber; 

function prep_quizmoselect(transition){
	////**console.log('function: prep_quizmoselect');
	//world_current = worlds['quizmoselect'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmoselect();
	});
	end_world = (function(){
		end_quizmoselect();
	});
	narrDone = (function(){
		narrDone_quizmoselect();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmoselect();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;

    init_select(3);

	_quizActive = false;
	isCorrect=false;
	
	//play and stop sound since sound may not have been played yet (no cover page)
	//playSound('empty');
	//stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmoselect);

}

function init_select(numOfChoices) { 
    appendages = [];
    wordclouds = [];
    choices = [];
    answers = [];
    wordchoices = [];
    imagechoices = [];
    numLines = [];
    machines = []; 
    currentIndex = 0;
    choiceNumber = numOfChoices;

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

	//randomize all cake positions between 3 possible spots. word/item positions will relate to bowl of same #
	//array defining choice1.x,choice2.x,choice3.x
	positions = [];
    var choiceDelta = 600 / (choiceNumber - 1)
    for (var idx = 0; idx < choiceNumber; idx++) {
	    positions.push(30 + idx * choiceDelta);	
    }
	//store the positions from left to right BEFORE doing the shuffle
	//posLEFT = positions[0];
	//posMID = positions[1];
	//posRIGHT = positions[2];	
	positions = shuffle(positions);
    positionIndices = new Array(positions.length);
    for (var i = 0; i < positions.length; ++i) positionIndices[i] = i;
    positionIndices.sort(function (a, b) { return positions[a] < positions[b] ? -1 : positions[a] > positions[b] ? 1 : 0; });

	selectedAnswer=0;

    for (var i = 0; i < choiceNumber; i++) {
	    var machine = new createjs.Sprite( spritesheets['quizmo_select'] );
        machine.gotoAndStop("run");
        machine.scaleX = machine.scaleY = 0.6;
        machines.push(machine);
	    machine.x = positions[i];
	    machine.y = 200;

	    world_current.addChild(machine);
    }

    for (var i = 0; i < choiceNumber; i++) {
	    //wordclouds:
	    var wordcloud_bg = new createjs.Bitmap(images['quizmo_text_box']);
        wordclouds.push(wordcloud_bg);
	    wordcloud_bg.x = machines[i].x + 14;
	    wordcloud_bg.y = machines[i].y + 40;

	    //world_current.addChild(wordcloud_bg);
    }

    for (var i = 0; i < choiceNumber; i++) {
	    //choice1,choice2,choice3 are Containers that hold all contents for each answer choice.
	    //entire container can be faded in to include all associated children
	    var choice = new createjs.Container();
        choices.push(choice);
	    choice.alpha = 0;
	    choice.x = positions[i] + 180; 
	    choice.y = 420;
	    world_current.addChild(choice);
    }

    for (var i = 0; i < choiceNumber; i++) {
        var choice = quiz_content[qWord][2][i];
        wordchoices.push(choice.word);
        // quiz_content {word: ["type", "question", [answer1, answer2, answer3...], difficulty]}
        // type: select, fill, drag, link
	    var answer = new createjs.Text(choice.word, "30px Nunito", "black");
        answers.push(answer);
	    if(answer.getMeasuredWidth()+20>wordclouds[i].image.width){
	    	answer.font="25px Nunito";
	    }
	    answer.lineWidth = wordclouds[i].image.width-10;
	    answer.lineHeight = 35;
	    answer.textAlign = "center";
	    answer.x = 0;
	    answer.y = 10;
	    choices[i].addChild(answer);
        var image = new Image();
        image.src = choice.image;
        image.index = i;
        image.onload = function(evt) { 
	        var answerImage = new createjs.Bitmap(this);
	        answerImage.x = this.width * -0.5;
	        answerImage.y = 100;
	        choices[this.index].addChild(answerImage);
        };
    }

	
    for (var i = 0; i < choiceNumber; i++) {
	    var numLine = (answers[i].getMeasuredHeight()  / answers[i].lineHeight) ;
        numLines.push(numLine);
    }
    init_dodo_celebration();
    init_dodo_punish();
}

function init_dodo_celebration() {
	right_animation1 = new createjs.Sprite( spritesheets["select_right"] );
	right_animation1.gotoAndStop(0);
	world_current.addChild(right_animation1);
	right_animation1.x = 300;
	right_animation1.y = 125;
    right_animation1.scaleX = right_animation1.scaleY = 0.6;
	right_animation1.alpha = 0;

	right_animation2 = new createjs.Sprite( spritesheets["select_right2"] );
	right_animation2.gotoAndStop(0);
	world_current.addChild(right_animation2);
	right_animation2.x = 300;
	right_animation2.y = 125;
    right_animation2.scaleX = right_animation2.scaleY = 0.4;
	right_animation2.alpha = 0;
}

function init_dodo_punish() {
	wrong_animation = new createjs.Sprite( spritesheets["select_wrong"] );
	wrong_animation.gotoAndStop(0);
	world_current.addChild(wrong_animation);
	wrong_animation.x = 300;
	wrong_animation.y = 125;
    wrong_animation.scaleX = wrong_animation.scaleY = 0.4;
	wrong_animation.alpha = 0;
}

//level specific functions:
//called once this level is fully slid into place
function begin_quizmoselect(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

    for (var i = 0; i < choices.length; i++) {
	    choices[i].alpha = 0;
    }

    for (var i = 0; i < machines.length; i++) {
	    machines[i].onPress = null;
    }

    console.log('q_' + qWord);
	playSound('q_'+ qWord);
}

function narrDone_quizmoselect(){
	//**//**console.log("question has been read for quizmoselect");

	btnNarration.visible = false;
	selection_fadein(true);

}

function selection_fadein() {
    var choice, wordchoice;
    var machineIndex = positionIndices[currentIndex];
    choice = choices[machineIndex]; 
    wordchoice = wordchoices[machineIndex]; 
    
    if (currentIndex < choiceNumber - 1) {
        fade_in_center(choice, 400);
        playSound(wordchoice, selection_fadein, 400);
    } else {
        fade_in_center(choice, 400);
        playSound(wordchoice, quizQ_fadesDone, 400);
    }
    currentIndex++;
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmoselect(){
	if(snd_active) btnNarration.visible = true;

    for (var i = 0; i < machines.length; i++) {
	    machines[i].on("click", openMachineSelect);
	    quiz_answerMouseOver(machines[i]);
    }

}

function openMachineSelect(e){

	if (!_quizActive) return;

	//once choice is made, remove onPress functions to prevent other choices:
    for (var i = 0; i < machines.length; i++) {
	    machines[i].onPress = null;
    }

	//hide btnNarration
	btnNarration.visible = false;

    e.target.speed = 0.3;
    e.target.play("run");

	//upon making a choice - store which word has been chosen in quiz_finalchoice
    for (var i = 0; i < machines.length; i++) {
        if (e.target == machines[i]) {
            if (i == 0) {
		        isCorrect=true;
		        displayCorrectSelect(e.target.x);
		        playSound('sfx_pie', quiz_effect);
		        _quizActive = false;
            } else {
		        quiz_wiggleAll();
		        isCorrect=false;
		        displayIncorrectSelect(e.target.x)
		        playSound('sfx_wrong',quiz_effect);
            }
            break;
        }
    }

}

function quiz_effect(){
	var sndN = randomInt(1,2);
    console.log("in quiz effect");
	if(isCorrect)
	{
		////**console.log("sndN: " + sndN);
		questionOutcome = 'correct_' + sndN.toString();
	    playSound(questionOutcome, quizQ_finalAudio);
	}else{
		////**console.log("sndN: " + sndN);
		questionOutcome = 'incorrect_' + sndN.toString();
	    playSound(questionOutcome);
	}
}

function displayCorrectSelect(machinePosition){
    right_animation1.x = machinePosition;
    right_animation2.x = machinePosition;
    right_animation1.alpha = 1;	
	right_animation1.gotoAndPlay("run");
    right_animation2.alpha = 1;	
	right_animation2.gotoAndPlay("run");
}

function displayIncorrectSelect(machinePosition){
    wrong_animation.x = machinePosition;
    wrong_animation.alpha = 1;	
    //wrong_animation.frequency = 8;
	wrong_animation.gotoAndPlay("run");
}

function tick_quizmoselect(){
	stage.update();
}

function end_quizmoselect(){
	//**//**console.log('end_quizmoselect');	
	createjs.Ticker.removeEventListener(ticker_world);
}

