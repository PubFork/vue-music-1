var points, originalImage, outline, pointContainer, foreground, currentIdx;

function prep_quizmolink2(transition){
	////**console.log('function: prep_quizmolink2');
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmolink2();
	});
	end_world = (function(){
		end_quizmolink2();
	});
	narrDone = (function(){
		narrDone_quizmolink2();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmolink2();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;

    link2_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmolink2);

}

function link2_init() {
    currentIdx = -1;
    points = [];
    outline = new createjs.Shape();
    point_container = new createjs.Container();
    var numbers = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
                   6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten"};
    var image = new Image();
    image.src = quiz_content[qWord][1]; 
    image.onload = function() {
        background = new createjs.Bitmap(this);
        background.scaleX = stage.canvas.width / background.image.width;
        background.scaleY = stage.canvas.height / background.image.height;
        background.x = background.y = 0;
        world_current.addChildAt(background, 0);
    }

    var quizConf = quiz_content[qWord][2];
    var pointSegs = quizConf.points.split(";");
    for (var idx = 0; idx < pointSegs.length; idx++) {
        var coords = pointSegs[idx].split(",");
        if (coords.length != 3) continue;
        var point = new createjs.Sprite(spritesheets['quizmo_point']);
        point.gotoAndStop("play");
        point.regX = 10;
        point.regY = 10;
        var seq = new createjs.Bitmap(images['quizmo_' + numbers[coords[2].trim()]]);
        seq.scaleX = seq.scaleY = 0.6;
        point.x = parseInt(coords[0]);
        point.y = parseInt(coords[1]);
        seq.x = point.x - 20;
        seq.y = point.y;
        point.seq = idx;
        point.addEventListener("click", drawLine);
        points.push(point);
        point_container.addChild(point);
        point_container.addChild(seq);
    }
    if (quizConf.foreground) {
        image = new Image();
        image.src = quizConf.foreground; 
        image.onload = function() {
            foreground = new createjs.Bitmap(this);
            //foreground.scaleX = background.scaleX; 
            //foreground.scaleY = background.scaleY; 
            //foreground.x = quizConf.x; 
            //foreground.y = quizConf.y;
            world_current.addChild(foreground);
        }
    }
    // init canvas
    image = new Image();
    image.src = quizConf.src;
    image.onload = function () {
        originalImage = new createjs.Bitmap(image);
        originalImage.alpha = 0;
        outline.x = point_container.x = originalImage.x = foreground.x = Math.floor((stage.canvas.width - this.width) / 2);
        outline.y = point_container.y = originalImage.y = foreground.y = Math.floor((stage.canvas.height - this.height) / 2);
    
        world_current.addChild(originalImage);
        world_current.addChild(outline);
        world_current.addChild(point_container);
    }

    /*
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
    */
}

function drawLine(evt) {
    var point = evt.target;
    if (point.seq == currentIdx + 1) {
        //point.graphics.beginFill("#66FF00").drawCircle(0, 0, 10);
        // draw line if not the first point
        point.gotoAndPlay("play");
        if (point.seq > 0) {
            outline.graphics.setStrokeStyle(5).setStrokeDash([2,2]).beginStroke("#99FF66").moveTo(points[currentIdx].x, points[currentIdx].y).lineTo(points[currentIdx + 1].x, points[currentIdx + 1].y);
        }
        // last point
        if ( currentIdx + 1 == points.length - 1) {
            outline.graphics.setStrokeStyle(5).setStrokeDash([2,2]).beginStroke("#99FF66").moveTo(points[currentIdx + 1].x, points[currentIdx + 1].y).lineTo(points[0].x, points[0].y);
            currentIdx = -1;
            world_current.removeChild(outline);
            world_current.removeChild(point_container);
            var tween = createjs.Tween.get(originalImage).to({alpha: 0.5}, 1000).to({alpha: 0}, 800).to({alpha: 0.8}, 600).to({alpha: 0}, 500).to({alpha: 1}, 400).call(link2HandleComplete);
        }
        currentIdx++;
    }
    stage.update();
}

function link2HandleComplete() {
	isCorrect=true;
	playSound('sfx_pie', quiz_effect);
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmolink2(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmolink2(){
	//**//**console.log("question has been read for quizmolink2");

	btnNarration.visible = false;
	link2_fadein(true);
}

function link2_fadein() {
    var bmp;
    if (currentIndex < srcImages.length) {
        bmp = srcImages[currentIndex];
        playSound(bmp.word, link2_fadein, 400);
    } else if (currentIndex < srcImages.length + desImages.length - 1) {
        bmp = desImages[currentIndex - srcImages.length];
        playSound(bmp.word, link2_fadein, 400);
    } else {
        bmp = desImages[currentIndex - srcImages.length];
        playSound(bmp.word, fadesDone_quizmolink2, 400);
    }
    fade_in_center(bmp, 400);
    currentIndex++;
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmolink2(){
	if(snd_active) btnNarration.visible = true;
    setup_button();

    for (var idx = 0; idx < srcImages.length; idx++) {
        var bmp = srcImages[idx];
        bmp.on("mousedown", function (evt) {
            //this.parent.addChild(this);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            if (!link2edImages.has(this)) {
                currentLine = new createjs.Shape();
                currentLine.startX = evt.stageX;
                currentLine.startY = evt.stageY;
                currentLine.start = this;
                currentLine.graphics.setStrokeStyle(5).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
                world_current.addChild(currentLine);
                islink2ing = true;
            }
        });

        bmp.on("pressmove", function(evt) {
            if(!islink2ing) return; 

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
            if (!islink2ing) return;
            var hit = false;
            var correct = false;
            for (var j = 0; j < desImages.length; j++) {
                var dest = desImages[j];
                var target = evt.target;
		        var pt = dest.globalToLocal(stage.mouseX, stage.mouseY);
		        if (dest.hitTest(pt.x, pt.y) && ! link2edImages.has(dest)) { 
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
                islink2ing = false;
                link2edImages.add(currentLine.start);
                link2edImages.add(currentLine.end);
                link2edLines.push(currentLine);
                currentLine.right = false;
                if (currentLine.start.label == currentLine.end.label) {
                    currentLine.right = true;
                    right++;
                    if (right == srcImages.length) {
                        isCorrect = true;
		                displayCorrectlink2();
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
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            if (!link2edImages.has(this)) {
                currentLine = new createjs.Shape();
                currentLine.startX = evt.stageX;
                currentLine.startY = evt.stageY;
                currentLine.start = this;
                currentLine.graphics.setStrokeStyle(1).setStrokeDash([2,2]).beginStroke("rgba(0,0,0,1)");
                world_current.addChild(currentLine);
                islink2ing = true;
            }
        });
        bmp.on("pressmove", function(evt) {
            if(!islink2ing) return; 

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
            if (!islink2ing) return;
            var hit = false;
            var correct = false;
            for (var j = 0; j < srcImages.length; j++) {
                var dest = srcImages[j];
                var target = evt.target;
		        var pt = dest.globalToLocal(stage.mouseX, stage.mouseY);
		        if (dest.hitTest(pt.x, pt.y) && !link2edImages.has(dest)) { 
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
                islink2ing = false;
                link2edImages.add(currentLine.start);
                link2edImages.add(currentLine.end);
                link2edLines.push(currentLine);
                currentLine.right = false;
                if (currentLine.start.label == currentLine.end.label) {
                    currentLine.right = true;
                    right++;
                    if (right == srcImages.length) {
                        isCorrect = true;
		                displayCorrectlink2();
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

function displayCorrectlink2(machinePosition){
    right_animation1.x = machinePosition;
    right_animation2.x = machinePosition;
    right_animation1.alpha = 1;	
	right_animation1.gotoAndPlay("run");
    right_animation2.alpha = 1;	
	right_animation2.gotoAndPlay("run");
}

function displayIncorrectlink2(machinePosition){
}

function tick_quizmolink2(){
	stage.update();
}

function end_quizmolink2(){
	//**//**console.log('end_quizmolink2');	
	createjs.Ticker.removeEventListener(ticker_world);
}
