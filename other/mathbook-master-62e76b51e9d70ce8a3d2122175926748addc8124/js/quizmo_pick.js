var dashGraphics, dashCmd; 

function prep_quizmopick(transition){
	////**console.log('function: prep_quizmopick');
	//world_current = worlds['quizmopick'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmopick();
	});
	end_world = (function(){
		end_quizmopick();
	});
	narrDone = (function(){
		narrDone_quizmopick();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmopick();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    dashGraphics = new createjs.Graphics();
    dashGraphics.setStrokeStyle(4);
    // set a stroke dash, and save the command object:
    dashCmd = dashGraphics.setStrokeDash([2,10]).command;
    pick_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmopick);
}


function pick_init() {
    var quizSrcImgs = quiz_content[qWord][1];
    if (quizSrcImgs.length == 1) {
        var image = new Image();
        image.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = 0;
            bmp.y = 0;
            bmp.scaleX = canvas.width / bmp.image.width;
            bmp.scaleY = canvas.height / bmp.image.height;
            bmp.on("click", function (evt) {
                alert("error");
            });
            world_current.addChild(bmp);
        }
        image.src = quizSrcImgs[0];
    } else {
        var leftImage = new Image();
        leftImage.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = 0;
            bmp.y = 0;
            bmp.scaleX = canvas.width / 2 / bmp.image.width;
            bmp.scaleY = canvas.height / bmp.image.height;
            world_current.addChild(bmp);
        }
        leftImage.src = quizSrcImgs[0];
        var rightImage = new Image();
        rightImage.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = ~~(canvas.width / 2);
            bmp.y = 0;
            bmp.scaleX = canvas.width / 2 / bmp.image.width;
            bmp.scaleY = canvas.height / bmp.image.height;
            world_current.addChild(bmp);
        }
        rightImage.src = quizSrcImgs[1];
    }

	//move it where desired for particular quiz question
	btnNarration.x = canvas.width - 100; 
	btnNarration.y = 100; 
	btnNarrationOver.x = btnNarration.x;
	btnNarrationOver.y = btnNarration.y;

    var quizSrcImgs = quiz_content[qWord][2];
    var leastPickedItems = quiz_content[qWord][3];
    var right = 0;
    var totalRight = 0;
    for (var i = 0; i < quizSrcImgs.length; i++) {
        var quizSrcImg = quizSrcImgs[i];
        var image = new Image();
        image.xOffset = quizSrcImg[1];
        image.yOffset = quizSrcImg[2];
        image.label = quizSrcImg[3];
        if (image.label == "1") totalRight++;
        image.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            bmp.regX = bmp.image.width / 2;
            bmp.regY = bmp.image.height / 2;
            bmp.label = this.label;
            bmp.alpha = 0.5;
            bmp.on("click", function (evt) {
                if (bmp.label == "1") {
                    createjs.Tween.get(this).to({alpha:1}, 500).call(createjs.proxy(doPulse, this));
                    right++;
                    if (right >= leastPickedItems) arrowRight.visible;
                    if (right == totalRight) playSound('correct_1', quizQ_finalAudio);
	                arrowRight.visible = true;
	                arrowbgRight.visible = true;
                    var shape = new createjs.Shape(dashGraphics);
                    // draw a couple of rectangles with the stroke dash:
                    shape.graphics.beginStroke("gray").drawCircle(bmp.x,bmp.y,100).endStroke();
                    world_current.addChild(shape);
                } else {
                    createjs.Tween.get(this).to({alpha:1}, 500).to({scaleX: 1.2, scaleY: 1.2}, 500)
                        .to({scaleX: 1, scaleY: 1}, 500).to({alpha: 0});
                }
            });
            world_current.addChild(bmp);
        }
        image.src = quizSrcImg[0];
    }

    console.log(world_current);
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmopick(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmopick(){
	//**//**console.log("question has been read for quizmopick");

	btnNarration.visible = false;
	//quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmopick(){
	if(snd_active) btnNarration.visible = true;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function displayCorrectPick(machinePosition){
	
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

function displayIncorrectPick(machinePosition){
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

function tick_quizmopick(){
    dashCmd.offset++; // called in tick
	stage.update();
}

function end_quizmopick(){
	//**//**console.log('end_quizmopick');	
	createjs.Ticker.removeEventListener(ticker_world);
}

