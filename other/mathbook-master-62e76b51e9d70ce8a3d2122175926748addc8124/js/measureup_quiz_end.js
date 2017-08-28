function prep_measureup_quiz_end(transition){
	//**//**console.log('function: prep_measureup_quiz_end');
	world_current = worlds['measureup_quiz_end'];
	
	ticker_world = (function(){
		tick_measureup_quiz_end();
	});
	end_world = (function(){
		end_measureup_quiz_end();
	});
	narrDone = (function(){
		//narrDone_3_butcher();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;

	//adding background color (shape) or image (bitmap, and white border (bitmap)
	bg = new createjs.Bitmap(images['quizmo_end']);
	world_current.addChild(bg);

	//text_title = new createjs.Text("Great Job!", "54px Nunito", "black");
	//text_title.x = canvas.width/2; text_title.y = 140;
	//text_title.textAlign = "center";
	
	//world_current.addChild(text_title);
	
	//page stuff:
	// quiz_dogs = new createjs.Bitmap(images['quiz_dogs']);
	// quiz_dogs.regX = quiz_dogs.image.width/2;
	// quiz_dogs.regY = quiz_dogs.image.height/2;
	// quiz_dogs.x = canvas.width - 220;
	// quiz_dogs.y = 450; 
	// world_current.addChild(quiz_dogs);

	//arrowIndex = new createjs.Bitmap(spritesheets["moreStoriesButton"]);
	arrowIndex = new createjs.Sprite(spritesheets["moreStoriesButton"]);
	arrowIndex.gotoAndStop(0); document.body.style.cursor='default';
	arrowIndex.onMouseOver = function(){
		arrowIndex.gotoAndStop(1); document.body.style.cursor='pointer';
	};

	arrowIndex.onMouseOut = function(){
		arrowIndex.gotoAndStop(0); document.body.style.cursor='default';
	};

	//var helper = new createjs.ButtonHelper(arrowIndex, "off", "on", "on", false, arrowIndex);

	//arrowIndex.regX = arrowIndex.image.width/2;
	//arrowIndex.regY = arrowIndex.image.height/2;
	arrowIndex.x = 680; 
	arrowIndex.y = canvas.height/2 + 180;
	world_current.addChild(arrowIndex);

	//
	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_measureup_quiz_end);

}

//level specific functions:

//called once this level is fully slid into place
function begin_measureup_quiz_end(){
	if(arrowIndex.onPress!=null) return;

	doPulse(arrowIndex);
	addShadow(arrowIndex);

	//have arrowIndex call same function as when homebutton pressed (rtlstorybook.js)
	arrowIndex.onPress = homePressed;


}


function tick_measureup_quiz_end(){
	stage.update();
}

function end_measureup_quiz_end(){
	//**//**console.log('end_measureup_quiz_end');	
	createjs.Ticker.removeEventListener(ticker_world);
}
