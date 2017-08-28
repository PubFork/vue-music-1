var blinkscreen;

function prep_quizmolazer2(transition){
	////**console.log('function: prep_quizmolazer2');
	world_current = worlds['quizmolazer2'];
	
	ticker_world = (function(){
		tick_quizmolazer2();
	});
	end_world = (function(){
		end_quizmolazer2();
	});
	narrDone = (function(){
		narrDone_quizmolazer2();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmolazer2();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;

    init_machine(3);
    init_lazer2(3);

	_quizActive = false;
	isCorrect = false;
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmolazer2);

}

function init_lazer2(choiceNumber) {
	// Appendage - Lazer2 - correct answer

    for (var i = 0; i < choiceNumber; i++) {
	    // Appendage - Splat - correct answer
	    var appendage = new createjs.Sprite( spritesheets["lazer2_appendage"] );
	    appendage.gotoAndStop(0);
	    world_current.addChild(appendage);
	    appendage.x = -108 + 310 * i;
	    appendage.y = -70;
	    appendage.on("animationend", flicker_blinkscreen);
        appendages.push(appendage);
    }

	blinkscreen = new createjs.Shape();	
	blinkscreen.graphics.beginFill("black").drawRect(0,0, canvas.width, canvas.height);
	blinkscreen.alpha = 0.4;
	blinkscreen.visible = false;
	world_current.addChild(blinkscreen);
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmolazer2(){
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

function narrDone_quizmolazer2(){
	//**//**console.log("question has been read for quizmolazer2");

	btnNarration.visible = false;
	quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmolazer2(){
	if(snd_active) btnNarration.visible = true;
    for (var i = 0; i < machines.length; i++) {
	    machines[i].on('click', openMachineLazer2);
	    quiz_answerMouseOver(machines[i]);
    }
}

function openMachineLazer2(e){
	////**console.log("PRESS - lazer2")
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
		        displayCorrectAnswer( e.target.x, add_blink_screen);
		        playSound('sfx_lazer');
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

function add_blink_screen() {
    world_current.addChild(blinkscreen);
}

function flicker_blinkscreen(){
	createjs.Tween.get(blinkscreen)
		.call(showhide_blinkscreen)
		.wait(200)
		.call(showhide_blinkscreen)
		.wait(100)
		.call(showhide_blinkscreen)
		.wait(100)
		.call(showhide_blinkscreen)
		.wait(200)
		.call(showhide_blinkscreen)
		.wait(100)
		.call(showhide_blinkscreen)
		.wait(200)
		.call(showhide_blinkscreen)
		.wait(100)
		.call(showhide_blinkscreen)
		.wait(100)
		.call(showhide_blinkscreen)
		.wait(100)
		.call(showhide_blinkscreen)
        .call(quiz_effect);
}

function showhide_blinkscreen(){ blinkscreen.visible = !blinkscreen.visible; }


function tick_quizmolazer2(){
	stage.update();

}

function end_quizmolazer2(){
	//**//**console.log('end_quizmolazer2');	
	createjs.Ticker.removeEventListener(ticker_world);
}

