function prep_glossary(transition){
	//**//**console.log('function: prep_glossary');
	world_current = worlds['glossary'];
	
	ticker_world = (function(){
		tick_glossary();
	});
	end_world = (function(){
		end_glossary();
	});
	narrDone = (function(){
		//narrDone_glossary();
	});

	//for glossary: show arrowLeft and arrowGame (to navigate to quiz page). hide arrowRight
	arrowLeft.visible = true;
	arrowRight.visible = false;
	arrowGame.visible = true;
	arrowGameBG.visible=true;
	arrowbgRight.visible=false;

	//adding background color (shape) or image (bitmap, and white border (bitmap)
	bg = new createjs.Bitmap(images['bg_story']);
	world_current.addChild(bg);

	//** page assets:
	
	//glossary words is a DEEP copy of the original glossary_definitions array. 
	//glossary_newword: for 'random' display of words: shuffle and take away words from glossarywords. when nothing left, recreate glossarywords as deep copy of glossary_definitions again
	glossarywords = [];
	//soundtag will always equal glossarywords[glossarywords.length-1][0], even if there is a [2] to show different txt on bone
	//soundtag defines whicha definition audio to play (being [0], it can be different than [2]-- text on bone)
	soundtag = {};
	defType = {};

	glossary_defDisplay = new createjs.Container();
	
	//wordbones title, disappears when martha is tapped
	glossary_title = new createjs.Bitmap(images['glossary-title']);
	glossary_title.x = 455;
	glossary_title.y = 90;
	world_current.addChild(glossary_title);
	
	//text-only definition cloud and textfield:
	glossary_cloud_txt = new createjs.Bitmap(images['glossary-txtcloud']); 
	glossary_cloud_txt.regX = glossary_cloud_txt.image.width/2;
	glossary_cloud_txt.regY = glossary_cloud_txt.image.height/2;
	glossary_cloud_txt.x = canvas.width/2;
	glossary_cloud_txt.y = 365;
	
	glossary_def_txt = new createjs.Text("", "32px Nunito", "black");
	glossary_def_txt.lineWidth = 340;
	glossary_def_txt.lineHeight = 35;
	glossary_def_txt.textAlign = "center";
	glossary_def_txt.textBaseline = "middle";
	glossary_def_txt.x = canvas.width/2;
	glossary_def_txt.y = glossary_cloud_txt.y - glossary_cloud_txt.image.height/2 + 50;
	//

	glossary_defDisplay.visible = false;	
	world_current.addChild(glossary_defDisplay);

	glossary_defDisplay.addChild(glossary_cloud_txt);
	glossary_defDisplay.addChild(glossary_def_txt);

	glossary_bowl = new createjs.Sprite( spritesheets['glossary-bowl'] );
	glossary_bowl.scaleX = glossary_bowl.scaleY = 1.2;
	glossary_bowl.x = 130;
	glossary_bowl.y = 535;
	glossary_bowl.gotoAndStop(0);
	world_current.addChild(glossary_bowl);


	glossary_splash = new createjs.Sprite( spritesheets['glossary-splash'] );
	glossary_splash.scaleX = glossary_splash.scaleY = 2.0;
	glossary_splash.x = 0;
	glossary_splash.y = 0;
	glossary_splash.gotoAndStop(0);
	world_current.addChild(glossary_splash);

	glossary_board = new createjs.Sprite( spritesheets['glossary-board'] );
	glossary_board.x = 0;
	glossary_board.y = 330;
	glossary_board.gotoAndStop(0);
	world_current.addChild(glossary_board);

	glossary_martha = new createjs.Sprite( spritesheets['glossary-martha'] );
	glossary_martha.regX = 260;
	glossary_martha.regY = 300;
	glossary_martha.x = glossary_martha.regX + 95;
	glossary_martha.y = glossary_martha.regY + 58;
	glossary_martha.gotoAndStop(0);	
	world_current.addChild(glossary_martha);

	glossary_martha.onMouseOver = function(e){
		document.body.style.cursor='pointer';
	}
	glossary_martha.onMouseOut = function(e){
		document.body.style.cursor='default';
	}

	boneContainer = new createjs.Container();
	wordbone = new createjs.Bitmap(images['glossary-wordbone']);
	wordbone.regX = wordbone.image.width/2;
	wordbone.regY = wordbone.image.height/2;
	wordbone.y -=15;
	//0: start states, 1: splash out of bowl, 2: go off screen
		boneContainer.x0 = 360;
		boneContainer.y0 = 580;
		boneContainer.r0 = 45;
		boneContainer.scale0 = 0.4;
		
		boneContainer.x1 = canvas.width/2;// - wordbone.image.width/2; ;
		boneContainer.y1 = 160;
		boneContainer.r1 = 0;
		boneContainer.scale1 = 0.78;

		boneContainer.x2 = -100;
		boneContainer.y2 = -100;
		boneContainer.r2 = -45;
	
	boneContainer.x = boneContainer.x0;
	boneContainer.y = boneContainer.y0;
	boneContainer.scaleX = boneContainer.scaleY = boneContainer.scale0;
	boneContainer.rotation = boneContainer.r0;
	boneContainer.visible = false; //hidden initially

	bonetext = new createjs.Text("", "50px Nunito", "black");	
	bonetext.lineWidth = wordbone.image.width;
	bonetext.textAlign = "center";
	bonetext.textBaseline = "middle";
	bonetext.x = wordbone.x; // - wordbone.image.width; //(wordbone.image.width  + bonetext.getMeasuredWidth()/2 ) * boneContainer.scaleX;
	bonetext.y = wordbone.y; //wordbone.image.height/2;

	boneContainer.addChild(wordbone);
	boneContainer.addChild(bonetext);
	world_current.addChild(boneContainer);

	//
	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_glossary);

}

//level specific functions:
function glossary_jump(e){
	//**//**console.log('new jump, definition: ' + soundtag);
	
	glossary_title.visible = false;
	
	glossary_martha.onPress = null;
	removeShadow(glossary_martha);

	glossary_board.gotoAndPlay('all');
	glossary_martha.gotoAndPlay('all');

	glossary_martha.on("animationend", splash_bowl);	

	//if glossary sfx 'boing_bonk' exists for given story, play it!
	if(sounds['boing_bonk']) playSound('boing_bonk');

}

function splash_bowl(){
	
	//**//**console.log("SPLASH BOWL NOW!");
	
	glossary_bowl.gotoAndStop(1);
	boneContainer.visible = true;
	
	glossary_splash.gotoAndPlay('bowl_splash');
	glossary_martha.visible = false;
	
	glossary_splash.on("animationend", jump_done);

	show_wordbone();
}

function show_wordbone(){
	createjs.Tween.get(boneContainer, {loop:false})
     .to({x:boneContainer.x1, y: boneContainer.y1, scaleX:boneContainer.scale1, scaleY:boneContainer.scale1, rotation:boneContainer.r1}, 750, createjs.Ease.quadOut)
     .call(glossary_define);
}
function hide_wordbone(){
	//glossary_active set to false when word is offscreen, so btn_snd doesn't do glossary specific stuff 
	glossary_active = false;
	glossary_defDisplay.visible = false;	
	
	createjs.Tween.get(boneContainer, {loop:false})
     .to({x:boneContainer.x2, y: boneContainer.y2, rotation:boneContainer.r2}, 500, createjs.Ease.quadOut)
     .call(glossary_newword);
}

function jump_done(){
	glossary_splash.visible = false;
	//glossary_martha.visible = false;
	//show_wordbone();
}

function glossary_define(){
	////**console.log('glossary_define');

	var defTextField;
	var defCloud;
	
	defTextField = glossary_def_txt;
	defCloud = glossary_cloud_txt;
	defTextField.text = definitionText[soundtag];

	//sizing: only do ONCE if glossary_active = false
	if(!glossary_active){
		defTextField.lineWidth = 480;
		if(defTextField.text.length > 110) defTextField.y -= 20;
		defTextField.x = canvas.width/2;		
		
		defCloud.visible = true;	
		glossary_defDisplay.visible = true;		
	}

	//glossary_active set to true only when a word is on screen (to trigger approp. behavior on snd_btn press)
	glossary_active = true;	
	

	setTimeout(function(){
		////**console.log('playing def sound');
		//plays definition audio: defONLY_ audio if that exists, def_ audio otherwise
		if (sounds['defONLY_'+ soundtag]) playSound('defONLY_' + soundtag);
		else playSound('def_' + soundtag);	
	}, 500);

}

//calls resetGlossary MANUALLY by tapping elements of glossary_defDisplay.
//either by stopping sound (if sndActive), or directly calling resetGlossary (if !sndActive)
function stopDefSound(e){
	////**console.log("stopDefSound.. leads to resetGlossary...");

	if(!snd_active) resetGlossary();
	else stopSound();	
}

//called automatically once def_ sound finishes playing (main js).
function resetGlossary(){
	////**//**console.log("resetGlossary...");
	
	glossary_bowl.gotoAndStop(0);
	glossary_splash.gotoAndStop(0);
	glossary_board.gotoAndStop(0);
		
	glossary_martha.onAnimationEnd = null;
	glossary_martha.gotoAndStop(0);
	
	glossary_splash.visible = true;
	glossary_martha.visible = true;
	
	glossary_martha.onPress = glossary_jump;
	doPulse(glossary_martha);
	addShadow(glossary_martha);

	hide_wordbone();
}

function glossary_newword(){
	//**//**console.log("glossary newword");

	//reset definition text fields:	
	glossary_def_txt.text = "";
	glossary_def_txt.lineWidth = 340; 
	
	glossary_def_txt.x = canvas.width/2;
	glossary_def_txt.y = glossary_cloud_txt.y - glossary_cloud_txt.image.height/2 + 50;

	if (glossarywords.length == 0){
		glossarywords = glossary_definitions.slice();
		shuffle(glossarywords);
		//**//**console.log("new shuffled set: " + glossarywords);
	}

     	boneContainer.visible = false;
		boneContainer.scaleX = boneContainer.scaleY = boneContainer.scale0;
		boneContainer.x = boneContainer.x0;
		boneContainer.y = boneContainer.y0;
		boneContainer.rotation = boneContainer.r0;

		//**//**console.log("---------- word to define: " + glossarywords[glossarywords.length-1][0]);
		if (glossarywords[glossarywords.length-1][2]){
			//**//**console.log("---------- text to show: " + glossarywords[glossarywords.length-1][2]);	
		} 
		//**//**console.log("---------- display type: " + glossarywords[glossarywords.length-1][1]);


	soundtag = glossarywords[glossarywords.length-1][0];
	if(glossarywords[glossarywords.length-1][1] == 'txt') defType = 'txt';
	if(glossarywords[glossarywords.length-1][1] == 'img') defType = 'img';

	if (glossarywords[glossarywords.length-1][2]) bonetext.text = glossarywords[glossarywords.length-1][2];
	else bonetext.text = glossarywords[glossarywords.length-1][0];

	glossarywords.pop();

}

//called once this level is fully slid into place
function begin_glossary(){
	////**console.log("glossary BEGIN");
	
	//if glossary sfx 'wordbones' exists for given story, play it!
	//only play 'wordbones' title audio if the wordbones title is visible on screen at start
	if(glossary_title.visible && sounds['wordbones']){		
		playSound('wordbones', startMartha);
	} 
	else{
		startMartha();
	}
}

function startMartha(){
	////**console.log("startMartha. martha anim: " + glossary_martha.currentAnimation);
	//**if martha is already jumping, do not do this over again (on unmute)
	if(glossary_martha.currentAnimation != null) return;

	glossary_defDisplay.onPress = stopDefSound; //allows tapping of glossary_picbox to progress to next definition, even if sound is off.	
	boneContainer.onPress = stopDefSound; //allows tapping of word bone (def word on top) to progress as well
	
	glossary_martha.scaleX = glossary_martha.scaleY = 1.0;
	doPulse(glossary_martha);
	addShadow(glossary_martha);
	glossary_martha.onPress = glossary_jump;

	glossary_newword();	
}

function tick_glossary(){
	stage.update();
}

function end_glossary(){
	//**//**console.log('end_glossary');	
	glossary_active = false;
	arrowGame.visible = false; //important - rehide arrowGame when leaving glossary

	glossary_martha.onMouseOver = null;
	glossary_martha.onMouseOut = null;
	
	createjs.Tween.removeTweens(boneContainer);
	createjs.Ticker.removeEventListener(ticker_world);
}
