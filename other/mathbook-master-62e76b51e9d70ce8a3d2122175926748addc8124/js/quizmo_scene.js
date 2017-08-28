var zimFrame, accelerator, spriteCharacter, right, totalItems; 

function prep_quizmoscene(transition){
	////**console.log('function: prep_quizmoscene');
	//world_current = worlds['quizmoscene'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmoscene();
	});
	end_world = (function(){
		end_quizmoscene();
	});
	narrDone = (function(){
		narrDone_quizmoscene();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmoscene();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    scene_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmoscene);
}


function scene_init() {
    right = 0;
    totalItems = 0;
    zimFrame = new zim.Frame("fit", 1024, 618, "#000");
    var stageW = stage.canvas.width;
    var stageH = stage.canvas.height;
    var laboratory = new zim.Container(stageW, stageH);
    zim.addTo(laboratory, world_current);
    accelerator = new zim.Accelerator();

    var backings = new zim.Container(stageW, stageH);              
    zim.addTo(backings, laboratory, 0); // backings at level 0 in laboratory scene

    var spriteSrcs = quiz_content[qWord][1];
    var quizBackgroundImgs = quiz_content[qWord][2];
    var images = [];
    var imagePath = "";
    var index = spriteSrcs["png"].lastIndexOf('/')
    imagePath = spriteSrcs["png"].substring(0, index+1); 
    images.push(spriteSrcs["png"].substring(index+1));
    index = spriteSrcs["json"].lastIndexOf('/')
    images.push(spriteSrcs["json"].substring(index+1));
    for (var idx = 0; idx < quizBackgroundImgs.length; idx++) {
        var quizBackgroundImg = quizBackgroundImgs[idx];
        var split = quizBackgroundImg[0].lastIndexOf('/')
        images.push(quizBackgroundImg[0].substring(split+1));
    }
    var quizSrcImgs = quiz_content[qWord][3];
    for (var idx = 0; idx < quizSrcImgs.length - 1; idx++) {
        var quizSrcImg = quizSrcImgs[idx];
        var split = quizSrcImg[0].lastIndexOf('/')
        images.push(quizSrcImg[0].substring(split+1));
    }
    var assets = zimFrame.loadAssets(images, imagePath);
    // call a function when the asset loading is complete
    assets.on("complete", function() {
        var scrollers = [];

        spriteCharacter = new zim.Sprite({json:zimFrame.asset(spriteSrcs["json"].substring(index+1))})
    		.centerReg(laboratory)
    		.mov(0, 110);

        for (var idx = 0; idx < quizBackgroundImgs.length - 1; idx++) {
            var quizBackgroundImg = quizBackgroundImgs[idx];
            var split = quizBackgroundImg[0].lastIndexOf('/')
            var ground = zimFrame.asset(quizBackgroundImg[0].substring(split+1));
            zim.addTo(ground, backings);
            if (quizBackgroundImg[1] && quizBackgroundImg[2]) {
                ground.mov(parseInt(quizBackgroundImg[1]), parseInt(quizBackgroundImg[2]));
            }
        	var scroller = new zim.Scroller(ground, idx+1);
            scrollers.push(scroller);
        }
        var foregroundContainer = new createjs.Container();
        zim.addTo(foregroundContainer, laboratory);
        var foreground = zimFrame.asset("foreground.png");
        zim.addTo(foreground, foregroundContainer);

        scrollers.push(new zim.Scroller({
        	backing: foregroundContainer,
        	speed:5, //gapFix:2 // with starting a stopping, sometimes need a gapFix
        }));

   	    var dynamo = new zim.Dynamo({sprite:spriteCharacter, speed:30, label:"walk", reversable:false});
   	    accelerator.add(dynamo);
        accelerator.add(scrollers);
        accelerator.percentSpeed = 0;

        for (var idx = 0; idx < quizSrcImgs.length - 1; idx++) {
            var quizSrcImg = quizSrcImgs[idx];
            var split = quizSrcImg[0].lastIndexOf('/')
            var img = zimFrame.asset(quizSrcImg[0].substring(split+1));
            zim.addTo(img, foregroundContainer);
            if (quizSrcImg[1] && quizSrcImg[2]) {
                img.mov(parseInt(quizSrcImg[1]), parseInt(quizSrcImg[2]));
            }
            img.label = quizSrcImg[3];
            if (img.label == "right") totalItems++;
            img.on("click", pickItem);
        }
    	var pd = new zim.ProportionDamp(0, stageW, -200, 200);
        laboratory.on("click", function(evt) {
    		accelerator.percentSpeed = 200 * (stage.mouseX - stageW / 2 ) / stageW;
    
    		if ((stage.mouseX > stageW/2 && spriteCharacter.scaleX < 0) || (stage.mouseX < stageW/2 && spriteCharacter.scaleX > 0))  {
    			spriteCharacter.scaleX *= -1;
    		}
        });

    });// on assets complete

	//move it where desired for particular quiz question
	btnNarration.x = canvas.width - 100; 
	btnNarration.y = 100; 
	btnNarrationOver.x = btnNarration.x;
	btnNarrationOver.y = btnNarration.y;

}

function pickItem() {
    if (this.label == "right") {
        right++;
    }
    if (right == totalItems) {
		isCorrect=true;
		playSound('sfx_pie', quiz_effect);
    }
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmoscene(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmoscene(){
	//**//**console.log("question has been read for quizmoscene");

	btnNarration.visible = false;
	//quizQ_fadein_left(true);

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmoscene(){
	if(snd_active) btnNarration.visible = true;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function displayCorrectScene(machinePosition){
	
}

function displayIncorrectscene(machinePosition){

}

function tick_quizmoscene(){
	stage.update();
}

function end_quizmoscene(){
	//**//**console.log('end_quizmoscene');	
	createjs.Ticker.removeEventListener(ticker_world);
}

