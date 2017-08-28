/*
// Base RTL Storybook Preloader & Main Functions
// Developed by Bharat Battu, WGBH Educational Foundation
//* 4/28/2014 -- iOS 7 fix *ensuring sound load (play/pause) occurs within touchevent function (doTheLoad)
//* 7/8/2014 -- base url for all dodo servers (ernie,soup, www)
//*** REQUIRES SPECIFIC JS FOR EACH STORYBOOK TO DEFINE ITS SOUNDS, IMAGE ASSETS, AND SPRITESHEET OBJECTS
*/
//for hosting on PBS servers: checking domain and adjusting filepaths accordingly
var fpath = ""; //empty by default, just to load things from same folder
var imgPath = "";//img path
var martha_base="/martha/stories/truestories/"; //base path to true stories

//if testing locally (file or localhost), or on iaclients, fpath is empty
if( (document.domain).search("localhost") !== -1 || (document.domain).search("iaclients") !== -1 || (document.domain).length==0 ){
    fpath="";
    imgPath="";
    PBS={};
}//else (running on dodo servers):
else{
	//7-8-2014: base url for all PBS servers.
	fpath = PBS.KIDS.base+martha_base;
	imgPath = PBS.KIDS.base+martha_base;
}

//iOS devices- keep fpath as empty
if ( navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ){
	fpath="";
	imgPath="";
}

//GLOBAL VARS:

//for preloader with preloadJS:
var manifest, manifest_length, loader_preload, main_preload, story_preload, main_manifest, story_manifest;

var totalLoaded; //keeps count of images loaded. once totalLoaded == manifest.length, all images have loaded

//canvas = the canvas element in html, stage = State object, world_current = only child on stage, container (that is parent of everything else)
//*since all objects are on container, you can transform container and have everything follow.
var canvas, stage;//, world_current;
//canWidth and canHeight are set (at onReady) to be the defined width and height dimensions of the canvas element in html.
//transitions and other code use these values!
var canWidth;
var canHeight;
var PROCESS_STEP;

var loader_bgIMG, loader_boneIMG, loader_barFRONT;

var edgeLEFT = new createjs.Shape();
var edgeRIGHT = new createjs.Shape();
var edgeTOP = new createjs.Shape();
var edgeBOTTOM = new createjs.Shape();

var show_pagenumber = true; // true/false determines whether pagenumber will be shown. only true for ReadingBuddies pilot study
var pgnumcontainer;
var pagenumber;
var processBarContainer, processBar, processBarStar;
var pgnumberbg;

var world_current; //used to represent the c urrent world_current in level specific functions. current level set to world_current in prep functions
var world_main, world_left, world_right; //used to represent current, prev, and next worlds for transitions
var worlds = new Array(); //holds all worlds' containers
var currentPage;
var dodo, subTitle, subTitleContainer;


//GLOBAL:  ticker function and end function var, set to unique functions for each level
var ticker_world, end_world;
var _active = false; //use with interactions. return out of functions when this is false(when world is no longer current)

//left & right arrows (for navigation). navArrows is the container that should be topmost:
var arrowLeft, arrowRight;//, navArrows;
var allowTransition = true; //bool that switches to enable/disable navArrows

//teachertip: container holds both teachertipbox and teachertiptext. tween container via btnTip
var teachertipcontainer, teachertipbox, teachertiptext;

var snd_active = true; //bool for sound on/off (on by default). toggled via btnSnd
var snd_activeCnt = 0; //used to track on each page whether the # of times narration_done is being called. it only calls narrDone if narration_done is called for FIRST TIME only
var narrActive = false; //bool that is set to TRUE whenever narration audio is being read, false when narration audio finishes
var defActive = false; //bool that is set to TRUE whenever definition audio is beign read, false when def audio finishes

var text_page, text_page2;
var defHighlightText = new createjs.Text();
var definitionMask = new createjs.Shape();
var defCloseShape;
var narrationMask = new createjs.Shape();
var linebreaks = [];
var definitionBoxes = [];
var definitionText = [];
var allowDefinitions = false; //used to know when to allow click/tappable definition boxes
var pageStartTime = null, currentTime = null; // the time entering this page and the current time, for recording time spent on this page

var glossary_active = false; //bool that should be set TRUE only when a glossary page is current page. (used for when definition audio finishes playing to trigger a new jump)

var quiz_url = {}; //empty on init. will be come string holding url to quiz page in each storybook's js code

//string that holds function name for prep function for the current world_current.
//dynamically changes before being called via makeWorldMain() for each new world_current
// function prepWorld set to -1 at start. for QUIZ: it'll change via quiz_getNewQ() to random quiz mech. for STORYBOOKS, it'll remain -1 at start, and then it'll change to prep_world0.
var function_prepWorld = -1;

var function_onReady; //function that is called at end of world_inplace (if callback provided to initTransitionAndLoad
var narrDone, task_finished, task_correct, task_incorrect; //function that is called when "narration done" event fires. (should be set to distint function per world/page)

//for mouse-over hover scaling & hit region visiblity (OLD)
//var hoverFactor = 1.1;
//var hitAlpha = 0.01; //for all 'orb' objects attched to objects for hit regions. increase alpha for debugging

//FPS: set FPS here, used by ticker's setFPS function in init
var FPS = 20;

// Object glow filter, added by @leio
var _glowFilter = null;

//transTweenMS: number of milliseconds for transition tweens
var transTweenMS = 300;

//for EACH image file to be loaded (loaded once, but can then be used multiple times)
//feed in string id to access an image:  images['i_pops']
var images = new Array(); //array to hold each Image object, fed via preloadJS

//spritesheets objects kept in array with id names like images[]
var spritesheets = new Array();

//new audio via SoundManager2:
var snd_multisound;
var sounds = [];
var phrases = [];
//snd_multisound will be the actual soundManager object
//sounds[tag] will be the sound definitions
//optional: phrases contains any text that goes with a sound (phrases['id'] to go with sounds['id'])


soundManager.audioFormats = {
  'mp3': {
    'type': ['audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust'],
    'required': false
  },

  'mp4': {
    'related': ['aac','m4a'], // additional formats under the MP4 container
    'type': ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic'],
    'required': false
  },

  'ogg': {
    'type': ['audio/ogg; codecs=vorbis'],
    'required': false
  },

  'wav': {
    'type': ['audio/wav; codecs="1"', 'audio/wav', 'audio/wave', 'audio/x-wav'],
    'required': false
  }

};

/*
//SOUND SETUP:
//preferring mp3 playback, using flash if available, html5 if not. OGG provided for firefox if no flash
**** IE NEEDS FLASH PLAYBACK OF MP3 FOR ACCURATE AUDIO TIMECODES FOR PLAYBACK WITH GOOD PEFORMANCE
**** SAFARI NEEDS FLASH PLAYBACK OF MP3 FOR LOADING ON ERNIE/SOUP
*/

soundManager.setup({
  waitForWindowLoad: true,
  preferFlash: true,
  useHTML5Audio: false,
  html5PollingInterval: 10,
  useHighPerformance: true,
  flashPollingInterval:10,
  flashLoadTimeout: 0,
  flashVersion: 9,
  url: 'js/soundmanager2/swf/',
  debugMode: false,

  onready: function() {

    //prefixing sndurl with adjusted filepath (depending on which server content is being hosted)
    sndurl = fpath + sndurl;
    var ext = "";

	//preferring mp3 First
	if (soundManager.canPlayURL( sndurl + '.mp3' )) {
		ext = ".mp3";
	}//For Firefox: resorting to ogg
	else if (soundManager.canPlayURL(sndurl + '.ogg' )) {
		//sndurl+= '.ogg';
		ext = ".ogg";
	} else{
		ext = ".mp3";
	}

	sndurl+=ext;

	//first, begin sound loading:
    createSM();
  },
  ontimeout: function() {
  },
  defaultOptions: {
    // set global default volume for all sound objects
    //volume: 33
    autoLoad: false,
    autoPlay: false,
  }

});


function createSM(){
	snd_multisound = soundManager.createSound({
	    id: 'multisound', // required
	    url: sndurl,

	    onbufferchange: function() {
	    },
	    onload: function() {
            console.log("createSM onload");
		    //**SOUND LOAD DONE, BEGIN IMG ASSET LOADING
		    //main_preload.loadManifest(main_manifest);
		    //main_preload.load(main_manifest);
		    beginImgLoading();
	    },
	    whileloading: function() {
		    //fill from 0 to max of 50% of loader_barBACK width (274)
		    //loader_barFRONT.graphics.clear();
	   	    //loader_barFRONT.graphics.beginFill("#c14322").drawRect(662, 580, ( parseInt( (this.bytesLoaded/this.bytesTotal) * 137) ), 27);
	    }
	});
}

function beginImgLoading() {
	main_preload = new createjs.LoadQueue(false);
	main_preload.addEventListener("fileload",handleFileLoad);
	main_preload.addEventListener("progress",handleProgress);
	main_preload.addEventListener("complete",main_handleComplete);

	main_preload.loadManifest(main_manifest);
}


//makes a new array inside of sounds. index 0 = start time, index 1 = endtime.
//optional:
	//phrase: phrase text as single string, or array of words
	//wordtimes: array of word-by-word timecodes
function makeSound(tag, begin, end, phrase, wordtimes){
	sounds[tag] = new Array(begin, end);

	if(phrase)
	{
		phrases[tag] = [];
		phrases[tag][0] = phrase;
	}
	if (wordtimes)
	{
		phrases[tag][1] = wordtimes;

		//lastly, convert all seconds times into milliseconds:
		for (var i=0; i< phrases[tag][1].length;i++){
			phrases[tag][1][i] *= 1000;
		}
	}

}

function stopSound(){
	snd_multisound.stop();
}

//if providing 'snd_callback' - function will be called on sound completion.
//if providing callback_delay, snd_callback function is called after that amount of time
function playSound(tag, snd_callback, callback_delay){
	//if sound is 'deactivated' don't go through with playsound, but:
	//if snd_callback function provided, do that (quiz_fade functions)
	//otherwise do whatever narrDone is necessary (storybooks)
	if(!snd_active){
		if(snd_callback) snd_callback();
		else narration_done();

		return;
	}

	var sndIterator = 0;

	snd_multisound.stop()
	snd_multisound.play({
    from: (sounds[tag][0] * 1000),
    to: (sounds[tag][1] * 1000),

    onplay: function(){
    	//if this is NARRATION audio-- fire a event for "narration begun"
    	if(phrases[tag])
    	{
			narration_begins(phrases[tag][0]);
    	}
    },
  
	whileplaying: function(){
		if(!phrases[tag]) return;
		//only if a word-by-word timecodes array exist for this phrase
		if(phrases[tag][1])
		{

			var posMAX = phrases[tag][1][sndIterator];// + 50;
			if (this.position > posMAX)
			{
				narration_newWord(tag, sndIterator);
				sndIterator++;
			}

		}
	},

    onstop: function() {
      	//if snd_callback function provided, it will run after sound finishes
      	if(snd_callback){
      		if(callback_delay){
				setTimeout(snd_callback, callback_delay);
      		}
      		else snd_callback();

      		return;
      	}
    	//if this is narration (or quiz question) audio-- fire a event upon completion
    	if(phrases[tag] || (tag.search("q_") != -1))
    	{
    		narration_done();
    	}

		if(glossary_active){
			if( (tag.search("def_") != -1) || (tag.search("defONLY_") != -1) ) {
			   //implementing setTimeout to have slight time delay before resetting glossary
			   //only resetting glossary w/ new word if sound is active. if snd muted, user taps word bone/cloud to advance
			   if(snd_active) setTimeout(resetGlossary, 1000);
			}
		}

    }
  });
}


//used to play sounds simply from provided start time to end time. no narration/definition checks, etc.
//**used for playing audio on first pages 0_cover.
//*optional callback function can be passed as arg
function playFromTo(nFrom, nTo, callback) {
	if(!snd_active) return;

	soundManager.stop('multisound'); // stop before re-starting sound (covers overlapping play attempts)

		snd_multisound.play({
		from: nFrom,
		to: nTo,
			onstop: function() {
			  // note that the "to" target may be over-shot by 200+ msec, depending on polling and other factors.
			  if(callback) callback();

			}
		});
}
//*********END OF SOUND LOADING, ONTO CREATEJS/CANVAS GFX


//LOADING PROCESS: init loading anim assets, do sound loading (50% of bar), do img asset loading (50% of bar)
function doTheLoad(){
    
	//if STORYBOOK: pagenames exists
	//if QUIZ: pagenames is set to false in quiz .js file

	//pagenames is defined in the storybook's specific js file as an array...
	if(pagenames){
		//create a container for each world_current/scene/page:
		for (var i = 0; i < pagenames.length; i++){
			worlds[ pagenames[i] ] = new createjs.Container();
		}
    } else {
		worlds[ 'quiz_cover' ] = new createjs.Container();
        pagenames = quiz_words;
        
        for (var pageidx in pagenames) { 
		    worlds[ pagenames[pageidx] ] = new createjs.Container();
        }
	}

	makeSounds(); //function defined for each unique storybook

	main_manifest = [
		//wrapper (COMMON FOR ALL STORYBOOKS. uses same assets across storybooks:
		{src:imgPath+"img/rtlstorybook/navArrow_seq.png", id:"navArrow"},
		{src:imgPath+"img/rtlstorybook/btn_quiz.png", id:"navArrow_game"},
		{src:imgPath+"img/rtlstorybook/btn_quiz_over.png", id:"navArrow_game_over"},
		{src:imgPath+"img/rtlstorybook/btn_wordbones.png",id:"arrow_bone"},
		{src:imgPath+"img/rtlstorybook/btn_wordbones_over.png",id:"arrow_bone_over"},
		{src:imgPath+"img/rtlstorybook/frame.png", id:"whiteborder"},
		{src:imgPath+"img/rtlstorybook/frame_topleft.png",id:"leftborder"},
		//defaulting to using 3-btn sized topright frame bg. per-story, replace img id 'rightborder' with a different src image if needed.
		{src:imgPath+"img/rtlstorybook/frame_topright3.png",id:"rightborder"},
		{src:imgPath+"img/rtlstorybook/frame_arrowbg.png",id:"arrowbg"},
		{src:imgPath+"img/rtlstorybook/frame_arrowbg_big.png",id:"arrowbg_big"},
		{src:imgPath+"img/site/logo.png", id:"but-dodo"},

		{src:imgPath+"img/rtlstorybook/defbox.png", id:"defRect"},

		{src:imgPath+"img/rtlstorybook/textbox_story.png", id:"bg_wordcloud"},
		{src:imgPath+"img/rtlstorybook/tipbox.png", id:"teachertipbox"},
		{src:imgPath+"img/rtlstorybook/btn_close.png", id:"closeX"},
		{src:imgPath+"img/rtlstorybook/btn_close_over.png", id:"closeXOver"},
		{src:imgPath+"img/rtlstorybook/btn_tip.png", id:"but-tip"},
		{src:imgPath+"img/rtlstorybook/btn_tip_over.png", id:"but-tip-over"},
		{src:imgPath+"img/rtlstorybook/btn_snd.png", id:"but-snd"},
		{src:imgPath+"img/rtlstorybook/btn_snd_over.png", id:"but-snd-over"},
		{src:imgPath+"img/rtlstorybook/btn_nosnd.png", id:"but-nosnd"},
		{src:imgPath+"img/rtlstorybook/btn_nosnd_over.png", id:"but-nosnd-over"},
		{src:imgPath+"img/rtlstorybook/btn_home.png", id:"but-home"},
		{src:imgPath+"img/rtlstorybook/btn_home_over.png", id:"but-home-over"},

		{src:imgPath+"img/rtlstorybook/btn_replay.png", id:"but-replay"},
		{src:imgPath+"img/rtlstorybook/btn_replay_over.png", id:"but-replay-over"},
        
        {src:imgPath+"img/rtlstorybook/process_background.png", id:"process-background"},
		{src:imgPath+"img/rtlstorybook/process_star.png", id:"process-star"},
		{src:imgPath+"img/rtlstorybook/process_bar.png", id:"process-bar"},
        {src:imgPath+"img/rtlstorybook/machine.png", id:"dodo"}
	];

    make_storymanifest(); //function defined for each unique storybook to load unique assets
    
	//make canvas ontop of coverImg
	document.getElementById('coverImg').style.zIndex = -2;
	document.getElementById('gameCanvas').style.zIndex = 100;

	//setting canvas element on html page to canvas var, referenced by createJS content code
	canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);

	//to get onMouseOver & onMouseOut events
    // commented by @leio
	//stage.enableMouseOver();

	//enable touch interactions if supported on the current device:
	//params: single touch only (true), allow scroll/zoom gestures (false)
	createjs.Touch.enable(stage, true, false);

	//fully load loading/progress anim assets first. only then begin preload process
    console.log("starting load queue;")
	loader_preload = new createjs.LoadQueue(false);
    //loader_preload.addEventListener("fileload", handleInitFileLoad);
    loader_preload.addEventListener("complete", loaderOnStage);
    loader_preload.loadManifest([
    	{id:"loader_bg", src:imgPath+"img/rtlstorybook/loader_bg.png"},
    	{id:"loader_bone", src:imgPath+"img/rtlstorybook/loader_bone.png"}
    ]);
    // loader_preload.loadFile();
    // loader_preload.load();

	/*loader_bgIMG = document.createElement("img");//new Image();
	loader_bgIMG.src = PBS.KIDS.cdn_base+martha_base+'img/rtlstorybook/loader_bg.png';
	loader_bgIMG.crossOrigin = "anonymous";

	loader_bgIMG.onLoad = function(){
		loader_boneIMG = document.createElement("img");//new Image();
		loader_boneIMG.src = PBS.KIDS.cdn_base+martha_base+'img/rtlstorybook/loader_bone.png';
		loader_boneIMG.crossOrigin = "anonymous";
		loader_boneIMG.onLoad = loaderOnStage();
	}();*/

	//for iOS and Android to work:
	soundManager.play('multisound');
	soundManager.pause('multisound');
}

//begin loading..
function loaderOnStage(){
	loader_bg = new createjs.Bitmap(loader_preload.getResult('loader_bg'));
	loader_bg.regX = 313/2;
	loader_bg.regY = 161/2;
	loader_bg.x = 800; loader_bg.y = 550;

	//loader_bone = new createjs.Bitmap(loader_boneIMG);
	loader_bone = new createjs.Bitmap(loader_preload.getResult('loader_bone'));
	loader_bone.regX = 111/2;
	loader_bone.regY = 36/2;
	loader_bone.x = loader_bg.x; loader_bone.y = loader_bg.y - 26;

	stage.addChild(loader_bg);
	stage.addChild(loader_bone);

	createjs.Ticker.addEventListener("tick", bonespin);
	stage.update();

	init_preload();
}

function init_preload() {
    processBarContainer = new createjs.Container();
	loader_barBACK = new createjs.Shape();
	loader_barBACK.graphics.beginFill("#cccccc").drawRect(662,580,274,27);

	//initial width of loader_barFRONT: 0, fills up to 0-50% for sound loading, then 50-100% for img loading
	loader_barFRONT = new createjs.Shape();
	loader_barFRONT.graphics.beginFill("#c14322").drawRect(662,580,0,27);
    
    stage.addChild(loader_barBACK);
	stage.addChild(loader_barFRONT);
    
	//re-add loader_bg and loader_bone ontop
	stage.addChild(loader_bg);
	stage.addChild(loader_bone);

	manifest_length = main_manifest.length + story_manifest.length;
    //manifest = main_manifest + story_manifest;

	//manifest should be created by now
	images = images || {};
	totalLoaded = 0;
}


function bonespin(){
	loader_bone.rotation+=15;
	stage.update();
}

function handleProgress(event) {

}

function handleFileLoad(o) {
    //Storing all loaded images assets in single array to call them easily.
    if (o.item.type == createjs.LoadQueue.IMAGE) {
		//o.item.tag.crossOrigin="anonymous";

        images[o.item.id] = o.result;

        images.push(o.result);
        images[images.length-1].id = o.item.id;

        totalLoaded++;

       	//here.. clear loader_barFRONT, make it fill more from 50% to 100% width of 274
		//loader_barFRONT.graphics.clear();
   		loader_barFRONT.graphics.beginFill("#c14322").drawRect(662, 580, (137 + parseInt((totalLoaded / manifest_length)*137) ), 27);
    }
}

//main_manifest loaded... load story_manifest
function main_handleComplete(event) {
    /* story_preload = new createjs.PreloadJS(false);
    story_preload.onProgress = handleProgress;
    //story_preload.onLoadComplete = handleLoadComplete;
    story_preload.onFileLoad = handleFileLoad;
    story_preload.onComplete = story_handleComplete;*/
    console.log("before story preload");
    story_preload = new createjs.LoadQueue(false);
    story_preload.addEventListener("fileload",handleFileLoad);
    story_preload.addEventListener("complete",story_handleComplete);

	/*UNCOMMENT THIS!*/
    story_preload.loadManifest(story_manifest);
}


//once ALL images loaded...
function story_handleComplete(event) {
	//remove loader bar assets, spinning bone ticker
	createjs.Ticker.removeEventListener("tick", bonespin);
    stage.removeChild(loader_bone);
    stage.removeChild(loader_bg);
    stage.removeChild(loader_barBACK);
    stage.removeChild(loader_barFRONT);
    loader_bone = null;
    loader_bg = null;
    loader_barBACK = null;
    loader_barFRONT = null;

	document.getElementById('loadingFrame').style.display = 'none';
	document.getElementById('loadingFrameTopLeft').style.display = 'none';
	document.getElementById('loadingFrameTopRight').style.display = 'none';
	document.getElementById('loadingFramePBSLogo').style.display = 'none';
	document.getElementById('loadingFrameHome').style.display = 'none';

	make_spritesheets();
}

//****creating reusable spritesheet objects in spritesheets[] using images in images[]
//**for each SS in spritesheets[]... store each frame's width and heigth as attributes .fWidth and .fHeight
function make_spritesheets(){
	document.getElementById('canvas_parent').removeChild(coverImg);
	document.getElementById('canvas_parent').removeChild(startBtn);

	//for nav:
	spritesheets['navArrow'] = new createjs.SpriteSheet({
		"frames": [[0, 0, 128, 128, 0, 128, 0], [128, 0, 128, 128, 0, 128, 0]],
		"animations": {},
		"images": [images['navArrow']]
	});
    
    spritesheets['dodo'] = new SpriteSheet({
        "images": [images['dodo']],

        "frames": [
            [1, 1, 557, 738, 0, -7, -5],
            [560, 1, 451, 485, 0, -78, -251],
            [560, 488, 446, 516, 0, -81, -221],
            [1, 741, 470, 570, 0, -59, -168],
            [1, 1313, 440, 549, 0, -84, -189],
            [1, 1313, 440, 549, 0, -84, -189],
            [473, 1006, 462, 424, 0, -73, -309],
            [443, 1432, 456, 454, 0, -76, -281]
        ],

        "animations": {
            "run": { "frames": [4, 2, 1, 7, 6, 3, 0, 5] }
        },
    });

	story_spritesheets(); //function defined for each unique storybook

	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(FPS);

	makeNavArrows();
}

//establishing persistent left/right arrows, in container ABOVE all else
//also establishing persistent pagination dots in their own container ABOVE all else
function makeNavArrows(){

	whiteborder = new createjs.Bitmap(images['whiteborder']);

	//shown only if show_pagenumber = true
	pgnumcontainer = new createjs.Container();
	pgnumcontainer.x = 30;
	pgnumcontainer.y = 615;
	pgnumberbg = new createjs.Shape();
	pgnumberbg.graphics.beginFill("white").drawRoundRect(-8,-10,50,50, 5);

	pagenumber = new createjs.Text("", "32px Nunito", "black");
	pagenumber.textAlign = "left";
	pgnumcontainer.addChild(pgnumberbg);
	pgnumcontainer.addChild(pagenumber);

	/*
	//NOTE: for 'responsive' scaling of nav elements...
	//top-left frame objects and bg have reg points set at topleft (0,0)
	//top-right frame objects and bg have reg points set at topright (image.width, 0)
	*/

	//rightborder image has reg point be its top right, so any sized image can be used, and it can scale...
	rightborder = new createjs.Bitmap(images['rightborder']);
	rightborder.regX = rightborder.image.width;
	rightborder.regY = 0;
	rightborder.x=canvas.width - 20;

	//leftborder image has top-left reg point.
	leftborder = new createjs.Bitmap(images['leftborder']);
	leftborder.x=10;
	leftborder.y=rightborder.y=13;

	//dodokidslogo has top-left reg point
	dodokidslogo = new createjs.Bitmap(images['but-dodo']);
	dodokidslogo.scaleX = dodokidslogo.scaleY = 0.10;
	dodokidslogo.x = 17; dodokidslogo.y = 14;
	dodokidslogo.onPress = dodokidslogoPressed;
    dodokidslogo.on("click", dodokidslogoPressed);

	//btnTip has top-right reg point
	btnTip = new createjs.Bitmap(images['but-tip']);
	btnTip.regX = btnTip.image.width;
	btnTip.regY = 0;
	btnTip.x = 835 + btnTip.regX; btnTip.y = 20;
    btnTip.on("click", teachertipPressed);
	btnTip.onPress = teachertipPressed;
    btnTip.on("click", teachertipPressed);

	btnTipOver = new createjs.Bitmap(images['but-tip-over']);
	btnTipOver.regX = btnTipOver.image.width;
	btnTipOver.regY = 0;
	btnTipOver.x = 835 + btnTipOver.regX; btnTipOver.y = 20;
    btnTipOver.on("click", teachertipPressed);
	btnTipOver.onPress = teachertipPressed;
    btnTipOver.on("click", teachertipPressed);

	//btnSnd has top-right reg point
	btnSnd = new createjs.Bitmap(images['but-snd']);
	btnSnd.regX = btnSnd.image.width;
	btnSnd.regY = 0;
	btnSnd.x = 893 + btnSnd.regX; btnSnd.y = 20;
    btnSnd.on("click", sndPressed);
	btnSnd.onPress = sndPressed;
    btnSnd.on("click", sndPressed);

	btnSndOver = new createjs.Bitmap(images['but-snd-over']);
	btnSndOver.regX = btnSndOver.image.width;
	btnSndOver.regY = 0;
	btnSndOver.x = 893 + btnSndOver.regX; btnSndOver.y = 20;
	btnSndOver.visible = false;
    btnSndOver.on("click", sndPressed);
	btnSndOver.onPress = sndPressed;

	//btnNoSnd has top-right reg point
	btnNoSnd = new createjs.Bitmap(images['but-nosnd']);
	btnNoSnd.regX = btnNoSnd.image.width;
	btnNoSnd.regY = 0;
	btnNoSnd.x = btnSnd.x; btnNoSnd.y = btnSnd.y;
    //btnNoSnd.on("click", sndPressed);
    btnNoSnd.on("click", repeatCurrent);
	btnNoSnd.onPress = sndPressed;

	btnNoSndOver = new createjs.Bitmap(images['but-nosnd-over']);
	btnNoSndOver.regX = btnNoSndOver.image.width;
	btnNoSndOver.regY = 0;
	btnNoSndOver.x = btnNoSnd.x; btnNoSndOver.y = btnSnd.y;
	btnNoSndOver.visible = false;
    btnNoSndOver.on("click", sndPressed);
	btnNoSndOver.onPress = sndPressed;

	//btnHome has top-right reg point
	btnHome = new createjs.Bitmap(images['but-home']);
	btnHome.regX = btnHome.image.width;
	btnHome.regY = 0;
	btnHome.x = 950 + btnHome.regX; btnHome.y = 20;
    btnHome.on("click", homePressed);
	btnHome.onPress = homePressed;

	btnHomeOver = new createjs.Bitmap(images['but-home-over']);
	btnHomeOver.regX = btnHomeOver.image.width;
	btnHomeOver.regY = 0;
	btnHomeOver.x = 950 + btnHomeOver.regX; btnHomeOver.y = 20;
	btnHomeOver.visible = false;
    btnHomeOver.on("click", homePressed);
	btnHomeOver.onPress = homePressed;

	btnNarration = new createjs.Bitmap(images['but-replay']);
	btnNarration.x = 920; btnNarration.y = 586;
    btnNarration.on("click", btnNarrationPressed);
	btnNarration.onPress = btnNarrationPressed;

	btnNarrationOver = new createjs.Bitmap(images['but-replay-over']);
	btnNarrationOver.x = 920; btnNarrationOver.y = 586;
	btnNarrationOver.visible = false;
    btnNarrationOver.on("click", btnNarrationPressed);
	btnNarrationOver.onPress = btnNarrationPressed;

	//enlarged white bg shows only on last 2 pages of story (last story page, glossary)
	arrowGameBG = new createjs.Bitmap(images['arrowbg_big']);
	arrowGameBG.regX = 43;
	arrowGameBG.x=943;
	arrowGameBG.y=248;
	arrowGameBG.visible=false;

	//only show on very last page of story (will be glossary)
	arrowGame = new createjs.Bitmap(images['navArrow_game']);
	arrowGame.x = 913;
	arrowGame.y = 278;
	arrowGame.visible = false;

	arrowGameOver = new createjs.Bitmap(images['navArrow_game_over']);
	arrowGameOver.x = 913;
	arrowGameOver.y = 278;
	arrowGame.visible = false;

	//only show on last page of text page of story.
	arrowBone = new createjs.Bitmap(images['arrow_bone']);
	arrowBone.x=arrowGame.x;
	arrowBone.y=arrowGame.y;
	arrowBone.visible=false;

	arrowBoneOver = new createjs.Bitmap(images['arrow_bone_over']);
	arrowBoneOver.x=arrowGame.x;
	arrowBoneOver.y=arrowGame.y;
	arrowBoneOver.visible=false;

	arrowbgLeft = new createjs.Bitmap(images['arrowbg']);
	arrowbgLeft.regX=43;
	arrowbgLeft.scaleX=-1;
	arrowbgRight = arrowbgLeft.clone();
	arrowbgRight.scaleX=1;

	arrowbgLeft.x=60;
	arrowbgRight.x=965;

	arrowbgLeft.regY = arrowbgLeft.image.width/2;
	arrowbgRight.regY = arrowbgLeft.image.width/2;
	arrowbgLeft.y=arrowbgRight.y=265 + arrowbgLeft.regY;
	arrowbgLeft.visible=false;

	arrowLeft = new createjs.Sprite(spritesheets['navArrow']);
	arrowLeft.name = 'arrowLeft';
	arrowLeft.x = 142;
	arrowLeft.y = 292
	arrowLeft.gotoAndStop(0);

	arrowRight = new createjs.Sprite(spritesheets['navArrow']);
	arrowRight.scaleX = -1;
	arrowRight.x = 886;
	arrowRight.y = 292
	arrowRight.gotoAndStop(0);

	//arrowRight.onPress = goForward;
	//arrowLeft.onPress = goBackward;
    arrowLeft.on("click", goBackward);
    arrowRight.on("click", goForward);
	arrowGame.onPress = gotoQuiz;
	arrowBone.onPress = goForward;

	//4 colored rectangles flank the top/bottom/left/right edges of canvas, matching color of html page background
	//this allows createjs canvas to use white border image that doesn't have clean edges
	var edgeColor = $('body').css('background-color');
	edgeLEFT.graphics.beginFill(edgeColor).drawRect(0,0,20,canHeight);
	edgeRIGHT.graphics.beginFill(edgeColor).drawRect(canWidth-20,0,20,canHeight);
	edgeTOP.graphics.beginFill(edgeColor).drawRect(0,0,canWidth,20);
	edgeBOTTOM.graphics.beginFill(edgeColor).drawRect(0,canHeight-20,canWidth,20);

	//teachertipcontainer:
	teachertipcontainer = new createjs.Container();
	teachertipcontainer.offY = 700;
	teachertipcontainer.onY = 450;
	teachertipcontainer.onPage = true; //bool that is set at each page, tells whether the given page has a tip to show. default: false, a certain page sets to true if needed
	teachertipcontainer.active = true; //bool that tells whether teachertipcontainer is visible onstage or not
	teachertipcontainer.onPress = teachertipPressed;
	teachertipcontainer.x = 24; teachertipcontainer.y = teachertipcontainer.offY;

	teachertipbox = new createjs.Bitmap(images['teachertipbox']);
	teachertipboxcloseX = new createjs.Bitmap(images['closeX']);
	teachertipboxcloseX.x = 948;
	teachertipboxcloseX.y = 440;
	teachertipboxcloseX.onPress = teachertipPressed;

	teachertipboxcloseXOver = new createjs.Bitmap(images['closeXOver']);
	teachertipboxcloseXOver.x = teachertipboxcloseX.x;
	teachertipboxcloseXOver.y = teachertipboxcloseX.y;

	teachertipboxcloseX.onMouseOver = function(e){
		document.body.style.cursor='pointer';
		teachertipboxcloseXOver.visible = true;
	}
	teachertipboxcloseX.onMouseOut = hideAllOvers;

	teachertiptext = new createjs.Text("", "24px Nunito", "black");
	teachertiptext.x = 25; teachertiptext.y = 25;
	teachertiptext.textAlign = "left";
	teachertiptext.lineWidth = 885;
	teachertiptext.lineHeight = 35;

	teachertipcontainer.addChild(teachertipbox);
	teachertipcontainer.addChild(teachertiptext);
	teachertipboxcloseX.visible = false;
	teachertipboxcloseXOver.visible = false;

	stage.addChild(btnNarration);
	stage.addChild(btnNarrationOver);
	stage.addChild(teachertipcontainer);
	stage.addChild(teachertipboxcloseX);
	stage.addChild(teachertipboxcloseXOver);

	stage.addChild(edgeLEFT);
	stage.addChild(edgeRIGHT);
	stage.addChild(edgeTOP);
	stage.addChild(edgeBOTTOM);

	stage.addChild(whiteborder);
	stage.addChild(leftborder);
	stage.addChild(rightborder);
	stage.addChild(dodokidslogo);

	//only add parent tip btn to navArrows container IF the story is using the 3-btn sized topright frame bg
    //** quizzes and certain texts use only 1 or  2 btn topright bg, they won't show btnTip
	if(rightborder.image.src.indexOf('topright3') !== -1){
		stage.addChild(btnTip);
		stage.addChild(btnTipOver);
		btnTipOver.visible = false;
	}

	stage.addChild(btnSnd);
	stage.addChild(btnSndOver);
	stage.addChild(btnNoSnd);
	stage.addChild(btnNoSndOver);
	btnNoSnd.visible = false;
	stage.addChild(btnHome);
	stage.addChild(btnHomeOver);

	stage.addChild(arrowbgLeft);
	stage.addChild(arrowbgRight);
	stage.addChild(arrowLeft);
	stage.addChild(arrowRight);
	stage.addChild(arrowGameBG);
	stage.addChild(arrowGame);
	stage.addChild(arrowGameOver);
	stage.addChild(arrowBone);
	stage.addChild(arrowBoneOver);
	if(show_pagenumber && pagenames) stage.addChild(pgnumcontainer);
    
    setupAnimations();

	setupOvers();

	//separate on window resize function to adjust createjs canvas elements' scaling
	$(window).resize(function() {
		storybook_resize();
	});


	//loading first page/world:
	//if STORYBOOK -  function_prepWorld will still be -1. can will nwo be set to first page's prep function
	//if QUIZ - function_prepWorld will have changed from -1, and won't be set to world0 here
	currentPage = 0;
    if(function_prepWorld == -1){
        function_prepWorld = "prep_" + pagenames[currentPage];
	}
    
	makeWorldMain('none');

	//do first canvas element resize based on windowsize:
	storybook_resize();
}


//NOW make world_main... uses the dynamically created function_prepWorld string
function makeWorldMain(transition){
	// Since its name is being dynamically generated, always ensure your function actually exists
	if (typeof(window[function_prepWorld]) === "function") window[function_prepWorld](transition);
	else if (pages && typeof(pages[function_prepWorld]) === "function") pages[function_prepWorld](transition); 
    else
        throw("Error.  Function " + function_prepWorld + " does not exist.");
}

function storybook_resize(){
	var s;

	if($(window).width() < 460){
		//alert('width < 460: ' + $(window).width() );

		s = 0.5 * canvas.width/$(window).width();
		rightborder.x = canvas.width + 10*s;
		rightborder.scaleY  = s * 0.9;

		btnSnd.x = btnHome.x - (1 * btnHome.image.width *s) - 5*s;
		btnSndOver.x = btnSnd.x;

		btnNoSnd.x = btnSnd.x;
		btnNoSndOver.x = btnNoSnd.x;

		btnTip.x = btnSnd.x - (1 * btnHome.image.width *s) - 5*s;
		btnTipOver.x = btnTip.x;

		arrowbgRight.scaleX = arrowbgRight.scaleY = s * 0.6;
		arrowbgLeft.scaleX = arrowbgLeft.scaleY = -1 * s * 0.6;

		arrowbgRight.y = 265 + arrowbgLeft.regY;
		arrowbgLeft.y  = arrowbgRight.y + 30*s;

		arrowLeft.x = arrowbgLeft.x + 50*s;
		arrowRight.x = arrowbgRight.x - 52*s;

		arrowLeft.scaleY = arrowRight.scaleY = s*0.6;
		arrowLeft.scaleX = s*0.6;
		arrowRight.scaleX = -1 *s*0.6

		arrowGameBG.scaleX = arrowGameBG.scaleY = s*0.75;
		arrowGameBG.x=943;
		arrowGameBG.y=228;
	} //else - restore wrapper elements to original
	else{

		s=1;

		rightborder.x = canvas.width - 10;
		rightborder.scaleY  = s;
		btnTip.x = 835 + btnTip.regX;
		btnTipOver.x = btnTip.x;
		btnSnd.x = 893 + btnSnd.regX;
		btnSndOver.x = btnSnd.x;
		btnNoSnd.x = btnSnd.x;
		btnNoSndOver.x = btnNoSnd.x;
		btnHome.x = 950 + btnHome.regX;
		btnHomeOver.x = btnHome.x;

		arrowbgRight.scaleX = arrowbgRight.scaleY = 1 * s;
		arrowbgLeft.scaleX = arrowbgLeft.scaleY = -1 * s;
		arrowbgRight.y = 265 + arrowbgLeft.regY;
		arrowbgLeft.y= 310 + arrowbgLeft.regY;

		arrowLeft.x = 142;
		arrowRight.x = 886;
		arrowLeft.scaleY = arrowRight.scaleY = 1;
		arrowLeft.scaleX = 1;
		arrowRight.scaleX = -1;

		arrowGameBG.scaleX = arrowGameBG.scaleY = 1;
		arrowGame.scaleX = arrowGame.scaleY = 1;
		arrowBone.scaleX = arrowBone.scaleY = 1;

		arrowGameBG.x=943;
		arrowGameBG.y=248;
		arrowGame.x = 913;
		arrowGame.y = 278;
		arrowGameOver.x = arrowGame.x;
		arrowGameOver.y = arrowGame.y;
		arrowBone.x=arrowGame.x;
		arrowBone.y=arrowGame.y;
		arrowBoneOver.x=arrowGame.x;
		arrowBoneOver.y=arrowGame.y;
	}

	leftborder.scaleX = leftborder.scaleY = s;
	dodokidslogo.scaleX = dodokidslogo.scaleY = s * 0.10;

	rightborder.scaleX = s;

	btnTip.scaleX = btnTip.scaleY = s;
	btnTipOver.scaleX = btnTipOver.scaleY = s;
	btnHome.scaleX = btnHome.scaleY  = s;
	btnHomeOver.scaleX = btnHomeOver.scaleY  = s;
	btnSnd.scaleX = btnSnd.scaleY = s;
	btnSndOver.scaleX = btnSndOver.scaleY = s;
	btnNoSnd.scaleX = btnNoSnd.scaleY = s;
	btnNoSndOver.scaleX = btnNoSndOver.scaleY = s;

	arrowBoneOver.scaleX = arrowBoneOver.scaleY = s;
	arrowGameOver.scaleX = arrowGameOver.scaleY = s;
}

function dodokidslogoPressed(e){
	window.location.href = 'http://www.dodobaike.com';
}

function homePressed(e){
	window.location.href = 'index.html';
}

function sndPressed(e){
	snd_active = !snd_active;

	if(snd_active){
		btnNoSnd.visible = false;
		btnNoSndOver.visible = false;

		if(glossary_active){
			glossary_define();
			return;
		}

	    function_onReady();
	    disableDefinitions();
	} //sound deactivated: different paths for quiz vs storybook
	else{
		btnNoSnd.visible = true;
		btnNarration.visible = false;
		btnNarrationOver.visible = false;
		stopSound();
		//remove highlighted copy of narration text from stage during mute, so it does not appear for moment upon unmute
		world_current.removeChild(text_page2);

		//only if its a quiz-- still trigger narrDone -->fading of answer choices:
		if(!pagenames){
			narrDone();
		} //else -- it's a storybook
		else{
			enableDefinitions();
		}
	}
}

function btnNarrationPressed(e){
	hideDefinition();
	function_onReady();
	disableDefinitions();
}

function teachertipPressed(e){

	if(!_active || !teachertipcontainer.onPage) return;

	createjs.Tween.removeTweens(teachertipcontainer);
	if(e.target == teachertipcontainer) teachertipcontainer.active = true;

	var moveTo;
	if (teachertipcontainer.active){
		moveTo = teachertipcontainer.offY;
		teachertipboxcloseX.visible = false;
		teachertipboxcloseXOver.visible = false;
	}
	else{
		moveTo = teachertipcontainer.onY;
	}

	teachertipcontainer.active = !teachertipcontainer.active;

	createjs.Tween.get(teachertipcontainer, {loop:false})
     .to({y: moveTo }, 500, createjs.Ease.linear)
     .call(function(){
     	if(teachertipcontainer.active){
			teachertipboxcloseX.visible = true;
     	}
     });

     hideDefinition();
}

//***************
//TRANSITION & LEVEL LOADING FUNCTIONS:
//called via arrowRight, or by certain in-level conditions... always calls end_world#() before prepping next lvel and beginning transition
function goForward(e){
	if (!allowTransition) return;
	arrowRight.gotoAndStop(1);

	//tween teachertip offscreen quickly
	teachertipcontainer.active = false;
	teachertipcontainer.onPage = false;
	createjs.Tween.get(teachertipcontainer, {loop:false})
     .to({y: teachertipcontainer.offY }, 250, createjs.Ease.linear);

	//e.onMouseUp = function(ev){
	arrowRight.gotoAndStop(0);
	_active = false;

	stopSound();

	//before beginning transition & calling world_current's end_world fuction, cache the current world_current so it transitions smoothly
	world_current.cache(0,0,canvas.width,canvas.height);

	narrationMask.x = -300;
	definitionMask.x = -300;
	btnNarration.visible = false;
	btnNarrationOver.visible = false;
	end_world();

	//figuring out which world/page to load next

	//if there is a pagenames[] member AFTER pagenames[currentPage], increment currentPage by 1, otherwise swich currentPage to 0
	//if (worlds[indx_main+1]) indx_right = indx_main + 1;
	if (pagenames[currentPage+1]) currentPage++; else currentPage = 0;
    
    
    // if the current page is a question
    if (quiz_content && quiz_content[pagenames[currentPage]]) {
        // handle question, added by @leio
        qWord = pagenames[currentPage];
	    qText = quiz_content[qWord][1];
        qType = quiz_content[qWord][0];
    

	    //figuring out which world/page to load next
	    var mechs = [];
        var mechNum = quizMechs[qType].length;
        currentMech = null;
	    for(var i = 0; i < quizMechs[qType].length;i++){
		    mechs.push(quizMechs[qType][i]);

		    //remove current mech from possible choices this time
		    if( (currentMech == mechs[mechs.length-1]) && mechNum > 1 ){
			    mechs.pop();
                mechNum--;
		    }
	    }
    
	    currentMech = mechs[randomInt(0, mechNum - 1)];
	    function_prepWorld = "prep_" + currentMech;
    } else {
	    function_prepWorld = "prep_" + pagenames[currentPage];	
    }
    
    makeWorldMain('right');
    

	allowTransition = false;
	arrowRight.alpha = arrowLeft.alpha  = 0.5;

	slide_center_to_left();
}

function goBackward(e){
	if (!allowTransition) return;
	arrowLeft.gotoAndStop(1);

	//tween teachertip offscreen quickly
	teachertipcontainer.active = false;
	teachertipcontainer.onPage = false;
	createjs.Tween.get(teachertipcontainer, {loop:false})
     .to({y: teachertipcontainer.offY }, 250, createjs.Ease.linear);

	arrowLeft.gotoAndStop(0);
	arrowGameBG.visible=false;
	arrowbgRight.visible=true;

	_active = false;

	stopSound();

	//before beginning transition & calling world_current's end_world fuction, cache the current world_current so it transitions smoothly
	world_current.cache(0,0,canvas.width,canvas.height);

	narrationMask.x = -300;
	definitionMask.x = -300;
	btnNarration.visible = false;
	btnNarrationOver.visible = false;
	end_world();

	//figuring out which world/page to load next

	//if there is a pagenames[] member BEFORE pagenames[currentPage], decrement currentPage by 1, otherwise switch currentPage to 0
	//if (worlds[indx_main+1]) indx_right = indx_main + 1;
	if (pagenames[currentPage-1]) currentPage--;
	else currentPage = pagenames.length-1;

	if(currentPage==0) arrowbgLeft.visible=false;

	function_prepWorld = "prep_" + pagenames[currentPage];
	makeWorldMain('left');

	allowTransition = false;
	arrowRight.alpha = arrowLeft.alpha  = 0.5;

	slide_center_to_right();
}


function repeatCurrent() {    
    makeWorldMain('none');
}

//quiz-specific:
//goForward / goBackward functions.-- cannot call mouseUP calls via setTimeout)
// Note: choice1, choice2, choice3 are defined in the particular mechanics - i.e. quiz_mechs folder
function quizQ_fadein_choice(i){
	var choice, wordchoice;
    choice = choices[i]; 
    wordchoice = wordchoices[i]; 

	fade_in_center(choice, 400);

	playSound(wordchoice, quizQ_fadein_choice, 400);
}


function quizQ_fadein_left(){
	var choice, wordchoice;

    for (var i = 0; i < choices.length; i++) {
	    if (posLEFT == choices[i].x) {
		    choice = choices[i]; 
            wordchoice = wordchoices[i]; 
            break;
	    }
    }
    
	fade_in_center(choice, 400);

	playSound(wordchoice, quizQ_fadein_mid, 400);
}

function quizQ_fadein_mid(){
	var choice, wordchoice;
    for (var i = 0; i < choices.length; i++) {
	    if (posMID == choices[i].x) {
		    choice = choices[i]; 
            wordchoice = wordchoices[i]; 
            break;
	    }
    }

	fade_in_center(choice, 400);

	playSound(wordchoice, quizQ_fadein_right, 400);
}

function quizQ_fadein_right(){
	var choice, wordchoice;
    for (var i = 0; i < choices.length; i++) {
	    if (posRIGHT == choices[i].x) {
		    choice = choices[i]; 
            wordchoice = wordchoices[i]; 
            break;
	    }
    }

	fade_in_center(choice, 400, quizQ_fadesDone);
	playSound(wordchoice);
}

function quiz_answerMouseOver(target){
	target.onMouseOver = function(e){
		document.body.style.cursor='pointer';
	}
	target.onMouseOut = function(e){
		document.body.style.cursor='default';
	}
    
}

function quiz_wiggleAll(){
	quiz_wiggleChoice(choices[0]);
	quiz_wiggleChoice(choices[1]);
	quiz_wiggleChoice(choices[2]);
}

function quiz_wiggleChoice(choice){
	var wiggleMS = 40;

	createjs.Tween.get(choice, {loop:false})
     .to({rotation:-25}, wiggleMS, createjs.Ease.linear)
     .call(function(){

		createjs.Tween.get(choice, {loop:false})
	     .to({rotation:0, scaleX: 1.2, scaleY: 1.2}, wiggleMS, createjs.Ease.linear)
	     .call(function(){

			createjs.Tween.get(choice, {loop:false})
		     .to({rotation:25, scaleX: 1.0, scaleY: 1.0}, wiggleMS, createjs.Ease.linear)
		     .call(function(){

				createjs.Tween.get(choice, {loop:false})
			     .to({rotation:0}, wiggleMS, createjs.Ease.linear);
			     //.call(returnCan);
		     });
	     });
     });
}

function quizQ_finalAudio(){
    console.log("quizQ_finalAudio" + snd_active);
	//if sound is OFF - go onto next question after time delay
	if(!snd_active){
		//quizQ_ontoNext();
		setTimeout('quizQ_ontoNext()', 1500);
		return;
	}
    if ('f_' + qWord in sounds) {
	    playSound('f_' + qWord, quizQ_ontoNext);
    } else {
        quizQ_ontoNext();
    }
}

function quizQ_ontoNext(){
	//correct:
	if(questionOutcome.search("incorrect") == -1){
        //alert("correct");
        //console.log(quiz_words);
        if (quizMechs) {
		    //remove current quiz word from remaining list:
		    quiz_words.remove(_questionNumber);

            //check if all words solved successfully. if so, go to quiz end.
            if(quiz_words.length == 0){
                setTimeout('quiz_goToEnd()', 1000);
                return;
            }
            //otherwise move onto next page
            setTimeout('quiz_getNewQ(true)', 1000);
        } else {
            setTimeout('goForward(null)', 1000);
        }
	} //wrong:
	/*else{
        alert("incorrect");
		setTimeout('quiz_getNewQ(true)', 1000);
	}*/
}

function quiz_doCover(){
    console.log("quiz_doCover");
	function_prepWorld = "prep_quiz_cover";
}

function quiz_coverForward(e){
    console.log("quiz_coverForwad");
	arrowRight.visible = false;
	arrowbgRight.visible=false;
	quiz_getNewQ(true);
}

/*
//pulls random quiz word, and question text
//_questionNumber will be random # to pull a random word from quiz_words
//quiz_content holds the question text and answer choices for the word in quiz_words
*/
function quiz_getNewQ(forward){
    _questionNumber = 0; //randomInt(0,quiz_words.length-1);
    console.log("quiz_getNewQ:" + quiz_words[_questionNumber]);
	//_questionNumber = quiz_words.length-1;
	qWord = quiz_words[_questionNumber];
	qText = quiz_content[qWord][1];
    qType = quiz_content[qWord][0];

	//figuring out which world/page to load next
	var mechs = [];
    var mechNum = quizMechs[qType].length;
    
	for(var i = 0; i < quizMechs[qType].length;i++){
		mechs.push(quizMechs[qType][i]);

		//remove current mech from possible choices this time
		if( (currentMech == mechs[mechs.length-1]) && mechNum > 1 ){
			mechs.pop();
            mechNum--;
		}
	}
    
	currentMech = mechs[randomInt(0, mechNum - 1)];
	function_prepWorld = "prep_" + currentMech;
    console.log("get_Newq:" + function_prepWorld);
    
    // for quiz to use narration function, added by @leio
    var qWordPhrase = "q_" + qWord;
    if (phrases[qWordPhrase]) {
        setNarrationText();
        renderNarration(qWordPhrase);
    }

	//for sliding transition: world_main slides center to left, world_right slides right to center
	//set world_main to the currently active world container. world_right to the new one that's to be brought in.
	world_main = world_current;
	world_right = worlds[qWord];

	//** if called at conclusion of a prev. question, it will pass forward as true, call quiz_goForward
	//quiz_getNewQ also called at load w/o 'true' param... no need to goForward then
	if(forward) quiz_goForward();

}

function quiz_goForward(){
		//quiz_getNewQ(); //**get new quiz question word BEFORE next mechanic is loaded

		arrowRight.gotoAndStop(0);
		_active = false;

		stopSound();

		//before beginning transition & calling world_current's end_world fuction, cache the current world_current so it transitions smoothly
		world_current.cache(0,0,canvas.width,canvas.height);

		narrationMask.x = -300;
		definitionMask.x = -300;
		btnNarration.visible = false;
		btnNarrationOver.visible = false;
        processBar.x += PROCESS_STEP;
        processBarStar.x += PROCESS_STEP;
		end_world();

		makeWorldMain('right');

		allowTransition = false;
		arrowRight.alpha = arrowLeft.alpha  = 0.5;

		slide_center_to_left();
}


//quiz-specific end function - transitions from current quesiton page to the quiz_end page
//** ULTIMATLEY THIS COULD BE MERGED INTO quiz_getNewQ... and branch to this instead of quiz_goForward ...
//** what matters is between //*&*&*
function quiz_goToEnd(){
	arrowRight.gotoAndStop(0);
	_active = false;

	stopSound();

	//before beginning transition & calling world_current's end_world fuction, cache the current world_current so it transitions smoothly
	world_current.cache(0,0,canvas.width,canvas.height);

	narrationMask.x = -300;
	definitionMask.x = -300;
	btnNarration.visible = false;
	btnNarrationOver.visible = false;
	end_world();

	//figuring out which world/page to load next

	//for sliding transition: world_main slides center to left, world_right slides right to center
	//set world_main to the currently active world container. world_right to the new one that's to be brought in.
	world_main = worlds[currentMech];
	world_right = world_current;

	function_prepWorld = "prep_" + quiz_end;
	makeWorldMain('quiz_end'); //'quiz_end' passed to initTransitionAndLoad

	allowTransition = false;
	arrowRight.alpha = arrowLeft.alpha  = 0.5;

	slide_center_to_left();
}

//navigates to url stored in var quiz_url (quiz_url is created for each storybook)
//if quiz_url is not defined.... fall back is to go to next page.
function gotoQuiz(e){

	if(quiz_url.length>0){
		window.location.href = quiz_url;
	}
	else{
		alert('no quiz url defined');
	}

}


function slide_center_to_left(){
	createjs.Tween.get(world_main, {loop:false})
     .to({x: (canWidth*-1) }, transTweenMS, createjs.Ease.linear)
     .call(function(){
		stage.removeChild(world_main);
		world_main.removeAllChildren();

     });
}

function slide_center_to_right(){
	createjs.Tween.get(world_main, {loop:false})
     .to({x: (canWidth) }, transTweenMS, createjs.Ease.linear)
     .call(function(){
		stage.removeChild(world_main);
		world_main.removeAllChildren();
     });
}


function slide_left_to_center(){
    pageStartTime = (new Date()).getTime();
	createjs.Tween.get(world_left, {loop:false})
     .to({x: 0 }, transTweenMS, createjs.Ease.linear)
     .call(function(){
		world_inplace(world_left);
     });
}

function slide_right_to_center(){
    pageStartTime = (new Date()).getTime();
    createjs.Tween.get(world_right, {loop:false})
     .to({x: 0 }, transTweenMS, createjs.Ease.linear)
     .call(function(){
		world_inplace(world_right);
     });
}

function slide_quizend_to_center(){
	world_current.x = canWidth;

	createjs.Tween.get(world_current, {loop:false})
     .to({x: 0 }, transTweenMS, createjs.Ease.linear)
     .call(function(){
		world_current.uncache();

		createjs.Ticker.removeEventListener("tick", transitionTicker);
		createjs.Ticker.addEventListener("tick", ticker_world);

		allowTransition = true;
		arrowRight.alpha = arrowLeft.alpha  = 1;

		_active = true;

		//change teachertip button if teachertip has been created for current page:
		if(teachertipcontainer.onPage) btnTip.alpha = 1;
		else btnTip.alpha = 0.4;

		snd_activeCnt = 0;
		disableDefinitions();

		if (function_onReady){
			function_onReady();
		}
     });
}


function transitionTicker(){
	stage.update();
}

//final function that adds level's ticker & sets left, center, right levels for transition
function world_inplace(world_current){
	world_current.x = 0;

	//once main world_current has transitioned to center, uncache so its stage updates ontick!
	world_current.uncache();

	createjs.Ticker.removeEventListener("tick", transitionTicker);
	createjs.Ticker.addEventListener("tick", ticker_world);

	var indx_left, indx_right;

	//if STORYBOOK - pagenames exists
	if(pagenames){
		//updating pagenumber:
		pagenumber.text = currentPage;
		if( (currentPage > 0) && (currentPage < (pagenames.length-1)) ) pgnumcontainer.visible = true;
		else pgnumcontainer.visible = false;

		//if there is a world_current AFTER current world_current, it becomes world_right, otherwise, set world_right to 0
		if (pagenames[currentPage+1]) indx_right = currentPage + 1;
		else indx_right = 0;

		//if there is a world_current BEFORE current world_current, it becomes world_left, otherwise, set world_current left to last world_current
		if (pagenames[currentPage-1]) indx_left = currentPage - 1;
		else indx_left = pagenames.length - 1;

		world_main = worlds[ pagenames[currentPage] ];
		world_left = worlds[ pagenames[indx_left] ];
		world_right = worlds[ pagenames[indx_right] ];
	}

	allowTransition = true;
	arrowRight.alpha = arrowLeft.alpha  = 1;

	_active = true;

	//change teachertip button if teachertip has been created for current page:
	if(teachertipcontainer.onPage) btnTip.alpha = 1;
	else btnTip.alpha = 0.4;

	if(pagenames[indx_right]=="glossary")
	{
		arrowRight.visible=false;
		arrowbgRight.visible=false;
		arrowGameBG.visible=true;
		arrowBone.visible=true;
	} else{
		arrowBone.visible=false;
	}

	snd_activeCnt = 0;
	disableDefinitions();

	if (function_onReady) function_onReady();
}

/*
called by all worlds at end of prep_world# function.
receives 'transition' from prep function.
initiates sliding transition or begins play.
adds current world_current to stage & adjusts layering so nav arrows are on top of current world_current
does callback function ONCE world_current IS FULLY TRANSITIONED, if provided
*/
function initTransitionAndLoad(transition, callback){   
	//for smooth transition: caching each world_current as it transitions into center
	world_current.cache(0,0,canvas.width,canvas.height);

	if (callback) function_onReady = callback;
	else function_onReady = null;

	switch(transition){
		case 'right':
			world_current.x = canWidth;
			slide_right_to_center();
			createjs.Ticker.addEventListener("tick", transitionTicker);
		break;
		case 'left':
			world_current.x = canWidth * -1;
			slide_left_to_center();
			createjs.Ticker.addEventListener("tick", transitionTicker);
		break;
		case 'quiz_end':
			world_current.x = canWidth * -1;
			slide_quizend_to_center();
			createjs.Ticker.addEventListener("tick", transitionTicker);
		break;

		//if no transition given- be sure to establish callback now BEFORE world_inplace is called
		default:
			world_inplace(world_current);
		break;
	}

    stage.addChild(world_current);

	bringUpUI();
}

function bringUpUI(){

	stage.addChild(btnNarration);
	stage.addChild(btnNarrationOver);
	stage.addChild(teachertipcontainer);
	stage.addChild(teachertipboxcloseX);
	stage.addChild(teachertipboxcloseXOver);
	teachertipboxcloseX.visible = false;
	teachertipboxcloseXOver.visible = false;

	stage.addChild(edgeLEFT);
	stage.addChild(edgeRIGHT);
	stage.addChild(edgeTOP);
	stage.addChild(edgeBOTTOM);

	stage.addChild(whiteborder);
	stage.addChild(leftborder);
	stage.addChild(rightborder);
	stage.addChild(dodokidslogo);

	//only add parent tip btn to navArrows container IF the story is using the 3-btn sized topright frame bg
    //** quizzes and certain texts use only 1 or  2 btn topright bg, they won't show btnTip
	if(rightborder.image.src.indexOf('topright3') !== -1){
		stage.addChild(btnTip);
		stage.addChild(btnTipOver);
		btnTipOver.visible = false;
	}

	stage.addChild(btnSnd);
	stage.addChild(btnSndOver);
	stage.addChild(btnNoSnd);
	stage.addChild(btnNoSndOver);
	//btnNoSnd.visible = false;
	stage.addChild(btnHome);
	stage.addChild(btnHomeOver);

	stage.addChild(arrowbgLeft);
	stage.addChild(arrowbgRight);
	stage.addChild(arrowLeft);
	stage.addChild(arrowRight);
	stage.addChild(arrowGameBG);
	stage.addChild(arrowGame);
	stage.addChild(arrowGameOver);
	stage.addChild(arrowBone);
	stage.addChild(arrowBoneOver);
    
	if(show_pagenumber && pagenames) stage.addChild(pgnumcontainer);

	arrowGameOver.visible = false;
	arrowBoneOver.visible = false;

	stage.update();
}

function setupAnimations() {
    processBar = new createjs.Bitmap(images['process-bar']);
    processBarStar = new createjs.Bitmap(images['process-star']);
    
    processBarStar.regX = processBarStar.image.width / 2;
	processBarStar.regY = processBarStar.image.height / 2;

    var processBACK = new createjs.Bitmap(images['process-background']);
    //processBACK.regX = processBACK.image.width / 2;
	processBACK.regY = processBACK.image.height / 2;
	processBar.regY = processBar.image.height / 2;
    processBar.scaleX = processBarStar.scaleX = processBACK.scaleX = 0.5;
    processBar.scaleY = processBarStar.scaleY = processBACK.scaleY = 0.5;
    processBar.x = -processBar.image.width * processBar.scaleX;
    processBar.y = processBarStar.y = processBACK.y = processBACK.image.height * processBACK.scaleY;
    var barmask = new createjs.Shape();
    barmask.graphics.beginFill("green").drawRect(10, 20, processBACK.image.width, processBACK.image.height);
    barmask.alpha = 0.9;
    processBar.mask = barmask;
    
    processBarContainer.addChild(processBar);
    processBarContainer.addChild(processBACK);
    processBarContainer.addChild(processBarStar);
    
    processBarContainer.x = (canvas.width - processBACK.image.width * processBACK.scaleX ) / 2;
    processBarContainer.y = 30;
    
    PROCESS_STEP = processBar.image.width * processBar.scaleX / pagenames.length;
    
    dodo = new createjs.Sprite(spritesheets['dodo']);
    dodo.visible = false;
	dodo.x = 600;
	dodo.y = 500;
	dodo.gotoAndStop(0);   
    
    stage.addChild(processBarContainer);
    stage.addChild(dodo);
}

//***mouseOver and mouseOut listeners for UI wrapper btns
function setupOvers(){

	dodokidslogo.onMouseOver = function(e){
		document.body.style.cursor='pointer';
	}

	btnTip.onMouseOver = function(e){
		if(btnTip.alpha ==1){
			btnTipOver.visible = true;
			document.body.style.cursor='pointer';
		}
	}

	btnSnd.onMouseOver = function(e){
		btnSndOver.visible = true;
		document.body.style.cursor='pointer';
	}

	btnNoSnd.onMouseOver = function(e){
		btnNoSndOver.visible = true;
		document.body.style.cursor='pointer';
	}

	btnNarration.onMouseOver = function(e){
		btnNarrationOver.visible = true;
		document.body.style.cursor='pointer';
	}

	btnHome.onMouseOver = function(e){
		btnHomeOver.visible = true;
		document.body.style.cursor='pointer';
	}

	arrowLeft.onMouseOver = function(e){
		arrowLeft.gotoAndStop(1);
		document.body.style.cursor='pointer';
	}

	arrowRight.onMouseOver = function(e){
		arrowRight.gotoAndStop(1);
		document.body.style.cursor='pointer';
	}

	arrowGame.onMouseOver = function(e){
		arrowGameOver.visible = true;
		document.body.style.cursor='pointer';
	}
	arrowBone.onMouseOver = function(e){
		arrowBoneOver.visible = true;
		document.body.style.cursor='pointer';
	}

	whiteborder.onMouseOut = hideAllOvers;
	dodokidslogo.onMouseOut = hideAllOvers;
	btnTipOver.onMouseOut = hideAllOvers;
	btnSndOver.onMouseOut = hideAllOvers;
	btnNoSndOver.onMouseOut = hideAllOvers;
	btnNarrationOver.onMouseOut = hideAllOvers;
	btnHomeOver.onMouseOut = hideAllOvers;
	arrowLeft.onMouseOut = hideAllOvers;
	arrowRight.onMouseOut = hideAllOvers;
	arrowBone.onMouseOut = hideAllOvers;
	arrowGame.onMouseOut = hideAllOvers;

	//on edge mouseovers, hide ALL btn over states
	edgeTOP.onMouseOver = hideAllOvers;
	edgeLEFT.onMouseOver = hideAllOvers;
	edgeRIGHT.onMouseOver = hideAllOvers;
	edgeBOTTOM.onMouseOver = hideAllOvers;
}

function hideAllOvers(e){
	document.body.style.cursor='default';

	arrowLeft.gotoAndStop(0);
	arrowRight.gotoAndStop(0);

	btnTipOver.visible = false;
	btnSndOver.visible = false;
	btnNoSndOver.visible = false;
	btnHomeOver.visible = false;
	btnNarrationOver.visible = false;
	arrowBoneOver.visible = false;
	arrowGameOver.visible = false;
	teachertipboxcloseXOver.visible = false;
}

//***************
//GENERAL GAME FUNCTIONS:

/*
NEW, 7-10-2013: only two different text rendering options, determined solely by # of lines of text when rendered in default
DEFAULT: BIG: 30pt font, 36 pt line height

If BIG rendering is found to be 4 or more lines of text -->  BIG switch to SMALL
SMALL: 24 pt font, 30 pt line height

default line width: 880px
*/

//WORD-BY-WORD NARRATION:
//*NO LONGER USED:  OPTIONAL params in setNarrationText on each page
	//optional param: customW is number for text_page linewidth. if nothing provided, default is 880
	//2nd optional param: customTxtSize is number for text font size. if nothing provided, default is 30px
	//3rd optional param: custom lineHeight. if not provided, default is 35
	//4th optional param: custom position of text - passing an array [x,y] - default is x=65, y=510
function setNarrationText(customW, customTxtSize, customH, customPos, x, y){

    if(!x) x = 65;
	if(!y) y = 510;
    
	//1: original page text
	text_page = new createjs.Text("", "30px Nunito", "black");
	text_page.x = x; text_page.y = y;
	text_page.textAlign = "left";
	text_page.textBaseline = "middle";

	text_page.lineWidth = 880; //default

	text_page.lineHeight = 36; //35; //default

	world_current.addChild(text_page);
}

//this is actually the "render page text" function
//params: sndID is phrase name in phrases[], defWords is array of in-text words to be highlighed (having definitions)
function renderNarration(sndID, defWords){
	//1) render text first:
	//need to do a check here to gather which words will be the line breaks (using incrementing string rendered in proper style in dummyText)
	wholeString = "";

 	//CRUCIAL- used to render current word *and prev word* in exact font style as text_page. useful for getting needing width measurements for mask
	dummyText = text_page.clone();
	dummyText.text = "";

	definitionMask = new createjs.Shape();

	//clear definitionBoxes on each page
	definitionBoxes = [];

	var word= "";
	for (var h=0; h < phrases[sndID][0].length; h++) {
		word = phrases[sndID][0][h];
		if(word.indexOf("_") != -1 ){
			word = word.replace('_', ' ');
		}
        wholeString += word;
	}

	text_page.text = wholeString;

	//after the complete text is rendered on page in proper style
	//check for line breaks , add word index to array linebreaks
	//CLEAR linebreaks each time a new phrase is rendered
	linebreaks = [];
	//definitions = []; //hold all definition Containers
	lineString = "";

	defWords1 = [];
	defWords2 = [];

	if(defWords){
		defWords1 = defWords.slice();
		defWords2 = defWords.slice();
	}

	for (var i=0; i < phrases[sndID][0].length; i++) {
		lineString += phrases[sndID][0][i];

		dummyText.text = lineString;

		if (dummyText.getMeasuredWidth() > (text_page.lineWidth + 10) ) //+10 is some extra pixels threshold to allow before considering linebreak
		{
            //Need to store this for use in narration_newWord (so it knows when to move narrationMask to down a line & back to left start)
			linebreaks.push(i);
			lineString = phrases[sndID][0][i];
		}

		//def test:
		if(defWords1.length>0){
			for (var h=0;h<defWords1.length;h++){
				var theDef =  defWords1[h] + ' ';
				if(theDef == phrases[sndID][0][i]){
					var firstlinephrase;
					if(linebreaks.length == 0 ) firstlinephrase = phrases[sndID][0][0];
					else firstlinephrase = phrases[sndID][0][linebreaks.length-1];

					defWords1.remove(h);

					getDefPosition(sndID, theDef, lineString, linebreaks.length);
					break;
				}
			}
		}
	}

	//if more than 4 or more lines (3 or more linebreaks, use smaller font size and line height
	//CRUCIAL- need to recaculate # of line breaks, have dummy text and text_page2 reset to match properites of text_page, recreate definitions and definitionMask
	if(linebreaks.length > 2){
		text_page.font = "24px Nunito";
		text_page.lineHeight = 30;

		dummyText = text_page.clone();
		dummyText.text = "";

		//RE-CALCULATING # of line breaks with smaller font size
		linebreaks = [];
		//definitions = []; //hold all definition Containers
		lineString = "";

		//resetting already created definitions from default text rendering.
		definitionMask.graphics.clear();
		definitionBoxes = [];

		for (var i=0; i < phrases[sndID][0].length; i++) {
			lineString += phrases[sndID][0][i];

			dummyText.text = lineString;

			if (dummyText.getMeasuredWidth() > (text_page.lineWidth + 0) ) //OLD: +10 is some extra pixels threshold to allow before considering linebreak
			{
				//Need to store this for use in narration_newWord (so it knows when to move narrationMask to down a line & back to left start)
				linebreaks.push(i);
				lineString = phrases[sndID][0][i];
			}

			//def test, again:
			if(defWords2.length>0){
				for (var h=0;h<defWords2.length;h++){
					var theDef =  defWords2[h] + ' ';
					if(theDef == phrases[sndID][0][i]){
						var firstlinephrase;
						if(linebreaks.length == 0 ) firstlinephrase = phrases[sndID][0][0];
						else firstlinephrase = phrases[sndID][0][linebreaks.length-1];

						defWords2.remove(h);

						getDefPosition(sndID, theDef, lineString, linebreaks.length);
						break;
					}
				}
			}
		}
	}

	text_page2 = text_page.clone();
	text_page2.color = "#0090ad";

	world_current.addChild(text_page);
	//world_current.addChild(text_page2);

	narrationMask = new createjs.Shape();
	text_page2.mask = narrationMask;
}

function setDefinitionText(){

	defHighlightText = new createjs.Text('', text_page.font, "#e24227");

	//if no defs on the page, do not create/render defHighlightText
	if(definitionBoxes.length ==0) return;

	defHighlightText.text = text_page.text;
	defHighlightText.x = text_page.x;
	defHighlightText.y = text_page.y;
	defHighlightText.textAlign = "left";
	defHighlightText.lineWidth = text_page.lineWidth;
	defHighlightText.lineHeight = text_page.lineHeight;
	defHighlightText.textBaseline = "middle";

	//world_current.addChild(text_page2);
	world_current.addChild(defHighlightText);
	defHighlightText.mask = definitionMask;
}

function getDefPosition(sndID, defWord, linephrase, numBreaks){
	var scratchText = new createjs.Text("", text_page.font, "black");
	linephrase = linephrase.replace(defWord, '');
	//var defPos = phrases[sndID][0].indexOf(defWord);

	var defText = new createjs.Text("", text_page.font, "black");
	//removing last char (space) from defWord
	defWord = defWord.substr(0, defWord.length-1);
	defText.text = defWord;

	scratchText.text = linephrase;

	var maskX = scratchText.getMeasuredWidth() + text_page.x;
	var maskY = text_page.y + text_page.lineHeight*numBreaks  - text_page.lineHeight/2;
	var maskWidth = defText.getMeasuredWidth() ;
	var maskHeight = defText.getMeasuredHeight() ;

	definitionMask.graphics.beginFill("blue").drawRect(maskX, maskY, maskWidth, maskHeight);
	//world_current.addChild(definitionMask);

	//the shape that can be tapped and shown to highlight a def word
	//RoundRect params: drawRoundRect ( x  y  w  h  radius )
	var wordBox = new createjs.Shape();
	//wordBox.graphics.beginFill("#f3b3a9").drawRect(maskX, maskY, maskWidth, maskHeight);
	wordBox.graphics.beginFill("#f3b3a9").drawRoundRect(maskX - 3, maskY -3, maskWidth + 6, maskHeight + 3, 5);
	wordBox.alpha = 0.01;
	world_current.addChild(wordBox);

	wordBox.onMouseOver = function(e){
		document.body.style.cursor='pointer';
	}
	wordBox.onMouseOut = function(e){
		document.body.style.cursor='default';
	}

	//params: triggerObj, text content
	makeDefinition(wordBox, defWord);

}

//DEFINITIONS:
function makeDefinition(triggerObj, defWord){

	var defContainer = new createjs.Container();
	defContainer.visible = false;
	world_current.addChild(defContainer);

	//var defShape = new createjs.Shape();
	//defShape.graphics.setStrokeStyle(2.5).beginStroke("black").beginFill("white").drawRect(defText.x - 10, defText.y - 5, defText.lineWidth + 20, defText.getMeasuredHeight() + 10);
	var defShape = new createjs.Bitmap(images['defRect']);
	defShape.regX = defShape.image.width/2;
	defShape.regY = defShape.image.height/2;
	defShape.x = canvas.width/2;
	defShape.y = canvas.height/2 + 90;
	//add empty onPress function to defShape, so it won't trigger close function of defCloseShape.onPress
	defShape.onPress = function(e){};

	var defcloseX = new createjs.Bitmap(images['closeX']);
	defcloseX.regX = defcloseX.image.width/2;
	defcloseX.regY = defcloseX.image.height/2;
	defcloseX.x = defShape.x + defShape.regX - 8;
	defcloseX.y = defShape.y - defShape.regY + 10;

	var defcloseXOver = new createjs.Bitmap(images['closeXOver']);
	defcloseXOver.regX = defcloseXOver.image.width/2;
	defcloseXOver.regY = defcloseXOver.image.height/2;
	defcloseXOver.x = defcloseX.x;
	defcloseXOver.y = defcloseX.y;
	defcloseXOver.visible = false;

	defcloseX.onMouseOver = function(e){
		defcloseXOver.visible = true;
		document.body.style.cursor='pointer';
	}
	defcloseXOver.onMouseOut = function(e){
		defcloseXOver.visible = false;
		document.body.style.cursor='default';
	}

	//defaults: font size of 27px, line height of 33
	// if defWord is > 70 chars... 24 px, line height 28
	var defText;
	if (definitionText[defWord].length <= 70){
		defText = new createjs.Text(definitionText[defWord], "27px Nunito", "black");
		defText.lineHeight = 33;
	}
	else{
		defText = new createjs.Text(definitionText[defWord], "24px Nunito", "black");
		defText.lineHeight = 28;
	}

	defText.lineWidth = 540;
	defText.textBaseline = "middle";
	defText.x = defShape.x - defShape.regX + 15;
	defText.y = defShape.y - defShape.regY + 40;

	defContainer.addChild(defShape);
	defContainer.addChild(defcloseX);
	defContainer.addChild(defcloseXOver);
	defContainer.addChild(defText);

	definitionBoxes.push(defContainer);

	triggerObj.def = defContainer;
	triggerObj.defWord = defWord; //used to know what the original definition word is when the triggerObj is tapped
	defContainer.trigger = triggerObj;

	triggerObj.onPress = showDefinition;
    triggerObj.on("click", showDefinition);
	defContainer.onPress = hideDefinition;
	defcloseX.onPress = hideDefinition;
    defcloseX.on("click", hideDefinition);
	defcloseXOver.onPress = hideDefinition;
    defcloseXOver.on("click", showDefinition);
}

function showDefinition(e){
	if(!allowDefinitions) return;
	if(!_active) return;

	//add close shape here:
	world_current.removeChild(defCloseShape);
	defCloseShape = new createjs.Shape();
	defCloseShape.graphics.beginFill("white").drawRect(0, 0, canvas.width, 470);
	defCloseShape.alpha = 0.01;

	defCloseShape.onPress = hideDefinition;
    defCloseShape.on("click", hideDefinition);
	world_current.addChild(defCloseShape);

	// bump the target's defContainer in front of its siblings:
	world_current.addChild(e.target.def);
	var defWord = e.target.defWord;

	for (var i=0; i<definitionBoxes.length;i++){
		if(definitionBoxes[i] == e.target.def){
			e.target.def.visible = !e.target.def.visible;

			if(e.target.def.visible)
			{
				e.target.alpha = 1;
				stopSound();
				defActive = true;
				playSound('def_' + defWord, off_defActive);
			}
			else{
				e.target.alpha = 0.6;
				stopSound();
			}
		} else{
			definitionBoxes[i].visible = false;
			var triggerObj = definitionBoxes[i].trigger;
			triggerObj.alpha = 0.6;
		}
	}
}

function off_defActive(){
	defActive = false;
}

function hideDefinition(e){
	stopSound();

	world_current.removeChild(defCloseShape);
	defCloseShape = null;

	for (var i=0; i<definitionBoxes.length;i++){
		definitionBoxes[i].visible = false;
		var triggerObj = definitionBoxes[i].trigger;
		triggerObj.alpha = 0.6;
	}
}

function enableDefinitions(){
	allowDefinitions = true;
	defHighlightText.visible = true;

	if(snd_active) btnNarration.visible = true;

	for (var i=0; i<definitionBoxes.length;i++){
		//definitionBoxes[i].visible = true;
		var triggerObj = definitionBoxes[i].trigger;
		triggerObj.alpha = 0.6;
	}
}

function disableDefinitions(){
	allowDefinitions = false;
	defHighlightText.visible = false;
	btnNarration.visible = false;
	btnNarrationOver.visible = false;

	for (var i=0; i<definitionBoxes.length;i++){
		definitionBoxes[i].visible = false;
		var triggerObj = definitionBoxes[i].trigger;
		triggerObj.alpha = 0.01;
	}
}

//moves the narrationMask to beggining of text_page
function narration_begins(phrase){
	narrActive = true;

	//first word:
	narrationMask.graphics.clear();

	narrationMask.x = text_page.x;
	narrationMask.y = text_page.y - text_page.lineHeight/2;
}

//resizes and moves narrationMask whenever a new word's audio is being played
function narration_newWord(phraseID, wordID){

	var currentPhrase = phrases[phraseID][0];
	var currentWord = currentPhrase[wordID];

	dummyText.text = currentWord; //crucial - takes the word and renders it in text_page's font and sizing

	//fix for word-highlighting: if l\n line break is added to a word, do not increase narrationMask height to include it
	var textHeight = dummyText.getMeasuredHeight();
	if(textHeight > 50) textHeight = textHeight/2;

	//make word-by-word text topmost (over definition words)
	world_current.addChild(text_page2);

	narrationMask.graphics.clear();
	narrationMask.graphics.beginFill("white").drawRect(0,0, dummyText.getMeasuredWidth(), textHeight + 1);

	//first check for linebreak, if yes.. move narrationMask to left start and down one text line
	for(var i = 0; i < linebreaks.length; i++) {
		if (wordID == linebreaks[i])
		{
			narrationMask.x = text_page.x;
			narrationMask.y += text_page.lineHeight;

			return;
		}
	}
	//if no linebreak, move narrationMask if currentWord is second or later word.
	if(wordID > 0) {
		var prevWord = currentPhrase[wordID-1];
		dummyText.text = prevWord;
		narrationMask.x += dummyText.getMeasuredWidth();
	}

	//FIX for any case where a _ was added to phrase, to later replace with a space char. highlight needs to move left a few px
	if(dummyText.text.indexOf('_') != -1){
		narrationMask.x -= 15;
	}

}

function narration_done(){
	narrActive = false;

	if(snd_active) enableDefinitions();

	//if snd_active is FALSE (sound toggle btn is OFF, only do narrDone if it's the FIRST time narration_done is called)
	if(!snd_active){
		narrationMask.x = -300;

		if (snd_activeCnt==0){
            snd_activeCnt++;
			enableDefinitions();
			narrDone();
		}
		return;
	}

	//if snd_active is TRUE (sound toggle btn is ON, always do narrDone when narration has finished)
	narrationMask.graphics.clear();
	snd_activeCnt++;
	narrationMask.x = -300;

	narrDone();
}

//GENERAL FUNCTIONS:
//adds standard 'sticker'-style dropshadow to passed DisplayObject
//params: Shadow ( color  offsetX  offsetY  blur )
function addShadow(obj){
	obj.shadow = new createjs.Shadow("#4F4F4F", 4, 4, 0);
}

function removeShadow(obj){
	obj.shadow = null;
}

function enableGlow(obj) {
    if (! _glowFilter) {
        var color = 0x00FFFF;
        var alpha = 1;
        var blurX = 32;
        var blurY = 32;
        var strength = 1;
        var quality = 1;
        var inner = false;
        var knockout = false;
        _glowFilter = new createjs.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
    }
    obj.filters = [_glowFilter];
}

function disableGlow(obj) {  
    obj.filters = [];
}

//do fade-in of given object over ms seconds, call callback function after if provided.
function fade_in(target, ms, callback)
{
	if(callback){
		createjs.Tween.get(target, {loop:false})
	     .to({alpha:1}, ms, createjs.Ease.linear)
	     .call(callback);
	} else
    {
		createjs.Tween.get(target, {loop:false})
	     .to({alpha:1}, ms, createjs.Ease.linear);
    }
}

//do fade-in of given object over ms seconds, call callback function after if provided.
function fade_in_center(target, ms, callback) {

    if (!target.visible) target.visible = true;
    var g = new createjs.Graphics();
    g.beginFill(createjs.Graphics.getRGB(0,0,0,1));
    g.drawCircle(0, 0, 10);
    g.endFill();
    var circle = new createjs.Shape(g);
    circle.regX = circle.width / 2;
    circle.regY = circle.height / 2;
	
	if(target.addChild) {     
        target.addChild(circle);
        target.mask = circle;
        circle.x = target.x + 110;
	    circle.y = target.y + 80;
    } 
	
	target.alpha = 1;

	if(callback){
		createjs.Tween.get(circle, {loop:false})
	     .to({scaleX:20,scaleY:20}, ms, createjs.Ease.linear)
	     .call(callback);
	}else{
		createjs.Tween.get(circle, {loop:false})
	     .to({scaleX:20,scaleY:20}, ms, createjs.Ease.linear);
    }
}

//pulses passed DisplayObject. defaults to pointer onMouseOver unless 'true' passed for nopointer
function doPulse(obj, nopointer){

	if(!nopointer){
		obj.onMouseOver = function(e){
			document.body.style.cursor='pointer';
		}

		obj.onMouseOut = function(e){
			document.body.style.cursor='default';
		}
	}

	var currentScaleX = obj.scaleX;
	var currentScaleY = obj.scaleY;

	createjs.Tween.get(obj, {loop:false})
     .to({scaleX: currentScaleX*1.05, scaleY: currentScaleY*1.05 }, 250, createjs.Ease.linear)
     .call(function(){
     	createjs.Tween.get(obj, {loop:false})
			.to({scaleX: currentScaleX, scaleY: currentScaleY }, 250, createjs.Ease.linear);
     });
}
