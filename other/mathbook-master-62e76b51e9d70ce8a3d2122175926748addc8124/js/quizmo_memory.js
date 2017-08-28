var memoryImages, currentStep, memoryAnswer, rightButton, wrongButton;

function prep_quizmomemory(transition){
	////**console.log('function: prep_quizmomemory');
	//world_current = worlds['quizmomemory'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmomemory();
	});
	end_world = (function(){
		end_quizmomemory();
	});
	narrDone = (function(){
		narrDone_quizmomemory();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmomemory();
	});

	//if game, visible = false. if storybook, visible = true
	arrowRight.visible = false;
	arrowbgRight.visible=false;
    arrowRight.removeAllEventListeners("click");
	arrowRight.on("click", quizQ_ontoNext);
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    memory_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmomemory);
}


function memory_init() {
    memoryImages = [];
    currentStep = 0;
    var quizSrcImgs = quiz_content[qWord][1];
    memoryAnswer = quiz_content[qWord][2];
    for (var idx = 0; idx < quizSrcImgs.length; idx++) {
        var quizSrcImg = quizSrcImgs[idx];
        var image = new Image();
        image.xOffset = quizSrcImg[1]; 
        image.yOffset = quizSrcImg[2]; 
        image.seq = idx;
        image.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            world_current.addChild(bmp);
            if (this.seq == 0) 
                bmp.visible = true;
            else
                bmp.visible = false;
            memoryImages.push(bmp);
        }
        image.src = quizSrcImg[0];
    }

    rightButton = new Button("right", "img/rtlstorybook/right_button.png", 102, 77, memoryButtonClicked);
    wrongButton = new Button("wrong", "img/rtlstorybook/wrong_button.png", 102, 98, memoryButtonClicked);
    rightButton.x = 400;
    rightButton.y = 500;
    wrongButton.x = 600;
    wrongButton.y = 500;
    world_current.addChild(rightButton); 
    world_current.addChild(wrongButton); 
    rightButton.visible = false;
    wrongButton.visible = false;

	//move it where desired for particular quiz question
	/*btnNarration.x = canvas.width - 100; 
	btnNarration.y = 100; 
	btnNarrationOver.x = btnNarration.x;
	btnNarrationOver.y = btnNarration.y;*/

    setTimeout(memoryNextStep, 2000);
}


function memoryButtonClicked(label) {
    if (label.toLowerCase() == memoryAnswer.toLowerCase()) {
        // right 
        var sndN = randomInt(1,2);
        questionOutcome = 'correct_' + sndN.toString();
	    arrowRight.visible = true;
	    arrowbgRight.visible=true;
    } else {
        // wrong

    }
}

function memoryNextStep() {
    if (currentStep < memoryImages.length - 2) {
        var timeline = new createjs.Timeline(); //create the Timeline
        var fadeOutTween = new createjs.Tween.get(memoryImages[currentStep],{loop: false}).to({visible: false}, 1000)
        currentStep++;
        var fadeInTween = new createjs.Tween.get(memoryImages[currentStep]).to({visible: true}, 1000).call(memoryNextStep)
        timeline.addTween(fadeOutTween, fadeInTween); // add some tweens
    } else {
        var timeline = new createjs.Timeline(); //create the Timeline
        var fadeOutTween = new createjs.Tween.get(memoryImages[currentStep],{loop: false}).to({visible: false}, 1000)
        currentStep++;
        var fadeInTween = new createjs.Tween.get(memoryImages[currentStep]).to({visible: true}, 1000).call(waitResult);
        timeline.addTween(fadeOutTween, fadeInTween); // add some tweens
    }
}

function waitResult() {
    rightButton.visible = true;
    wrongButton.visible = true;
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmomemory(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmomemory(){
	//**//**console.log("question has been read for quizmomemory");

	btnNarration.visible = true;
	//quizQ_fadein_left(true);
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmomemory(){
	if(snd_active) btnNarration.visible = true;

}

function displayCorrectMemory(){
	
}

function tick_quizmomemory(){
	stage.update();
}

function end_quizmomemory(){
	//**//**console.log('end_quizmomemory');	
	createjs.Ticker.removeEventListener(ticker_world);
}

