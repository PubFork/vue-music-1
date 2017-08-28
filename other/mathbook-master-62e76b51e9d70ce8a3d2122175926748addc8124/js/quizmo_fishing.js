var srcImages,  background, rightAnimation1, rightAnimation2, isCorrect, currentIndex, wordchoices, xDirection, yDirection;
var boatContainer,countsContainer,countNations,movetime;

function prep_quizmofishing(transition){

    world_current = worlds[pagenames[currentPage]];

    ticker_world = (function(){
        tick_quizmofishing();
    });
    end_world = (function(){
        end_quizmofishing();
    });
    narrDone = (function(){
        narrDone_quizmofishing();
    });
    quizQ_fadesDone = (function(){
        fadesDone_quizmofishing();
    });

    //if game, visible = false. if storybook, visible = true
    arrowLeft.visible = false;
    arrowRight.visible = false;
    arrowbgLeft.visible=false;
    arrowbgRight.visible=false;

    _quizActive = false;
    isCorrect=false;
    rightAnswer = 0;
    countNations =[];
    fishing_init();

    var backgroundImg = new Image();
    backgroundImg.src = quiz_content[qWord][1].bg;
    backgroundImg.onload = function() {
        background = new createjs.Bitmap(backgroundImg);
        world_current.addChildAt(background, 0);
        fishing_init();
    };
    /*加载背景海的动画*/
    var sea = quiz_content[qWord][4][0];
    var seaSprite = new createjs.Sprite(spritesheets[sea],'sea');
    seaSprite.x = 0;
    seaSprite.y = 300;
    world_current.addChild(seaSprite);

    /*创建一个 Container 包裹船和鱼钩*/
    boatContainer = new createjs.Container();
    //船
    var boat = quiz_content[qWord][4][1];
    var boatSprite = new createjs.Sprite(spritesheets[boat],'boat');
    boatContainer.addChild(boatSprite);
    boatContainer.x = stage.canvas.width / 2;
    boatContainer.y = 170;
    boatContainer.regX = boatSprite.getBounds().width / 2;
    //boatContainer.currentRank = quiz_content[qWord][1].currentRank;
    world_current.addChild(boatContainer);

    //鱼钩   ！！！
    var fishhook = new Image();
    fishhook.onload = function(){
        var hook = new createjs.Bitmap(this);
        hook.scaleY = 0;
        hook.x = 270;
        hook.y = 70;
        boatContainer.addChild(hook);
    };
    fishhook.src = quiz_content[qWord][1].hookSrc;

    /*加载算数式*/
    var countsImgs = quiz_content[qWord][2];
    for(var idx = 0; idx < countsImgs.length; idx++){
        var countsImg = countsImgs[idx];
        var countImg = new Image();
        countsContainer = new createjs.Container();
        countsContainer.regX = stage.canvas.width / 2;
        countsContainer.rank = countsImg[1];
        world_current.addChild(countsContainer);
        countImg.src = countsImg[0];
        countImg.xOffset = stage.canvas.width  * (idx+1);
        countImg.yOffset = 170;
        countImg.onload = function(){
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            countsContainer.addChild(bmp);
        }
        countNations.push(countsContainer);
    }


    //play and stop sound since sound may not have been played yet (no cover page)
    playSound('empty');
    stopSound();

    // passing optional callback function to be called once this world_current is fully transitioned in
    initTransitionAndLoad(transition, begin_quizmofishing);
}

function fishing_init() {
    srcImages = [];
    currentIndex = 0;
    wordchoices = [];

    isCorrect = false;

    var quizSrcImgs = quiz_content[qWord][3];

    for (var i = 0; i < quizSrcImgs.length; i++) {
        var quizSrcImg = quizSrcImgs[i];
        var numberImg = new Image();
        /*创建一个container 包裹 鱼和数字 实现 container  自由移动*/
        var fishContainer = new createjs.Container();
        fishContainer.x = quizSrcImg[0].xOffset;
        fishContainer.y = quizSrcImg[0].yOffset;
        fishContainer.startX = fishContainer.x;
        fishContainer.startY = fishContainer.y;
        fishContainer.rank = parseInt(quizSrcImg[0].rank);
        fishContainer.visible = false;
        world_current.addChild(fishContainer);
        fishContainer.choice = quizSrcImg[0].choice;
        wordchoices.push(fishContainer.choice);
        world_current.addChild(fishContainer);
        numberImg.container = fishContainer;
        // 加载鱼动画
        var fishSheet = quizSrcImg[0].id;
        var spriteFish = new createjs.Sprite(spritesheets[fishSheet],'play');
        fishContainer.addChild(spriteFish);
        /* 在container中，加载图片(数字) */
        numberImg.onload = function(quizSrcImg) {
            var container_small = new createjs.Bitmap(this);
            //随机一个时间段
            movetime  = Math.floor(Math.random()*3000+3000);
            this.container.scaleX = 0.6;
            this.container.scaleY = 0.5;
            this.regX = this.width * 2;
            this.regY = this.height;
            this.x = 50;
            this.y = 50;
            //addShadow(bmp);
            doPulse(container_small);
            this.container.addChild(container_small);

            //让鱼和数字一起移动
            createjs.Tween.get(this.container)
                .call(direction)
                .call(callback);
        }
        srcImages.push(fishContainer);
        numberImg.src = quizSrcImg[0].src;

    }
    console.log(world_current);
    init_dodo_celebration();
    init_dodo_punish();

}
//给鱼一个随机的方向
function direction(){
    movetime  = Math.floor(Math.random()*3000+3000);
    if(movetime % 2 == 0){
        this.children[0].scaleX = 1;
        createjs.Tween.get(this)
            .wait(5)
            .to({x:0},movetime)
            .call(callback);
    }else{
        this.children[0].scaleX = -1;
        createjs.Tween.get(this)
            .wait(5)
            .to({x:stage.canvas.width},movetime)
            .call(callback)
    }
}
// 当鱼 游到两边的时候 调转方向游
function callback(){
    movetime  = Math.floor(Math.random()*3000+3000);
    if(this.x <= 0){
        this.children[0].scaleX = -1;
        createjs.Tween.get(this)
            .to({x:stage.canvas.width},movetime)
            .call(callback)
    }else if(this.x >= stage.canvas.width){
        this.children[0].scaleX = 1;
        createjs.Tween.get(this)
            .to({x:0},movetime)
            .call(callback)
    }
}

/*function fishing_checkanswer(srcObj, destObj) {
    var finish = true;
    for (var idx = 0; idx < srcImages.length; idx++) {
        var container = srcImages[idx];
        var countNation = countNations[idx];
        console.log(container);
        if (countNation[1]!= container.rank) {
            finish = false;
            break;
        }
    }
    if (finish) {
        isCorrect=true;
        displayCorrectFishing();
        _quizActive = false;
        var sndN = randomInt(1,2);
        questionOutcome = 'correct_' + sndN.toString();
        playSound(questionOutcome, quizQ_finalAudio);
    }
    return isCorrect;
}*/

//level specific functions:

//called once this level is fully slid into place
function begin_quizmofishing(){
    //**//**console.log("BEGIN-- cake & skits");
    _quizActive = true;
    playSound('q_'+ qWord);
}

function playSubSound() {
    playSound('q_'+ qWord);
}

function narrDone_quizmofishing(){
    //**//**console.log("question has been read for quizmodragdrop");
    btnNarration.visible = false;
    fishing_fadein(true);
}

function fishing_fadein() {
    console.log("fishing_fadein:" + currentIndex);
    var choice, wordchoice;
    var choice = srcImages[currentIndex];
    var wordchoice = wordchoices[currentIndex];

    if (currentIndex < srcImages.length - 1 ) {
        fade_in_center(choice, 400);
        playSound(wordchoice, fishing_fadein, 400);
    } else {
        fade_in_center(choice, 400);
        playSound(wordchoice, quizQ_fadesDone, 400);
    }
    currentIndex++;
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmofishing(){
    if(snd_active) btnNarration.visible = true;

    for (var i = 0; i < srcImages.length; i++) {
        var container = srcImages[i];
        container.on("mousedown", function (evt) {
            //this.parent.addChild(this);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            //console.log(this.offset);
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
        container.on("click", function (evt) {
            console.log("我点击了"+this.rank);
            this.offset = {x: this.x, y: this.y};
            var hit = false;
            var correct = false;
            var hookX = boatContainer.x;
            var hookY = boatContainer.y;
            createjs.Tween.removeTweens(this);

            var reg = getAngle(this.x,this.y,hookX,hookY);
            boatContainer.children[1].rotation = reg;
            function scale(){
                this.rotation = 0;
            }
            createjs.Tween.get(boatContainer.children[1])
                .to({scaleY:0.7},1500)
                .to({scaleY:0},500)
                .call(scale)
            if (this.rank == countNations[rightAnswer].rank) {
                console.log('我答对了！！！！');
                //console.log(reg);
                createjs.Tween.get(this)
                    .wait(1500)
                    .to({x:boatContainer.x,y:boatContainer.y},1000)
                    .wait(500)
                    .to({x:this.startX,y:this.startY})
                    .call(direction)
                    .call(callback)
                    .call(function(){
                        playSound("q_q13", ropeGo)})
            }else {
                console.log('答错了......');
                createjs.Tween.get(this)
                    .wait(1500)
                    .to({x:boatContainer.x,y:boatContainer.y},1000)
                    .wait(500)
                    .to({x:this.startX,y:this.startY})
                    .call(direction)
                    .call(callback)
            }
        });
        /*计算角度*/
        function getAngle(px,py,mx,my){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
            var x = Math.abs(px-mx);
            var y = Math.abs(py-my);
            var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            var cos = y/z;
            var radina = Math.acos(cos);//用反三角函数求弧度
            var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度
            if(mx>px&&my>py){//鼠标在第四象限
                angle = 180 - angle;
            }
            if(mx==px&&my>py){//鼠标在y轴负方向上
                angle = 180;
            }
            if(mx>px&&my==py){//鼠标在x轴正方向上
                angle = 90;
            }
            if(mx<px&&my>py){//鼠标在第三象限
                angle = 180+angle;
            }
            if(mx<px&&my==py){//鼠标在x轴负方向
                angle = 270;
            }
            if(mx<px&&my<py){//鼠标在第二象限
                angle = 360 - angle;
            }
            return angle;
        }

        quiz_answerMouseOver(srcImages[i]);
    }

}

function displayCorrectFishing(){
    right_animation1.alpha = 1;
    right_animation1.gotoAndPlay("run");
    right_animation2.alpha = 1;
    right_animation2.gotoAndPlay("run");
}

function displayIncorrectFishing(machinePosition){
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

function tick_quizmofishing(){
    stage.update();
}

function end_quizmofishing(){
    //**//**console.log('end_quizmodragdrop');
    createjs.Ticker.removeEventListener(ticker_world);
}

function ropeGo(){
    if (rightAnswer < (countNations.length - 1)) {
        createjs.Tween.get(countsContainer)
            .to({x: countsContainer.x - (stage.canvas.width)},2000);
        rightAnswer++;
        playSubSound();
    } else { // the end
        isCorrect = true;
        quiz_effect();
    }
}