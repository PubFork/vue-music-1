function prep_quiz_cover(transition){
	//**//**console.log('function: prep_quiz_cover');
	world_current = worlds['quiz_cover'];
	
	ticker_world = (function(){
		tick_quiz_cover();
	});
	end_world = (function(){
		end_quiz_cover();
	});
	narrDone = (function(){
		narrDone_quiz_cover();
	});

	//quiz cover- show right bg+btn
	arrowLeft.visible = false;
	arrowbgLeft.visible=false;
	arrowRight.visible = true;
	arrowbgRight.visible=true;




	//** for quiz cover only. //rest of quiz questions never show/use arrowRight
    arrowRight.removeAllEventListeners("click");
	//arrowRight.off("click", goForward);
	arrowRight.on("click", quiz_coverForward);

	//adding background color (shape) or image (bitmap, and white border (bitmap)
	bg = new createjs.Bitmap(images['quiz_cover']);
    bg.scaleX = canvas.width / bg.image.width;
    bg.scaleY = canvas.height / bg.image.height;
	world_current.addChild(bg);


	//
	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quiz_cover);

}

//level specific functions:

function narrDone_quiz_cover(){

}

//called once this level is fully slid into place
function begin_quiz_cover(){
    processBarContainer.visible = false;
	//**//**console.log("WORLD 0 BEGIN");
	
	//FIX FOR ANDROID: play ~100ms of silence muted before playing actual cover audio
    var empty0 =  sounds['empty'][0] * 1000;
    var empty1 =  sounds['empty'][1] * 1000;
    soundManager.mute('multisound');
	playFromTo(empty0, empty1, audio_quiz_cover);
}

function audio_quiz_cover(){
	soundManager.unmute('multisound');
	playSound('quizmo');
}


function tick_quiz_cover(){
	stage.update();
}

function end_quiz_cover(){
	//**//**console.log('end_quiz_cover');	
	createjs.Ticker.removeEventListener(ticker_world);
	
}
