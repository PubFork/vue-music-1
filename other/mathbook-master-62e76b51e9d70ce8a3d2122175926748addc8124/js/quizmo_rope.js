var rope, ropeContainer, background, desImages, currentBmp, totalRight; 
var currentIndex, selectionContainers, subNarrations, desContainers;

function prep_quizmorope(transition){
	////**console.log('function: prep_quizmorope');
	//world_current = worlds['quizmorope'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmorope();
	});
	end_world = (function(){
		end_quizmorope();
	});
	narrDone = (function(){
		narrDone_quizmorope();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmorope();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    // set a stroke dash, and save the command object:

    var backgroundImg = new Image(); 
    backgroundImg.src = quiz_content[qWord][1];
    backgroundImg.onload = function() {
        background = new createjs.Bitmap(backgroundImg); 
        background.scaleX = stage.canvas.width / this.width;
        background.scaleY = stage.canvas.height / this.height;
        world_current.addChildAt(background, 0);
        rope_init();
    };
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmorope);
}


function rope_init() {
    totalRight = 0;
    currentIndex = 0;
    desImages = [];
    subNarrations = [];
    selectionContainers = [];
    desContainers = {};
    
    var ropeImagesConf = quiz_content[qWord][2];
    for (var idx = 0; idx < ropeImagesConf.length; idx++) {
        var ropeImageConf = ropeImagesConf[idx]; 
        if (ropeImageConf.src) { // image
            var ropeImage = new Image(); 
            ropeImage.src = ropeImageConf.src;
            ropeImage.offsetX = ropeImageConf.x ? ropeImageConf.x: 0;
            ropeImage.offsetY = ropeImageConf.y ? ropeImageConf.y: 0;
            ropeImage.onload = function() {
                rope = new createjs.Bitmap(this); 
                rope.scaleX = background.scaleX;
                rope.scaleY = background.scaleY;
                rope.x = this.offsetX;
                rope.y = this.offsetY;
                world_current.addChildAt(rope);
            };
        } else { // sprite
            rope = new createjs.Sprite(spritesheets[ropeImageConf.id]);
            rope.x = ropeImageConf.x ? ropeImageConf.x: 0;
            rope.y = ropeImageConf.y ? ropeImageConf.y: 0;
            rope.targetX = ropeImageConf.x;
            rope.targetY = ropeImageConf.y;
            rope.scaleX = background.scaleX;
            rope.scaleY = background.scaleY;
            rope.gotoAndStop("play");
            world_current.addChild(rope);
        }
    }
    ropeContainer = new createjs.Container();
    ropeContainer.x = 0;
    ropeContainer.y = 0;
    world_current.addChild(ropeContainer);

    //var quizSrcImgs = quiz_content[qWord][1];

    var subQuizIdx = 3;
    while (quiz_content[qWord].length > (subQuizIdx + 1)) {
        desImages.push([]);
        var selectionContainer = new createjs.Container();
        if (subQuizIdx > 3) selectionContainer.visible = false;
        selectionContainers.push(selectionContainer);
        world_current.addChild(selectionContainer);
        var subQuizContent = quiz_content[qWord][subQuizIdx];
        subNarrations.push(subQuizContent[0]);
        // destination objects
        var quizSrcImgs = subQuizContent[1];
        for (var idx = 0; idx < quizSrcImgs.length; idx++) {
            var quizSrcImg = quizSrcImgs[idx];
            var container = new createjs.Container();
            container.x = quizSrcImg[1] + stage.canvas.width * (subQuizIdx - 3);
            container.y = quizSrcImg[2]; 
            container.label = quizSrcImg[3]; 
            if (quizSrcImg[0].targetX) container.targetX = quizSrcImg[0].targetX + stage.canvas.width * (subQuizIdx - 3);
            if (quizSrcImg[0].targetY) container.targetY = quizSrcImg[0].targetY;
            if (quizSrcImg[0].id) {
                var sprite = new createjs.Sprite(spritesheets[quizSrcImg[0].id]);
                sprite.name = "sprite";
                if (quizSrcImg[0].scale) sprite.scaleX = sprite.scaleY = quizSrcImg[0].scale;
                else { sprite.scaleX = background.scaleX; sprite.scaleY = background.scaleY; }
                container.addChild(sprite);
            }
            if (quizSrcImg[0].src) {
                var image = new Image();
                image.xOffset = quizSrcImg[0].x;
                image.yOffset = quizSrcImg[0].y;
                image.container = container;
                image.onload = function(evt) {
                    var bmp = new createjs.Bitmap(this);
                    if (this.xOffset) bmp.x = this.xOffset;
                    if (this.yOffset) bmp.y = this.yOffset;
                    bmp.scaleX = background.scaleX;
                    bmp.scaleY = background.scaleY;
                    this.container.addChild(bmp);
                }
                image.src = quizSrcImg[0].src;
            }
            desContainers[quizSrcImg[0].id] = container; 
            desImages[subQuizIdx - 3].push(container);
            ropeContainer.addChild(container);
        }

        // choice objects
        quizSrcImgs = subQuizContent[2];
        for (var i = 0; i < quizSrcImgs.length; i++) {
            var quizSrcImg = quizSrcImgs[i];
            if (quizSrcImg.src) {
                var image = new Image();
                image.subIndex = subQuizIdx - 3;
                image.xOffset = quizSrcImg.x;
                image.yOffset = quizSrcImg.y;
                image.label = quizSrcImg.label;
                image.click = false;
                if (quizSrcImg.type && quizSrcImg.type.toLowerCase() == "click") { 
                    image.click = true;
                }
                image.onload = function(evt) {
                    var bmp = new createjs.Bitmap(this);
                    bmp.x = this.xOffset;
                    bmp.y = this.yOffset;
                    bmp.startX = bmp.x;
                    bmp.startY = bmp.y;
                    bmp.scaleX = background.scaleX;
                    bmp.scaleY = background.scaleY;
                    //bmp.regX = bmp.image.width / 2;
                    //bmp.regY = bmp.image.height / 2;
                    bmp.label = this.label;
                    bmp.subIndex = this.subIndex;
                    world_current.addChild(bmp);
                    bmp.click = this.click;
                    ropeAddEvent(bmp);
                }
                image.src = quizSrcImg.src;
            } else {
                var sprite = new createjs.Sprite(spritesheets[quizSrcImg.id]);
                sprite.subIndex = subQuizIdx - 3;
                sprite.x = quizSrcImg.x; 
                sprite.y = quizSrcImg.y; 
                sprite.startX = sprite.x; 
                sprite.startY = sprite.y; 
                sprite.label = quizSrcImg.label;
                sprite.name = "sprite";
                sprite.gotoAndStop("play");
                if (quizSrcImg.scale) sprite.scaleX = sprite.scaleY = quizSrcImg.scale;
                else { sprite.scaleX = background.scaleX; sprite.scaleY = background.scaleY; }
                world_current.addChild(sprite);
                if (quizSrcImg.type && quizSrcImg.type.toLowerCase() == "click") { 
                    sprite.click = true;
                }
                ropeAddEvent(sprite);
            }
        }
        subQuizIdx++; 
    }

}

function ropeAddEvent(currentObj) {

    if (currentObj.click) {
        currentObj.on("click", function (evt) {
            var target = evt.target;
            createjs.Tween.get(target).to({scaleX: this.scaleX*1.2, scaleY: this.scaleY*1.2}, 100).to({scaleX: this.scaleX, scaleY: this.scaleY}, 1000);
            for (var j = 0; j < desImages[currentIndex].length; j++) {
                var dest = desImages[currentIndex][j];
                if (dest.label != target.label) continue;
                if (dest.addChild) {
                    if(dest.targetX && dest.targetY) createjs.Tween.get(dest).to({x: dest.targetX, y: dest.targetY}, 1000).call(function() {
                        playSound("train_whistle", ropeGo);
                    });

                    desImages[currentIndex].forEach(function(e) {
                        e.getChildByName("sprite").play("run");
                    });
                } else {
                    dest.parent.addChild(target);
                    target.x = dest.x;
                    createjs.Tween.get(target).to({y: dest.y}, 1000).call(ropeGo);
                }
                target.inPosition = true;
                break;
            }
        });
    } else {
        currentObj.on("mousedown", function (evt) {
            this.offsetX = evt.stageX - this.x; 
            this.offsetY = evt.stageY - this.y; 
            this.scaleX *= 1.2;
            this.scaleY *= 1.2;
        });
        currentObj.on("pressmove", function (evt) {
            this.x = evt.stageX - this.offsetX; 
            this.y = evt.stageY - this.offsetY; 
        });
        currentObj.on("pressup", function(evt) {
            var target = evt.target;
            this.scaleX *= 0.83; 
            this.scaleY *= 0.83;
            for (var j = 0; j < desImages[currentIndex].length; j++) {
                var dest = desImages[currentIndex][j];
                if (dest.label != target.label) continue;
                var pt = dest.globalToLocal(evt.stageX, evt.stageY);
                if (dest.hitTest(pt.x, pt.y)) { 
                    target.inPosition = true;
                    dest.parent.addChild(this);
                    this.x = dest.x;
                    this.y = dest.y;
                    this.removeAllEventListeners("pressmove");
                    this.removeAllEventListeners("mousedown");
                    this.removeAllEventListeners("pressup");
                    this.scaleX = this.scaleY = 1;
                    if(rope && rope.gotoAndPlay) rope.gotoAndPlay("play");
                    if(target.gotoAndPlay) target.gotoAndPlay("play");
                    ropeGo();
                    break;
                } 
            }
            if (!target.inPosition) Util.snapback(target);
        });
    }
    selectionContainers[currentObj.subIndex].addChild(currentObj);
}

function handleJsonLoad(evt) {
    var jsonObject = evt.item;
}

function handleJsonComplete(evt) {
    var allObjects = evt.target._loadItemsById;
    for (var key in allObjects) {
        var obj = allObjects[key];
        if (obj.type != "spritesheet") continue;
        var spritesheet = new createjs.SpriteSheet(obj);
        setTimeout(function(currentKey) {
            var sprite = new createjs.Sprite(spritesheet);
            sprite.name = "sprite";
            sprite.gotoAndStop("play");
            desContainers[currentKey].addChildAt(sprite, 0);
        }, 500, key);
    }
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmorope(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

    if (currentIndex == 0) playSound('q_'+ qWord, playSubSound);
    else playSubSound();
}

function playSubSound() {
	playSound('q_'+ subNarrations[currentIndex]);
}

function narrDone_quizmorope(){
	//**//**console.log("question has been read for quizmorope");

	if(snd_active) btnNarration.visible = true;
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function ropeGo(){
    if (currentIndex < (subNarrations.length - 1)) {
        createjs.Tween.get(ropeContainer).to({x: ropeContainer.x - stage.canvas.width}, 2000).call(function() { if( rope && rope.gotoAndStop) rope.gotoAndPlay("play");});
        selectionContainers[currentIndex].visible = false;
        currentIndex++;
        playSubSound();
        selectionContainers[currentIndex].visible = true;
        console.log(selectionContainers[currentIndex]);
    } else { // the end
        isCorrect = true;
        quiz_effect();
    }
}

function ropeStop() {

}

function displayCorrectRope(machinePosition){
	
}

function displayIncorrectRope(machinePosition){

}

function tick_quizmorope(){
    //world.Step(TIMESTEP, 10, 10);
    //world.ClearForces();
	stage.update();
}

function end_quizmorope(){
	//**//**console.log('end_quizmorope');	
	createjs.Ticker.removeEventListener(ticker_world);
}

