var player, playerInitialized, videoQuizs, endedQueue; 

function prep_quizmovideo(transition){
	////**console.log('function: prep_quizmovideo');
	//world_current = worlds['quizmovideo'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmovideo();
	});
	end_world = (function(){
		end_quizmovideo();
	});
	narrDone = (function(){
		narrDone_quizmovideo();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmovideo();
	});


	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    video_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmovideo);
}

function video_init() {
    if (playerInitialized) return;
    playerInitialized = true;
    // declare object for video. reference mediaelementplayer using var player
    var id = (options && options.id !== undefined) ? options.id : "mp4player";
    console.log(document.getElementById(id));
    //console.log(id);
    player = new MediaElementPlayer("#" + id, {
        startLanguage: 'none',
        // disable the dropdown list of languages
        translationSelector: false,
    
        // Hide controls when playing and mouse is not over the video
        alwaysShowControls: true,
        enableAutosize: true,
    
        // the order of controls you want on the control bar (and other plugins below)
        features: ['playpause','restart','progress','volume','fullscreen'],
    
        success: function(player, node) {
            //$('#' + node.id + '-mode').html('mode: ' + player.pluginType);
            //**console.log('mode: ' + player.pluginType);
            ////**console.log(player);
        }
    });
    do_resize("#" + id);
    
    MediaElement(id, {success: function(me) {
        //**console.log("SUCCESS: " );
        me.addEventListener('ended', function(){
            //**console.log('video has ended');
            while(endedQueue.length) {
                endedQueue.pop()();
            }
            player.exitFullScreen();
        }, false);

        me.addEventListener('timeupdate', function() {
          for (var quizIdx in videoQuizs) {
              if (!quizArray[quizIdx].solved && me.currentTime > quizArray[quizIdx].time) {
                 player.pause(); 
                 videoQuizs[quizIdx].element.show();
              }
          }
        }, false);
    
    }});

}

function video_element_init() {
    if (!initialized) {
        initialized = true;
    
        // Create the text area element
        element.className = "dodoMP4";
        element.style.borderRadius = "10px";
        if (options.className) {
            element.className += " " + options.className;
        }
        if (options.addClass) {
            element.className += " " + options.addClass;
        }
        var mejsContainer = GLOBAL.document.createElement("div");
        $(mejsContainer).attr('id', "mejs-container").attr('class', "mejs-container mejs-video").attr('style', "width: 100%; height: 100%; position:absolute");

        element.appendChild(mejsContainer);
     
        var videoElm = GLOBAL.document.createElement("video");
        videoElm.id = options && (options.id !== undefined) ? options.id : "mp4player";
        videoElm.width = options && (options.videoWidth !== undefined) ? (options.videoWidth + "%") : "650";
        videoElm.height = options && (options.videoHeight !== undefined) ? (options.videoHeight + "%") : "400";
        videoElm.setAttribute('style',  "position: absolute; min-width: 100%; min-height: 100%; margin-left: " + 
                        (options && (options.videoWidth !== undefined) ? ((100 - options.videoWidth)/2 + "%") : "0%") + ";margin-top:" + 
                        (options && (options.videoHeight !== undefined) ? ((100 - options.videoHeight)/2 + "%") : "0%"));
        videoElm.setAttribute('controls',  "controls");
        videoElm.setAttribute('preload',  "metadata");
        mejsContainer.appendChild(videoElm);
        sb.videoElmId = options && (options.id !== undefined) ? options.id : "mp4player";

        var sourceElm = GLOBAL.document.createElement("source");
        sourceElm.src = options.src;
        sourceElm.type = "video/mp4";
        sourceElm.title = "mp4";
        videoElm.appendChild(sourceElm);

        element.allowfullscreen = true; 

        var jsElement;
        for(var i = 0, l = (options.scripts) ? options.scripts.length: 0; i < l; i++) {
            jsElement = GLOBAL.document.createElement("script");
            jsElement.id = options.scripts[i]['id']
            jsElement.type = "text/javascript";
            jsElement.src = options.scripts[i]['src'];
            mejsContainer.appendChild(jsElement);
            if (i == l - 1) {
                jsElement.addEventListener("load",  function() {   
                    for (var quizIdx in options.quizes) {
                        var quiz = options.quizes[quizIdx];
                        var quizObj = $(mejsContainer).selectQuiz(quiz, "checkbox", {width: videoElm.width + "px", height: videoElm.height + "px"});
                        mejsContainer.appendChild(quizObj.element[0]);
                        quizArray.push(quizObj);
                    }                
                });
            }
        }

        // Listen to when the sprite is touched or clicked
        that.addEventListener("PRESS", that.press);
    }
}


function videoButtonClicked(label) {
    if (label.toLowerCase() == videoAnswer.toLowerCase()) {
        // right 
	    arrowRight.visible = true;
	    arrowbgRight.visible=true;
    } else {
        // wrong

    }
}

function videoNextStep() {
    if (currentStep < videoImages.length - 2) {
        var timeline = new createjs.Timeline(); //create the Timeline
        var fadeOutTween = new createjs.Tween.get(videoImages[currentStep],{loop: false}).to({visible: false}, 1000)
        currentStep++;
        var fadeInTween = new createjs.Tween.get(videoImages[currentStep]).to({visible: true}, 1000).call(videoNextStep)
        timeline.addTween(fadeOutTween, fadeInTween); // add some tweens
    } else {
        var timeline = new createjs.Timeline(); //create the Timeline
        var fadeOutTween = new createjs.Tween.get(videoImages[currentStep],{loop: false}).to({visible: false}, 1000)
        currentStep++;
        var fadeInTween = new createjs.Tween.get(videoImages[currentStep]).to({visible: true}, 1000).call(waitResult);
        timeline.addTween(fadeOutTween, fadeInTween); // add some tweens
    }
}

function waitResult() {
    rightButton.visible = true;
    wrongButton.visible = true;
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmovideo(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmovideo(){
	//**//**console.log("question has been read for quizmovideo");

	btnNarration.visible = false;
	//quizQ_fadein_left(true);
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmovideo(){
	if(snd_active) btnNarration.visible = true;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function displayCorrectvideo(machinePosition){
	
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

function displayIncorrectvideo(machinePosition){
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

function tick_quizmovideo(){
	stage.update();
}

function end_quizmovideo(){
	//**//**console.log('end_quizmovideo');	
	createjs.Ticker.removeEventListener(ticker_world);
}

