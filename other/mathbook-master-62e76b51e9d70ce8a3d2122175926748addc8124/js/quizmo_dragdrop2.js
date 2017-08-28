var srcImages, container, background, rightAnimation1, rightAnimation2, isCorrect, currentIndex, wordchoices, xDirection, yDirection;

function prep_quizmodragdrop2(transition){

    //world_current = worlds['quizmodragdrop2'];
    world_current = worlds[pagenames[currentPage]];

    ticker_world = (function(){
        tick_quizmodragdrop2();
    });
    end_world = (function(){
        end_quizmodragdrop2();
    });
    narrDone = (function(){
        narrDone_quizmodragdrop2();
    });
    quizQ_fadesDone = (function(){
        fadesDone_quizmodragdrop2();
    });

    //if game, visible = false. if storybook, visible = true
    arrowLeft.visible = false;
    arrowRight.visible = false;
    arrowbgLeft.visible=false;
    arrowbgRight.visible=false;

    _quizActive = false;
    isCorrect=false;
    rightAnswer = 0;

    //dragdrop2_init();
    var backgroundImg = new Image();
    backgroundImg.src = quiz_content[qWord][4];
    backgroundImg.onload = function() {
        background = new createjs.Bitmap(backgroundImg);
        background.scaleX = stage.canvas.width / this.width;
        background.scaleY = stage.canvas.height / this.height;
        world_current.addChildAt(background, 0);
        dragdrop2_init();
    };
    //play and stop sound since sound may not have been played yet (no cover page)
    playSound('empty');
    stopSound();

    // passing optional callback function to be called once this world_current is fully transitioned in
    initTransitionAndLoad(transition, begin_quizmodragdrop2);
}


function dragdrop2_init() {
    srcImages = [];
    currentIndex = 0;
    wordchoices = [];
    isCorrect = false;

    //add backgroundImage

    var direction = quiz_content[qWord][2].toLowerCase();
    xDirection = direction.indexOf("x") != -1;
    yDirection = direction.indexOf("y") != -1;
    var quizSrcImgs = quiz_content[qWord][3];

    for (var i = 0; i < quizSrcImgs.length; i++) {
        var quizSrcImg = quizSrcImgs[i];
        var image = new Image();
        var numberImg = new Image();

        var currentContainer = new createjs.Container();
        currentContainer.x = quizSrcImg[0].xOffset;
        currentContainer.y = quizSrcImg[0].yOffset;
        currentContainer.startX = currentContainer.x;
        currentContainer.startY = currentContainer.y;
        currentContainer.rank = parseInt(quizSrcImg[0].rank);
        currentContainer.currentRank = i;
        currentContainer.visible = false;
        world_current.addChild(currentContainer);
        currentContainer.choice = quizSrcImg[0].choice;
        wordchoices.push(currentContainer.choice);
        world_current.addChild(currentContainer);
        image.container =  numberImg.container =currentContainer;

        //every image hava a container
        image.onload = function(quizSrcImg) {
            var container_small = new createjs.Bitmap(this);
            this.x = this.container.x - 20;
            this.container.scaleX = background.scaleX*4/5;
            this.container.scaleY = background.scaleY*4/5;
            this.container.regX = this.width / 2;
            this.container.regY = this.height;

            addShadow(container_small);
            doPulse(container_small);

            this.container.addChildAt(container_small,0);
            this.container.visible = false;
        };

        numberImg.onload = function(quizSrcImg) {
            var container_small = new createjs.Bitmap(this);

            this.container.scaleX = background.scaleX*4/5;
            this.container.scaleY = background.scaleY*4/5;
            this.regX = this.width * 2;
            this.regY = this.height;
            //addShadow(bmp);
            doPulse(container_small);

            this.container.addChild(container_small);
            this.container.visible = false;


        }

        srcImages.push(currentContainer);
        image.src = quizSrcImg[0].src;
        numberImg.src = quizSrcImg[0].numSrc;

    }

    console.log(world_current);
    init_dodo_celebration();
    init_dodo_punish();

}

function dragdrop2_checkanswer(srcObj, destObj) {
    var finish = true;
    for (var idx = 0; idx < srcImages.length; idx++) {
        var container = srcImages[idx];
        console.log(container);
        if (container.currentRank != container.rank) {
            finish = false;
            break;
        }
    }
    if (finish) {
        isCorrect=true;
        displayCorrectDragdrop2();
        _quizActive = false;
        var sndN = randomInt(1,2);
        questionOutcome = 'correct_' + sndN.toString();
        playSound(questionOutcome, quizQ_finalAudio);
    }
    return isCorrect;
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmodragdrop2(){
    //**//**console.log("BEGIN-- cake & skits");
    _quizActive = true;
    playSound('q_'+ qWord);
}

function narrDone_quizmodragdrop2(){
    //**//**console.log("question has been read for quizmodragdrop");
    btnNarration.visible = false;
    dragdrop2_fadein(true);
}

function dragdrop2_fadein() {
    console.log("dragdrop2_fadein:" + currentIndex);
    var choice, wordchoice;
    var choice = srcImages[currentIndex];
    var wordchoice = wordchoices[currentIndex];

    if (currentIndex < srcImages.length - 1 ) {
        fade_in_center(choice, 400);
        playSound(wordchoice, dragdrop2_fadein, 400);
    } else {
        fade_in_center(choice, 400);
        playSound(wordchoice, quizQ_fadesDone, 400);
    }
    currentIndex++;
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmodragdrop2(){
    if(snd_active) btnNarration.visible = true;

    for (var i = 0; i < srcImages.length; i++) {
        var container = srcImages[i];
        container.on("mousedown", function (evt) {
            //this.parent.addChild(this);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            console.log(this.offset);
        });
        // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
        container.on("pressmove", function (evt) {
            if (xDirection) {
                this.x = evt.stageX + this.offset.x;
            }
            if (yDirection) {
                this.y = evt.stageY + this.offset.y;
            }
            // indicate that the stage should be updated on the next tick:
            update = true;
        });
        container.on("pressup", function (evt) {
            var hit = false;
            var correct = false;
            for (var j = 0; j < srcImages.length; j++) {
                var src = srcImages[j];
                if (src.rank == this.rank) continue;
                var target = evt.target.image.container;
                var pt = src.globalToLocal(stage.mouseX, stage.mouseY);
                if (src.hitTest(pt.x, pt.y)) {
                    console.log("hit!!!");
                    //**//**console.log('target has hit the scale!');
                    hit = true;
                    src.x = this.startX;
                    src.y = this.startY;
                    this.x = src.startX;
                    this.y = src.startY;
                    src.startX = this.startX;
                    src.startY = this.startY;
                    this.startX = this.x;
                    this.startY = this.y;
                    var tempRank = src.currentRank;
                    src.currentRank = this.currentRank;
                    this.currentRank = tempRank;

                    correct = dragdrop2_checkanswer();
                    break;
                }
            }
            if (!hit) {
                Util.snapback(target);
            }
        });
        quiz_answerMouseOver(srcImages[i]);
    }

}

function displayCorrectDragdrop2(){
    right_animation1.alpha = 1;
    right_animation1.gotoAndPlay("run");
    right_animation2.alpha = 1;
    right_animation2.gotoAndPlay("run");
}

function displayIncorrectDragdrop2(machinePosition){
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

function tick_quizmodragdrop2(){
    stage.update();
}

function end_quizmodragdrop2(){
    //**//**console.log('end_quizmodragdrop');
    createjs.Ticker.removeEventListener(ticker_world);
}