var background, srcImages, desImages, cloneChoice, rightAnswer, targetScores, subNarrations, currentIndex; 

function prep_quizmodragdrop(transition){
	////**console.log('function: prep_quizmodragdrop');
	//world_current = worlds['quizmodragdrop'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmodragdrop();
	});
	end_world = (function(){
		end_quizmodragdrop();
	});
	narrDone = (function(){
		narrDone_quizmodragdrop();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmodragdrop();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    var backgroundImg = new Image(); 
    backgroundImg.src = quiz_content[qWord][2];
    backgroundImg.onload = function() {
        background = new createjs.Bitmap(backgroundImg); 
        background.scaleX = stage.canvas.width / this.width;
        background.scaleY = stage.canvas.height / this.height;
        world_current.addChildAt(background, 0);
        dragdrop_init();
    };
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmodragdrop);
}


function dragdrop_init() {
    currentIndex = 0;
    srcImages = [];
    desImages = [];
    targetScores = [];
	//adding background color (shape) or image (bitmap, and white border (bitmap)

	//move it where desired for particular quiz question
	//btnNarration.x = questioncloud.x + questioncloud.regX - 50; 
	//btnNarration.y = questioncloud.y + questioncloud.regY - 50;
	//btnNarrationOver.x = btnNarration.x;
	//btnNarrationOver.y = btnNarration.y;

    subNarrations = [];
    quiz_content[qWord][1].split(",").forEach(function(e) {
        subNarrations.push(e.trim());
        targetScores.push(0);
    });

    var quizSrcImgs = quiz_content[qWord][3];
    var quizDesImgs = quiz_content[qWord][4];

    for (var i = 0; i < quizDesImgs.length; i++) {
        var quizDesImg = quizDesImgs[i];
        if (quizDesImg.src) { // image
            var image = new Image();
            image.xOffset = quizDesImg.x;
            image.yOffset = quizDesImg.y;
            image.labels = quizDesImg.labels;
            if (quizDesImg.animation) image.animation = quizDesImg.animation;
            if (quizDesImg.scale) image.scale = quizDesImg.scale;
            if (quizDesImg.mask) image.addMask = true;
            if (quizDesImg.targetX) image.targetX = quizDesImg.targetX;
            if (quizDesImg.targetY) image.targetY = quizDesImg.targetY;
            image.onload = function() {
                var bmp = new createjs.Bitmap(this);
                bmp.x = this.xOffset;
                bmp.y = this.yOffset; 
                if (this.targetX) bmp.targetX = this.targetX;
                if (this.targetY) bmp.targetY = this.targetY;
                if (this.animation) bmp.animation = this.animation;
                if (this.scale) bmp.scaleX = bmp.scaleY = this.scale;
                else { bmp.scaleX = background.scaleX; bmp.scaleY = background.scaleY; }
                bmp.labels = this.labels;
                for (var labelIdx = 0; labelIdx < this.labels.length; labelIdx++) {
                    if (this.labels[labelIdx] != -1) targetScores[labelIdx]++;

                }
                if (this.addMask) {
                    var bmpMask = new createjs.Shape();
                    bmpMask.graphics.beginFill("green").drawRect(bmp.x, bmp.y, this.width*bmp.scaleX, this.height*bmp.scaleY);
                    bmpMask.alpha = 0.1;
                    bmp.mask = bmpMask;
                }
                desImages.push(bmp);
                world_current.addChildAt(bmp, 1);
            }
            image.src = quizDesImg.src;
        } else {
            var sprite = new createjs.Sprite(spritesheets[quizDesImg.id]);
            sprite.x = quizDesImg.x;
            sprite.y = quizDesImg.y;
            sprite.labels = quizDesImg.labels;
            for (var labelIdx = 0; labelIdx < this.labels.length; labelIdx++) {
                if (this.labels[labelIdx] != -1) targetScores[labelIdx]++;
            }
            if (quizDesImg.scale) {
                sprite.scaleX = sprite.scaleY = quizDesImg.scale;
            } else {
                sprite.scaleX = background.scaleX; 
                sprite.scaleY = background.scaleY;
            }
            if (quizDesImg.targetX) sprite.targetX = quizDesImg.targetX;
            if (quizDesImg.targetY) sprite.targetY = quizDesImg.targetY;
            if (quizDesImg.animation) sprite.animation = quizDesImg.animation;
            if (quizDesImg.mask) {
                var spriteMask = new createjs.Shape();
                spriteMask.graphics.beginFill("green").drawRect(bmp.x, bmp.y, this.width*bmp.scaleX, this.height*bmp.scaleY);
                spriteMask.alpha = 0.1;
                sprite.mask = bmpMask;
            }
            desImages.push(sprite);
            world_current.addChildAt(sprite, 1);
        }
    }

    for (var i = 0; i < quizSrcImgs.length; i++) {
        var quizSrcImg = quizSrcImgs[i];
        if (quizSrcImg.src) { // it is a png
            var image = new Image();
            image.xOffset = quizSrcImg.x;
            image.yOffset = quizSrcImg.y;
            image.labels = quizSrcImg.labels;
            if (quizSrcImg.targetX) image.targetX = quizSrcImg.targetX;
            if (quizSrcImg.targetY) image.targetY = quizSrcImg.targetY;
            if (quizSrcImg.animation) image.animation = quizSrcImg.animation;
            if (quizSrcImg.scale) image.scale = quizSrcImg.scale; 
            if (quizSrcImg.clone) image.needClone = quizSrcImg.clone;
            else image.needClone = false;
            image.onload = function(quizSrcImg) {
                var bmp = new createjs.Bitmap(this);
                bmp.x = this.xOffset;
                bmp.y = this.yOffset;
                bmp.startX = this.xOffset;
                bmp.startY = this.yOffset;
                if (this.scale) bmp.scaleX = bmp.scaleY = this.scale; 
                else {
                    bmp.scaleX = background.scaleX;
                    bmp.scaleY = background.scaleY;
                }
                bmp.labels = this.labels;
                bmp.needClone = this.needClone;
                if (this.targetX) bmp.targetX = this.targetX;
                if (this.targetY) bmp.targetY = this.targetY;
                if (this.animation) bmp.animation = this.animation;
                addShadow(bmp);
                doPulse(bmp);
                world_current.addChild(bmp);
                srcImages.push(bmp);
                dragDropAddEvent(bmp);
            }
            image.src = quizSrcImg.src;
        } else { // sprite
            var sprite = new createjs.Sprite(spritesheets[quizSrcImg.id]);
            sprite.x = quizSrcImg.x;
            sprite.y = quizSrcImg.y;
            sprite.startX = sprite.x;
            sprite.startY = sprite.y;
            sprite.labels = quizSrcImg.labels;
            if (quizSrcImg.targetX) sprite.targetX = quizSrcImg.targetX;
            if (quizSrcImg.targetY) sprite.targetY = quizSrcImg.targetY;
            if (quizSrcImg.animation) sprite.animation = quizSrcImg.animation;
            if (quizSrcImg.scale) { 
                sprite.scaleX = sprite.scaleY = quizSrcImg.scale; 
            } else {
                sprite.scaleX = background.scaleX;
                sprite.scaleY = background.scaleY; 
            }
            if (quizSrcImg.clone) sprite.needClone = quizSrcImg.clone;
            else sprite.needClone = false;
            addShadow(sprite);
            doPulse(sprite);
            world_current.addChild(sprite);
            sprite.gotoAndStop("play");
            srcImages.push(sprite);
            dragDropAddEvent(sprite);
        }
    }
}

function dragDropAddEvent(currentObj) {
    currentObj.on("mousedown", function (evt) {
        //this.parent.addChild(this);
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
    });
    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    currentObj.on("pressmove", function (evt) {
        this.x = evt.stageX + this.offset.x;
        this.y = evt.stageY + this.offset.y;
        // indicate that the stage should be updated on the next tick:
        update = true;
    });
    currentObj.on("pressup", function (evt) {
        var hit = false;
        for (var j = 0; j < desImages.length; j++) {
            var dest = desImages[j];
            var target = evt.target;
            if (target.labels[currentIndex] != dest.labels[currentIndex]) continue;
	        var pt = dest.globalToLocal(stage.mouseX, stage.mouseY);
	        if (dest.hitTest(pt.x, pt.y)) { 
	        	//**//**console.log('target has hit the scale!');
                hit = true;
                rightAnswer++;
                var xOffset = 0;
                var yOffset = 0;
                if (target.targetX) xOffset = target.targetX;
                if (target.targetY) yOffset = target.targetY;
                target.x = dest.x + xOffset;
                target.y = dest.y + yOffset;
                if (currentObj.needClone) {
                    cloneChoice = currentObj.clone(); 
                    cloneChoice.x = currentObj.startX;
                    cloneChoice.y = currentObj.startY;
                    cloneChoice.startX = currentObj.startX;
                    cloneChoice.startY = currentObj.startY;
                    cloneChoice.targetX = currentObj.targetX;
                    cloneChoice.targetY = currentObj.targetY;
                    cloneChoice.animation = currentObj.animation;
                    cloneChoice.labels = currentObj.labels;
                    cloneChoice.needClone = currentObj.needClone;
                    world_current.addChild(cloneChoice);
                    dragDropAddEvent(cloneChoice);
                }
                currentObj.removeAllEventListeners("mousedown");
                currentObj.removeAllEventListeners("pressmove");
                currentObj.removeAllEventListeners("pressup");
                if (currentObj.gotoAndPlay) currentObj.gotoAndPlay("play");
                var tweenParameter = {};
                if (dest.targetX) tweenParameter.x = dest.x + dest.targetX;
                if (dest.targetY) tweenParameter.y = dest.y + dest.targetY;
                if (dest.animation && dest.animation == "disappear") { tweenParameter.scaleX = 0; tweenParameter.scaleY = 0;}
                if (Object.keys(tweenParameter).length > 0) createjs.Tween.get(dest).to(tweenParameter, 1000);
                tweenParameter = {};
                if (currentObj.targetX) tweenParameter.x = currentObj.x + currentObj.targetX;
                if (currentObj.targetY) tweenParameter.y = currentObj.y + currentObj.targetY;
                if (currentObj.animation && currentObj.animation == "disappear") { tweenParameter.scaleX = 0; tweenParameter.scaleY = 0;}
                if (Object.keys(tweenParameter).length > 0) createjs.Tween.get(currentObj).to(tweenParameter, 1000);
                if (rightAnswer == targetScores[currentIndex]) { 
                    rightAnswer = 0;
                    if (currentIndex == subNarrations.length - 1) {
                        isCorrect = true; quiz_effect(); 
                    } else {
                        currentIndex++;
                        playSubSound();
                    }
                }
                break;
	        } 
        }
        if (!hit) {
	        Util.snapback(target);	
            if(!narrActive) playSound('sfx_lazer');
        }
    });
}


function resetSourceImages() {
    for (var index = 0; index < srcImages.length; index++) {
        var image = srcImages[index];
        if (image.needClone) {
            image.visible = true;
            image.x = image.startX;
            image.y = image.startY;
        }
    }
    return true;
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmodragdrop(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

    if (currentIndex == 0) playSound('q_'+ qWord, playSubSound);
    else playSubSound();
}

function narrDone_quizmodragdrop(){
	//**//**console.log("question has been read for quizmodragdrop");

	if(snd_active) btnNarration.visible = true;
	//quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmodragdrop(){
	if(snd_active) btnNarration.visible = true;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function displayCorrectDragdrop(machinePosition){
	
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

function displayIncorrectDragdrop(machinePosition){
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

function tick_quizmodragdrop(){
	stage.update();
}

function end_quizmodragdrop(){
	//**//**console.log('end_quizmodragdrop');	
	createjs.Ticker.removeEventListener(ticker_world);
}

