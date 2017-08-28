var skywheel, srcImages, desImages, radius;

function prep_quizmoskywheel(transition){
	////**console.log('function: prep_quizmoskywheel');
	//world_current = worlds['quizmoskywheel'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmoskywheel();
	});
	end_world = (function(){
		end_quizmoskywheel();
	});
	narrDone = (function(){
		narrDone_quizmoskywheel();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmoskywheel();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    skywheel_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmoskywheel);
}


function skywheel_init() {
    radius = 250;
    srcImages = [];
    desImages = [];
    var frameRadius = radius - 10; 
    var center = {};
    center.x = radius + 390;
    center.y = radius + 80;
	//adding background color (shape) or image (bitmap, and white border (bitmap)
    var bgImg = new Image();
    bgImg.onload = function() {
	    var bg = new createjs.Bitmap(this);
	    world_current.addChildAt(bg, 0);
        bg.scaleX = canvas.width / this.width;
        bg.scaleY = canvas.height / this.height;
    };
    bgImg.src = quiz_content[qWord][1];

	skywheel = new createjs.Container();
	skywheelBody = new createjs.Bitmap(images['wheel-wheel']);
	skywheelBody.x = 0;
	skywheelBody.y = 0; 
    skywheelBody.scaleX = radius * 2 / skywheelBody.image.width;
    skywheelBody.scaleY = radius * 2 / skywheelBody.image.height;
    skywheel.regX = skywheelBody.image.width / 2 * skywheelBody.scaleX;
    skywheel.regY = skywheelBody.image.height / 2 * skywheelBody.scaleY;
    skywheel.x = center.x; 
    skywheel.y = center.y; 
    skywheel.addChild(skywheelBody);

    var choiceImgs = quiz_content[qWord][2];
    for (var i = 0; i < choiceImgs.length; i++) {
        var choiceImg = choiceImgs[i];
        var image = new Image();
        image.xOffset = choiceImg[1];
        image.yOffset = choiceImg[2];
        image.label = choiceImg[3];
        image.scale = 1;
        if (choiceImg.length > 4) image.scale = choiceImg[4];

        /*var choiceImg = {};
        choiceImg =  choiceImgs[i];
        var image = new Image();
        image.xOffset = choiceImg.xOffset;
        image.yOffset = choiceImg.yOffSet;
        image.label = choiceImg.label;*/


        image.onload = function(evt) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            bmp.startX = this.xOffset;
            bmp.startY = this.yOffset;
            bmp.regX = this.width / 2;
            bmp.regY = this.height / 2;
            bmp.scaleX = bmp.scaleY = this.scale; 
            world_current.addChild(bmp);
            addShadow(bmp);
            doPulse(bmp);
            bmp.on("mousedown", function (evt) {
                this.parent.addChild(this);
                this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            });
            // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
            bmp.on("pressmove", function (evt) {
                this.x = evt.stageX + this.offset.x;
                this.y = evt.stageY + this.offset.y;
                // indicate that the stage should be updated on the next tick:
            });
            bmp.on("pressup", function (evt) {
                var hit = false;
                for (var j = 0; j < desImages.length; j++) {
                    var dest = desImages[j];
                    console.log(dest);
                    var target = evt.target;
                    if (target.image.label != dest.label) continue;

			        var pt = dest.globalToLocal(evt.stageX, evt.stageY);
			        if (dest.hitTest(pt.x, pt.y)) { 
			        	//**//**console.log('target has hit the scale!');
                        hit = true;
                        rightAnswer++;
                        target.x = dest.x;
                        target.y = dest.y;
                        target.rotation = dest.rotation ;
                        createjs.Tween.get(target, {loop:true}).to({rotation:-360}, 20000);
                        skywheel.addChild(target);
                        //console.log(target);
                        if (rightAnswer == srcImages.length) { 
                            isCorrect = true;
		                    playSound('sfx_pie', quiz_effect);
                        }
                        break;
			        }
                }
                if (!hit) {
			        Util.snapback(target);	
	                if(!narrActive) playSound('sfx_lazer');
                }

            });
            world_current.addChild(bmp);
            srcImages.push(bmp);
        }
        image.src = choiceImg[0];
    }

    var cabinImgs = quiz_content[qWord][3];
    for (var i = 0; i < cabinImgs.length; i++) {
        var angle = (i / cabinImgs.length) * 2 * Math.PI; 
        var cabinImg = cabinImgs[i];
        var sprite = new createjs.Sprite(spritesheets[cabinImg[0]]);
        sprite.label = cabinImg[1];
        sprite.name = cabinImg[1];
        var bounds = sprite.getBounds();
        sprite.regX = bounds.width / 2;
        sprite.regY = bounds.height / 2;
        sprite.x = skywheel.regX + frameRadius * Math.cos(angle);
        sprite.y = skywheel.regY + frameRadius * Math.sin(angle);
        if (cabinImg.length > 2) sprite.scaleX = sprite.scaleY = cabinImg[2]; 
        skywheel.addChild(sprite);
        desImages.push(sprite);
    }

	world_current.addChild(skywheel);
    createjs.Tween.get(skywheel, {loop:true}).to({rotation:360}, 20000);
    for (var i = 0; i < desImages.length; i++) {
        createjs.Tween.get(desImages[i], {loop:true}).to({rotation:-360}, 20000);
    }
    console.log(world_current);

}

function rotate(evt) {
    // calculate the change of rotation angle 
    createjs.Tween.pauseAllTweens();
    var currentX = evt.stageX;
    var currentY = evt.stageY;
    var currentAngle = Math.atan((currentY - center.y) / (currentX -center.x)) * 180 / Math.PI; 
    console.log(previousAngle + ":" + currentAngle);
    if (previousAngle == -1) previousAngle = currentAngle;
    else {
        var delta = currentAngle - previousAngle;
        ferryWheelContainer.rotation += delta;
        var icon;
        for (var idx = 0; idx < icons.length; idx++) {
            icon = icons[idx];
            icon.rotation -= delta;
        }
        previousAngle = currentAngle;
    }
}


//called once this level is fully slid into place
function begin_quizmoskywheel(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmoskywheel(){
	//console.log("question has been read for quizmoskywheel");

	btnNarration.visible = false;
	//quizQ_fadein_left(true);

   // console.log(allObjects);
    for (var idx = 0; idx < allObjects.length; idx++) {
        var weight = allObjects[idx];
        doPulse(weight);
        Util.objectDrag(weight, skywheelTrays, objectOnskywheel, null)
    }

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmoskywheel(){
	if(snd_active) btnNarration.visible = true;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function displayCorrectskywheel(machinePosition){
	
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

function displayIncorrectskywheel(machinePosition){
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

function tick_quizmoskywheel(){
    currentTime = (new Date()).getTime();
    var timeSpent = Math.floor((currentTime-pageStartTime)/1000);
	stage.update();
}

function end_quizmoskywheel(){
	//**//**console.log('end_quizmoskywheel');	
	createjs.Ticker.removeEventListener(ticker_world);
}

