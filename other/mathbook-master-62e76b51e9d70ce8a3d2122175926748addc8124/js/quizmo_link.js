var srcImages, desImages, isLinking, fromSrc, fromDes, lines, currentLine, linkedImages, linkedLines, right, currentIndex; 

function prep_quizmolink(transition){
	////**console.log('function: prep_quizmolink');
	world_current = worlds[pagenames[currentPage]];
    console.log(currentPage);
    console.log(pagenames);
    console.log(worlds);
	
	ticker_world = (function(){
		tick_quizmolink();
	});
	end_world = (function(){
		end_quizmolink();
	});
	narrDone = (function(){
		narrDone_quizmolink();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmolink();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;

    stage.enableMouseOver();
    link_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmolink);

}

function link_init() {
    srcImages = [];
    desImages = [];
    lines = [];
    linkedLines = [];
    linkedImages = new Set();
    currentLine = null;
    isLinking = false;
    fromSrc = false;
    fromDes = false;
    right = 0;
    currentIndex = 0;
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

    var quizSrcImgs = quiz_content[qWord][2];
    var quizDesImgs = quiz_content[qWord][3];
    for (var i = 0; i < quizSrcImgs.length; i++) {
        var quizSrcImg = quizSrcImgs[i];
        var image = new Image();
        image.xOffset = quizSrcImg[1];
        image.yOffset = quizSrcImg[2];
        image.label = quizSrcImg[3];
        image.word = quizSrcImg[4];
        image.onload = function(quizSrcImg) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            bmp.startX = this.xOffset;
            bmp.startY = this.yOffset;
            bmp.label = this.label;
            bmp.word = this.word;
            addShadow(bmp);
            doPulse(bmp);
            /*
            bmp.on("rollover", function (evt) {
                this.scaleX = this.scaleY = this.scale * 1.2;
                update = true;
            });
            bmp.on("rollout", function (evt) {
                this.scaleX = this.scaleY = this.scale;
                update = true;
            });*/
            bmp.visible = false;
            world_current.addChild(bmp);
            srcImages.push(bmp);
        }
        image.src = quizSrcImg[0];
    }
    for (var i = 0; i < quizDesImgs.length; i++) {
        var quizDesImg = quizDesImgs[i];
        var image = new Image();
        image.xOffset = quizDesImg[1];
        image.yOffset = quizDesImg[2];
        image.label = quizDesImg[3];
        image.word = quizDesImg[4];
        image.onload = function() {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset; 
            bmp.label = this.label;
            bmp.word = this.word;
            world_current.addChild(bmp);
            /*
            bmp.on("rollover", function (evt) {
                this.scaleX = this.scaleY = this.scale * 1.2;
                update = true;
            });
            bmp.on("rollout", function (evt) {
                this.scaleX = this.scaleY = this.scale;
                update = true;
            });*/
            bmp.visible = false;
            world_current.addChild(bmp);
            desImages.push(bmp);
        }
        image.src = quizDesImg[0];
    }

	world_current.addChild(questioncloud);
	world_current.addChild(text_question);
}

function setup_button() {
    var clear_data = {
         images: ["assets/clear.png"],
         frames: {width:87, height:76},
         animations: {normal:[0], hover:[1], clicked: [0]}
    };
    var cancel_data = {
         images: ["assets/back.png"],
         frames: {width:87, height:76},
         animations: {normal:[0], hover:[1], clicked: [0]}
    };
    var clear_spritesheet = new createjs.SpriteSheet(clear_data);
    var cancel_spritesheet = new createjs.SpriteSheet(cancel_data);
    var clear_button = new createjs.Sprite(clear_spritesheet);
    var cancel_button = new createjs.Sprite(cancel_spritesheet);
    var clear_helper = new createjs.ButtonHelper(clear_button, "normal", "hover", "clicked");
    var cancel_helper = new createjs.ButtonHelper(cancel_button, "normal", "hover", "clicked");
    
    // set the button coordinates and display it on the screen
    clear_button.x = 300;
    clear_button.y = 550;
    cancel_button.x = 450;
    cancel_button.y = 550;
    clear_button.gotoAndStop("normal");
    cancel_button.gotoAndStop("normal");
    world_current.addChild(clear_button); 
    world_current.addChild(cancel_button); 
    clear_button.on("click", function(e) {
        for (i = 0; i < linkedLines.length; i++ ) {
            world_current.removeChild(linkedLines[i]);
            linkedImages.delete(linkedLines[i].start);
            linkedImages.delete(linkedLines[i].end);
        }
        linkedLines = [];
        right = 0;
    });
    cancel_button.on("click", function(e) {
        if (linkedLines.length > 0) {
            var line = linkedLines.pop();
            if (line.right) right--;
            world_current.removeChild(line);
            linkedImages.delete(line.start);
            linkedImages.delete(line.end);
        }
        alert(right);
    });
}

function snapback(target){
	target.x = target.startX;
	target.y = target.startY;	
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmolink(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmolink(){
	//**//**console.log("question has been read for quizmolink");

	btnNarration.visible = false;
	link_fadein(true);
}

function link_fadein() {
    var bmp;
    if (currentIndex < srcImages.length) {
        bmp = srcImages[currentIndex];
        playSound(bmp.word, link_fadein, 400);
    } else if (currentIndex < srcImages.length + desImages.length - 1) {
        bmp = desImages[currentIndex - srcImages.length];
        playSound(bmp.word, link_fadein, 400);
    } else {
        bmp = desImages[currentIndex - srcImages.length];
        playSound(bmp.word, fadesDone_quizmolink, 400);
    }
    fade_in_center(bmp, 400);
    currentIndex++;
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmolink(){
	if(snd_active) btnNarration.visible = true;
    setup_button();

    for (var idx = 0; idx < srcImages.length; idx++) {
        var bmp = srcImages[idx];
        bmp.on("mousedown", function (evt) {
            //this.parent.addChild(this);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            if (!linkedImages.has(this)) {
                currentLine = new createjs.Shape();
                currentLine.startX = evt.stageX;
                currentLine.startY = evt.stageY;
                currentLine.start = this;
                currentLine.graphics.setStrokeStyle(1).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
                world_current.addChild(currentLine);
                isLinking = true;
            }
        });

        bmp.on("pressmove", function(evt) {
            if(!isLinking) return; 

            world_current.removeChild(currentLine);
            currentLine.graphics.clear().setStrokeStyle(1).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
            //currentLine.setStrokeStyle(1);
            //currentLine.beginStroke("#000000");
            // Tell EaselJS where to go to start drawing the line
            currentLine.graphics.moveTo(currentLine.startX, currentLine.startY);
            // Tell EaselJS where to draw the line to
            currentLine.graphics.lineTo(evt.stageX, evt.stageY);
            // Stop drawing this line
            currentLine.graphics.endStroke();
            world_current.addChild(currentLine);
            //stage.update();
        });
        bmp.on("pressup", function (evt) {
            if (!isLinking) return;
            var hit = false;
            var correct = false;
            var target = evt.target;
            for (var j = 0; j < desImages.length; j++) {
                var dest = desImages[j];
		        var pt = dest.globalToLocal(stage.mouseX, stage.mouseY);
		        if (dest.hitTest(pt.x, pt.y) && ! linkedImages.has(dest)) { 
		        	//**//**console.log('target has hit the scale!');
                    hit = true;
                    currentLine.end = dest;
		        } 
            }
            world_current.removeChild(currentLine);
            if (hit) {
                // Tell EaselJS where to go to start drawing the line
                currentLine.graphics.clear().setStrokeStyle(1).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
                currentLine.graphics.moveTo(currentLine.startX, currentLine.startY);
                // Tell EaselJS where to draw the line to
                currentLine.graphics.lineTo(evt.stageX, evt.stageY);
                // Stop drawing this line
                currentLine.graphics.endStroke();
                world_current.addChild(currentLine);
                lines.push(currentLine);
                isLinking = false;
                linkedImages.add(currentLine.start);
                linkedImages.add(currentLine.end);
                linkedLines.push(currentLine);
                currentLine.right = false;
                if (currentLine.start.label == currentLine.end.label) {
                    currentLine.right = true;
                    right++;
                    console.log("right:" + right);
                    if (right == srcImages.length) {
                        isCorrect = true;
		                displayCorrectLink();
		                //playSound('sfx_gapfill',quiz_effect);
		                playSound('sfx_pie', quiz_effect);
		                _quizActive = false;
                    }
                }
            }
        });
    }

    for (var idx = 0; idx < desImages.length; idx++) {
        var bmp = desImages[idx];
        bmp.on("mousedown", function (evt) {
            //this.parent.addChild(this);
            console.log("des mouse down");
            console.log(linkedImages);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            if (!linkedImages.has(this)) {
                console.log("not link");
                currentLine = new createjs.Shape();
                currentLine.startX = evt.stageX;
                currentLine.startY = evt.stageY;
                currentLine.start = this;
                currentLine.graphics.setStrokeStyle(1).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
                world_current.addChild(currentLine);
                isLinking = true;
            }
        });
        bmp.on("pressmove", function(evt) {
            if(!isLinking) return; 

            world_current.removeChild(currentLine);
            currentLine.graphics.clear().setStrokeStyle(1).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
            //currentLine.setStrokeStyle(1);
            //currentLine.beginStroke("#000000");
            // Tell EaselJS where to go to start drawing the line
            currentLine.graphics.moveTo(currentLine.startX, currentLine.startY);
            // Tell EaselJS where to draw the line to
            currentLine.graphics.lineTo(evt.stageX, evt.stageY);
            // Stop drawing this line
            currentLine.graphics.endStroke();
            world_current.addChild(currentLine);
            //stage.update();
        });
        bmp.on("pressup", function (evt) {
            if (!isLinking) return;
            var hit = false;
            var correct = false;
            for (var j = 0; j < srcImages.length; j++) {
                var dest = srcImages[j];
                var target = evt.target;
		        var pt = dest.globalToLocal(stage.mouseX, stage.mouseY);
		        if (dest.hitTest(pt.x, pt.y) && !linkedImages.has(dest)) { 
		        	//**//**console.log('target has hit the scale!');
                    hit = true;
                    currentLine.end = dest;
		        } 
            }
            world_current.removeChild(currentLine);
            if (hit) {
                currentLine.graphics.setStrokeStyle(1).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
                //currentLine.beginStroke("#000000");
                // Tell EaselJS where to go to start drawing the line
                currentLine.graphics.moveTo(currentLine.startX, currentLine.startY);
                // Tell EaselJS where to draw the line to
                currentLine.graphics.lineTo(evt.stageX, evt.stageY);
                // Stop drawing this line
                currentLine.graphics.endStroke();
                world_current.addChild(currentLine);
                lines.push(currentLine);
                isLinking = false;
                linkedImages.add(currentLine.start);
                linkedImages.add(currentLine.end);
                linkedLines.push(currentLine);
                currentLine.right = false;
                if (currentLine.start.label == currentLine.end.label) {
                    currentLine.right = true;
                    right++;
                    console.log("right:" + right);
                    if (right == srcImages.length) {
                        isCorrect = true;
		                displayCorrectLink();
		                //playSound('sfx_gapfill',quiz_effect);
		                playSound('sfx_pie', quiz_effect);
		                _quizActive = false;
                    }
                }
             }
        });
    }

    init_dodo_celebration();
    init_dodo_punish();
}

function displayCorrectLink(machinePosition){
    right_animation1.x = machinePosition;
    right_animation2.x = machinePosition;
    right_animation1.alpha = 1;	
	right_animation1.gotoAndPlay("run");
    right_animation2.alpha = 1;	
	right_animation2.gotoAndPlay("run");
}

function displayIncorrectLink(machinePosition){
}

function tick_quizmolink(){
	stage.update();
}

function end_quizmolink(){
	//**//**console.log('end_quizmolink');	
	createjs.Ticker.removeEventListener(ticker_world);
}
