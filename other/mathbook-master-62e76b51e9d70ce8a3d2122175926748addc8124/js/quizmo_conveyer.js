var conveyer, conveyerContainer, conveyerBelt, conveyerBody, currentBmp, totalRight; 
var frame, physics, debug, world, scale;
var objectInterval = 200, timer= 600, SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;

function prep_quizmoconveyer(transition){
	////**console.log('function: prep_quizmoconveyer');
	//world_current = worlds['quizmoconveyer'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmoconveyer();
	});
	end_world = (function(){
		end_quizmoconveyer();
	});
	narrDone = (function(){
		narrDone_quizmoconveyer();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmoconveyer();
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
    conveyer_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmoconveyer);
}


function conveyer_init() {
    totalRight = 0;
    frame = new zim.Frame("fit", 1000, 800, "#FFF");
    var borders = {x:0, y:0, width: canvas.width, height:canvas.height-100};
    physics = new zim.Physics(frame, borders);
    world = physics.world;
    scale = physics.scale;
    physics.remove(physics.borderTop);
    physics.remove(physics.borderLeft);
    physics.remove(physics.borderRight);

    conveyer = new createjs.Sprite(spritesheets["lazer_appendage"]); 
    conveyer.x = 0;
    conveyer.y = 500;
    world_current.addChild(conveyer);
    conveyerContainer = new createjs.Container();
    conveyerContainer.x = 0;
    conveyerContainer.y = 0;
    world_current.addChild(conveyerContainer);

    //var quizSrcImgs = quiz_content[qWord][1];
    //var quizSrcImgs = quiz_content[qWord][1];
    
    //var conveyerBelt = new createjs.Bitmap(story_preload.getResult("conveyerBelt")); 
    conveyerBelt = new createjs.Shape();
    conveyerContainer.addChild(conveyerBelt);
    var beltImg = new Image();
    beltImg.src = "img/quiz/conveyer/conveyer_belt.png";
    beltImg.onload = function() {
        conveyerBelt.graphics.beginStroke("#f00")
            .beginBitmapFill(beltImg, "repeat-x")
            .drawRect(0, 0, 5000, 70);
        conveyerBody  = physics.makeRectangle(5000, 70, false)
        physics.addMap(conveyerBody, conveyerBelt);
        conveyerBody.x = 0;
        conveyerBody.y = 500;
    }

    var quizSrcImgs = quiz_content[qWord][3];
    for (var idx = 0; idx < quizSrcImgs.length; idx++) {
        var quizSrcImg = quizSrcImgs[idx];
        var image = new Image();
        image.xOffset = quizSrcImg[1];
        image.yOffset = quizSrcImg[2];
        image.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            bmp.regY = this.height;
            conveyerContainer.addChild(bmp);
        }
        image.src = quizSrcImg[0];
    }

	//move it where desired for particular quiz question
	btnNarration.x = canvas.width - 100; 
	btnNarration.y = 100; 
	btnNarrationOver.x = btnNarration.x;
	btnNarrationOver.y = btnNarration.y;

    // dynamic objects
    quizSrcImgs = quiz_content[qWord][4];
    for (var i = 0; i < quizSrcImgs.length; i++) {
        var quizSrcImg = quizSrcImgs[i];
        var image = new Image();
        image.xOffset = quizSrcImg[1];
        image.yOffset = quizSrcImg[2];
        image.label = parseInt(quizSrcImg[3]);
        if (image.label == 1) totalRight++;
        image.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            bmp.regX = bmp.image.width / 2;
            bmp.regY = bmp.image.height / 2;
            bmp.label = this.label;
            bmp.on("click", function (evt) {
                if (bmp.label == 1) {
                    var bmpBody = physics.makeRectangle(bmp.image.width, bmp.image.height, true)
                    bmpBody.x = this.x;
                    bmpBody.y = this.y;
                    currentBmp = this;
                    this.body = bmpBody;
                    this.removeAllEventListeners("click");
                    physics.addMap(bmpBody, this);
                    setTimeout(conveyerGo, 2000);
                } else {
                    var origX = this.x;
                    var origY = this.y;
                    var count = 0;
                    createjs.Tween.get(this, {loop: true}).to({x : origX - 10, scaleX: 0.9}, 100, createjs.Ease.bounceOut).to({x: origX, scaleX: 1}, 100, createjs.Ease.bounceOut).to({x: origX + 10, scaleX: 0.9}, 100, createjs.Ease.bounceOut).call(function check(e) { count++; if(count > 5) createjs.Tween.removeTweens(this) } );
                }
            });
            world_current.addChild(bmp);
        }
        image.src = quizSrcImg[0];
    }

}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmoconveyer(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmoconveyer(){
	//**//**console.log("question has been read for quizmoconveyer");

	if(snd_active) btnNarration.visible = true;
	conveyerGo();
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function conveyerGo(){
    physics.removeMap(currentBmp.body);
    conveyerContainer.addChild(currentBmp);
    //currentBmp.y = 0; 
    createjs.Tween.get(conveyerContainer).to({x: conveyerContainer.x - 300}, 1000);
}

function conveyerStop() {

}

function displayCorrectConveyer(machinePosition){
	
}

function displayIncorrectConveyer(machinePosition){

}

function tick_quizmoconveyer(){
    //world.Step(TIMESTEP, 10, 10);
    //world.ClearForces();
    physics.update();
    console.log(conveyerBelt);
	stage.update();
}

function end_quizmoconveyer(){
	//**//**console.log('end_quizmoconveyer');	
	createjs.Ticker.removeEventListener(ticker_world);
}

