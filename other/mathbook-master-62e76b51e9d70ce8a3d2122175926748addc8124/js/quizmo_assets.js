var pagenames = false; //CRUCIAL - pagenames must be FALSE for quizzes (it's an array for storybooks)

//box2d physics vars(can be modified in js per level):
var doPhysics  = true; //set false whenver you want physics ticker to not execute (such as false at page creation, true on narration done)
var frameRate, gravitationalConstant, gravityX, gravityY, pixelsPerMeter, forceMultiplier;
pixelsPerMeter = 30;
gravityX = 0;
gravityY = 0;
frameRate = FPS;
gravitationalConstant = 1.5;
forceMultiplier = 5;
var allowWin = false;
var machineOffsetX = 0;

//for quiz: currentMech will equal the randomly pulled mechanic name in quizMechs[]
var currentMech;
//quizMechs is array. each question mech (.js file) should have its name listed in quizMechs[]
//var quizMechs = ['quizmoalphabet','quizmolazer2','quizmoburger','quizmopie', 'quizmosplat', 'quizmolazer', 'quizmobiscuit'];
var quizMechs = {"select": ['quizmoselect'], "fill": ['quizmogapfill'], "dragdrop": ['quizmodragdrop'], "dragdrop2": ['quizmodragdrop2'], "link": ['quizmolink'], "link2": ['quizmolink2'], "pick": ['quizmopick'], "memory": ['quizmomemory'], "scene": ['quizmoscene'], "match": ['quizmomatch'], "conveyer": ['quizmoconveyer'], 'rope': ['quizmorope'], 'skywheel': ['quizmoskywheel'], 'scale': ['quizmoscale'],'fishing':['quizmofishing']};

var questionOutcome = {}; //will hold final outcome of each quiz question (right/wrong)
var quiz_finalchoice = {}; //will equal word player has chosen for the round (to play proper final audio)


//bitmap and spritesheets resources gathered and created here for all quizmos.
//on quizmo's html page: be sure to include this js file BEFORE quiz's main js file

function make_storymanifest(){
	////**console.log("QA mainifest");

	//image assets:
	//for preloader, each storybook's image assets should be defined here
	//id is used within images array to reference images:  images['i_pops']
	story_manifest = [
		
		//overwriting topright of frame with 2-btn sized img
		{src:imgPath+"img/rtlstorybook/frame_topright2.png",id:"rightborder"},

		//quiz_cover img for cover page:
		{src:imgPath+"img/rtlstorybook/background.jpg", id:"quiz_cover"},
		//universal quiz stuff:		
		{src:imgPath+"img/quiz/quiz_wordcloud.png", id:"quiz_wordcloud"},
		{src:imgPath+"img/quiz/quiz_questioncloud.png", id:"quiz_questioncloud"},
		{src:imgPath+"img/quiz/dogs.png", id:"quiz_dogs"},
		{src:imgPath+"img/quiz/arrowIndex.png", id:"arrowIndex"},

		{src:imgPath+"img/quiz/quizmo-bg.jpg", id:"quizmo_bg"},
		{src:imgPath+"img/quiz/text_box.png", id:"quizmo_text_box"},
		{src:imgPath+"img/quiz/machine.png", id:"quizmo_machine"},
		{src:imgPath+"img/quiz/quizmo-end.jpg", id:"quizmo_end"},
		{src:imgPath+"img/quiz/quizmo-redx.png", id:"quizmo_redx"},
		{src:imgPath+"img/quiz/btn_stories_states.png", id:"btn_stories"},

		{src:imgPath+"img/rtlstorybook/jump-up.png", id:"dodo-jump"},
		{src:imgPath+"img/rtlstorybook/body-movements.png", id:"dodo-body"},
		{src:imgPath+"img/rtlstorybook/talk.png", id:"dodo-talk"},

		{src:imgPath+"img/quiz/point.png", id:"quizmo_point"},
		{src:imgPath+"img/quiz/1.png", id:"quizmo_one"},
		{src:imgPath+"img/quiz/2.png", id:"quizmo_two"},
		{src:imgPath+"img/quiz/3.png", id:"quizmo_three"},
		{src:imgPath+"img/quiz/4.png", id:"quizmo_four"},
		{src:imgPath+"img/quiz/5.png", id:"quizmo_five"},
		{src:imgPath+"img/quiz/6.png", id:"quizmo_six"},
		{src:imgPath+"img/quiz/7.png", id:"quizmo_seven"},
		{src:imgPath+"img/quiz/8.png", id:"quizmo_eight"},
		{src:imgPath+"img/quiz/9.png", id:"quizmo_nine"},
		{src:imgPath+"img/quiz/10.png", id:"quizmo_ten"},

		{src:imgPath+"img/mathquiz/train/red-train.png", id:"red-train"},
		{src:imgPath+"img/mathquiz/train/yellow-train.png", id:"yellow-train"},
		{src:imgPath+"img/mathquiz/train/blue-train.png", id:"blue-train"},

		{src:imgPath+"img/mathquiz/football/jersey.png", id:"football-jersey"},

		{src:imgPath+"img/mathquiz/stadium/dodo.png", id:"dodo-sit"},

		{src:imgPath+"img/mathquiz/skywheel/wheel.png", id:"wheel-wheel"},
		{src:imgPath+"img/mathquiz/skywheel/one.png", id:"wheel-one"},
		{src:imgPath+"img/mathquiz/skywheel/two.png", id:"wheel-two"},
		{src:imgPath+"img/mathquiz/skywheel/three.png", id:"wheel-three"},
		{src:imgPath+"img/mathquiz/skywheel/four.png", id:"wheel-four"},
		{src:imgPath+"img/mathquiz/skywheel/five.png", id:"wheel-five"},
		{src:imgPath+"img/mathquiz/skywheel/six.png", id:"wheel-six"},
		{src:imgPath+"img/mathquiz/skywheel/seven.png", id:"wheel-seven"},
		{src:imgPath+"img/mathquiz/skywheel/eight.png", id:"wheel-eight"},
		{src:imgPath+"img/mathquiz/skywheel/nine.png", id:"wheel-nine"},
		{src:imgPath+"img/mathquiz/skywheel/ten.png", id:"wheel-ten"},

		{src:imgPath+"img/mathquiz/block/holdhands-jump.png", id:"block-holdhands"},
		{src:imgPath+"img/mathquiz/block/2-animation.png", id:"block-2"},
		{src:imgPath+"img/mathquiz/block/3-animation.png", id:"block-3"},
		{src:imgPath+"img/mathquiz/block/3middle.png", id:"block-3-middle"},
		{src:imgPath+"img/mathquiz/block/4-animation.png", id:"block-4"},
		{src:imgPath+"img/mathquiz/block/4middle.png", id:"block-4-middle"},
		{src:imgPath+"img/mathquiz/block/5-animation.png", id:"block-5"},
		{src:imgPath+"img/mathquiz/block/5middle.png", id:"block-5-middle"},
		{src:imgPath+"img/mathquiz/block/6-animation.png", id:"block-6"},
		{src:imgPath+"img/mathquiz/block/7-animation.png", id:"block-7"},
		{src:imgPath+"img/mathquiz/block/7middle.png", id:"block-7-middle"},
		{src:imgPath+"img/mathquiz/block/8-animation.png", id:"block-8"},
		{src:imgPath+"img/mathquiz/block/8middle.png", id:"block-8-middle"},
		{src:imgPath+"img/mathquiz/block/9-animation.png", id:"block-9"},

		{src:imgPath+"img/mathquiz/animal/cat.png", id:"animal-cat"},
		{src:imgPath+"img/mathquiz/animal/dog.png", id:"animal-dog"},
		{src:imgPath+"img/mathquiz/animal/monkey.png", id:"animal-monkey"},
		{src:imgPath+"img/mathquiz/animal/rabbit.png", id:"animal-rabbit"},

		{src:imgPath+"img/quiz/scale/scale.png", id:"quizmo_scale"},
		{src:imgPath+"img/quiz/scale/scale_base.png", id:"quizmo_scale_base"},
		{src:imgPath+"img/quiz/scale/tray.png", id:"quizmo_scale_tray"},

		{src:imgPath+"img/mathquiz/card/cards-3.png", id:"card-3"},
		{src:imgPath+"img/mathquiz/card/cards-5.png", id:"card-5"},
		{src:imgPath+"img/mathquiz/card/cards-6.png", id:"card-6"},
		{src:imgPath+"img/mathquiz/card/cards-7.png", id:"card-7"},
		{src:imgPath+"img/mathquiz/card/cards-8.png", id:"card-8"},
		{src:imgPath+"img/mathquiz/card/cards-10.png", id:"card-10"},

		{src:imgPath+"img/mathquiz/stadium/soccer.png", id:"stadium-soccer"},

		{src:imgPath+"img/mathquiz/scale/ground.png", id:"scale-ground"},

		//鱼
        {src:imgPath+"img/quiz/fishing/fish.png",id:"fishing-1"},
        {src:imgPath+"img/quiz/fishing/fish2.png",id:"fishing-2"},
        {src:imgPath+"img/quiz/fishing/fish3.png",id:"fishing-3"},
        {src:imgPath+"img/quiz/fishing/fish4.png",id:"fishing-4"},
        {src:imgPath+"img/quiz/fishing/fish5.png",id:"fishing-5"},
        {src:imgPath+"img/quiz/fishing/fish6.png",id:"fishing-6"},
        {src:imgPath+"img/quiz/fishing/fish7.png",id:"fishing-7"},
        {src:imgPath+"img/quiz/fishing/fish8.png",id:"fishing-8"},
        {src:imgPath+"img/quiz/fishing/boat.png",id:"boat"},
        {src:imgPath+"img/quiz/fishing/sea.png",id:"sea"}


	];

}

//each storybook should have its spritesheets created in this function
function story_spritesheets(){

	spritesheets['quizmo_select'] = new createjs.SpriteSheet({
        "images": [ "img/rtlstorybook/machine.png" ],
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
            "run": { "frames": [4, 2, 1, 7, 6, 3, 0, 5], 
                     next: false, speed: 0.3 
            },
        },
	});

	spritesheets['select_wrong'] = new createjs.SpriteSheet({
        "images": [ "img/rtlstorybook/select_wrong.png"],
        "frames": [
            [1, 1, 568, 987, 0, -264, 0],
            [1, 990, 499, 987, 0, -297, 0],
            [502, 990, 486, 987, 0, -276, 0],
            [571, 1, 486, 987, 0, -280, 0],
            [990, 990, 486, 987, 0, -276, 0],
            [1059, 1, 476, 987, 0, -286, 0],
            [1478, 990, 474, 987, 0, -270, 0],
            [1537, 1, 474, 987, 0, -250, 0],
            [1954, 990, 474, 987, 0, -270, 0],
            [2430, 1, 501, 662, 0, -297, -88],
            [2013, 1, 349, 501, 0, -365, -265],
            [2364, 1, 3, 3, 0, 0, 0],
            [2364, 1, 3, 3, 0, 0, 0],
            [2364, 1, 3, 3, 0, 0, 0],
            [2364, 1, 3, 3, 0, 0, 0],
            [2364, 1, 3, 3, 0, 0, 0],
            [2364, 1, 3, 3, 0, 0, 0],
            [2364, 1, 3, 3, 0, 0, 0],
            [2430, 665, 501, 656, 0, -297, -88],
            [2430, 1323, 501, 595, 0, -297, -102],
            [2013, 504, 87, 124, 0, -483, -749]
        ],
        "animations": {
            "run": { 
                "frames": [11, 12, 13, 14, 15, 16, 20, 10, 18, 19, 9, 1, 5, 2, 6, 3, 0, 4, 7, 8, 17],
                next: false, speed: .1 
            }
        },
	});

	spritesheets['select_right'] = new createjs.SpriteSheet({
        "images": [ "img/rtlstorybook/select_right.png"],
        "frames": [
            [1, 1, 597, 641, 0, -52, -53],
            [1, 644, 558, 639, 0, -28, -49],
            [600, 1, 496, 620, 0, -23, -51],
            [1, 1285, 535, 580, 0, -98, -78],
            [1098, 1, 467, 638, 0, -140, -47],
            [1567, 1, 450, 643, 0, -241, -26],
            [2019, 1, 449, 644, 0, -226, -18],
            [2470, 1, 449, 647, 0, -230, -24],
            [2921, 1, 449, 647, 0, -236, -26],
            [3372, 1, 290, 407, 0, -298, -2],
            [561, 644, 447, 645, 0, -234, -34],
            [1010, 641, 448, 648, 0, -227, -29],
            [538, 1291, 449, 642, 0, -220, -24],
            [989, 1291, 449, 646, 0, -237, -28],
            [1460, 646, 449, 643, 0, -243, -24],
            [1440, 1291, 449, 646, 0, -220, -33],
            [1911, 647, 448, 644, 0, -220, -29],
            [1891, 1293, 448, 642, 0, -223, -13],
            [2361, 650, 448, 641, 0, -220, -18],
            [2811, 650, 447, 648, 0, -234, -29],
            [2341, 1293, 445, 645, 0, -235, -29],
            [2788, 1300, 442, 585, 0, -214, -88],
            [3260, 650, 367, 499, 0, -256, -34],
            [3232, 1300, 439, 564, 0, -211, -100],
            [3372, 410, 186, 209, 0, -350, -393],
            [1460, 641, 3, 3, 0, 0, 0],
            [1460, 641, 3, 3, 0, 0, 0],
            [1460, 641, 3, 3, 0, 0, 0],
            [1460, 641, 3, 3, 0, 0, 0],
            [1460, 641, 3, 3, 0, 0, 0],
            [1460, 641, 3, 3, 0, 0, 0],
            [1460, 641, 3, 3, 0, 0, 0]
        ],
        "animations": {
            "run": { 
                frames: [25, 26, 27, 28, 29, 30, 24, 9, 22, 21, 23, 3, 0, 1, 2, 4, 10, 20, 16, 12, 18, 17, 6, 7, 19, 13, 5, 14, 8, 11, 15, 31], 
                next: false, speed: .2 
            }
        },
	});

	spritesheets["select_right2"]  = new createjs.SpriteSheet({
        "images": [ "img/rtlstorybook/select_right2.png"],
        "frames": [
            [1, 1, 987, 125, 0, -54, -769],
            [990, 1, 983, 149, 0, -61, -665],
            [1, 128, 971, 194, 0, -70, -547],
            [974, 128, 3, 3, 0, 0, 0],
            [974, 128, 3, 3, 0, 0, 0],
            [974, 128, 3, 3, 0, 0, 0],
            [974, 128, 3, 3, 0, 0, 0],
            [974, 152, 942, 227, 0, -83, -440],
            [1, 324, 882, 272, 0, -106, -318],
            [885, 381, 804, 315, 0, -138, -206],
            [1, 598, 773, 346, 0, -170, -144],
            [1691, 381, 213, 68, 0, -530, -643],
            [1691, 451, 210, 200, 0, -507, -407],
            [1691, 653, 182, 137, 0, -536, -582],
            [776, 698, 767, 308, 0, -149, -193],
            [1, 946, 724, 404, 0, -210, -85],
            [1545, 792, 380, 315, 0, -398, -227],
            [727, 1008, 641, 409, 0, -245, -78]
        ],
        "animations": {
            "run": { 
                "frames": [3, 4, 5, 11, 13, 12, 16, 17, 15, 10, 14, 9, 8, 7, 2, 1, 0, 6],
                next: false, speed: 0.3 
            }
        },
     });

	spritesheets["moreStoriesButton"]  = new createjs.SpriteSheet({
        images: [images['btn_stories']],
        frames: {width:265, height:118},
        animations: {
            off:[0],
            on:[1]
        }
    });

	spritesheets["dodo-jump"]  = new createjs.SpriteSheet({
        "images": [
            images['dodo-jump'] 
        ],

        "frames": [
            [1, 1, 436, 523, 0, -32, -391],
            [439, 1, 427, 529, 0, -47, -307],
            [1, 526, 436, 509, 0, -32, -346],
            [439, 532, 410, 540, 0, -66, -457],
            [1, 1037, 427, 433, 0, -47, -767],
            [430, 1074, 158, 54, 0, -158, -1146]
        ],
        
        "animations": {
            "jump-up": { 
                "frames": [5, 4, 0, 2, 1, 3],
                next: false, speed: 0.3 
            }
        }
    });

	spritesheets["dodo-talk"]  = new createjs.SpriteSheet({
        "images": [
            images['dodo-talk'] 
        ],
        "frames": [
            [1, 1, 410, 405, 0, -64, -51],
            [1, 1, 410, 405, 0, -64, -51],
            [1, 1, 410, 405, 0, -64, -51],
            [1, 1, 410, 405, 0, -64, -51],
            [1, 1, 410, 405, 0, -64, -51],
            [1, 1, 410, 405, 0, -64, -51],
            [1, 1, 410, 405, 0, -64, -51],
            [1, 408, 430, 372, 0, -39, -60],
            [413, 1, 410, 405, 0, -64, -51],
            [433, 408, 431, 370, 0, -39, -60],
            [825, 1, 414, 400, 0, -64, -51],
            [866, 403, 422, 382, 0, -64, -51],
            [1241, 1, 414, 400, 0, -64, -51],
            [1290, 403, 427, 380, 0, -39, -60],
            [1657, 1, 415, 398, 0, -64, -51],
            [1719, 401, 423, 386, 0, -51, -55],
            [2074, 1, 415, 398, 0, -64, -51],
            [2144, 401, 431, 370, 0, -39, -60],
            [2491, 1, 415, 398, 0, -64, -51],
            [2577, 401, 432, 364, 0, -39, -60],
            [2908, 1, 415, 398, 0, -64, -51],
            [3011, 401, 433, 361, 0, -39, -60],
            [3325, 1, 417, 394, 0, -64, -51],
            [3446, 397, 419, 389, 0, -64, -51],
            [3744, 1, 417, 394, 0, -64, -51],
            [3867, 397, 419, 389, 0, -64, -51],
            [4163, 1, 417, 394, 0, -64, -51]
        ],
        "animations": {
            "aquint-talk": { "frames": [0, 15, 19, 7, 13, 9, 21, 17, 1], speed: 0.3 },
            "just-talk": { "frames": [2, 14, 23, 16, 3, 18, 25, 20, 4], speed: 0.3 },
            "wink-talk": { "frames": [5, 10, 22, 12, 8, 24, 11, 26, 6], speed: 0.3 }
        }
    });

	spritesheets["dodo-body"]  = new createjs.SpriteSheet({
        "images": [
            images['dodo-body'] 
        ],
        "frames": [
            [1, 1, 270, 202, 0, -8, -67],
            [273, 1, 269, 202, 0, -13, -67],
            [544, 1, 262, 202, 0, -19, -67],
            [1, 205, 235, 225, 0, -26, -44],
            [238, 205, 261, 202, 0, -26, -67],
            [501, 205, 259, 202, 0, -21, -67],
            [762, 205, 231, 202, 0, -26, -67],
            [238, 409, 257, 203, 0, -26, -66],
            [1, 432, 235, 202, 0, -26, -67],
            [497, 409, 258, 202, 0, -26, -67],
            [757, 409, 237, 202, 0, -26, -67],
            [497, 613, 257, 202, 0, -23, -67],
            [756, 613, 239, 202, 0, -18, -67],
            [238, 614, 257, 202, 0, -26, -67],
            [238, 614, 257, 202, 0, -26, -67],
            [238, 614, 257, 202, 0, -26, -67],
            [238, 614, 257, 202, 0, -26, -67],
            [238, 614, 257, 202, 0, -26, -67],
            [1, 636, 231, 202, 0, -26, -67],
            [497, 817, 253, 204, 0, -21, -65],
            [752, 817, 243, 203, 0, -31, -66],
            [752, 1022, 242, 202, 0, -26, -67],
            [234, 818, 255, 202, 0, -13, -67],
            [1, 840, 231, 202, 0, -26, -67],
            [234, 1022, 248, 202, 0, -26, -67],
            [1, 1044, 228, 202, 0, -26, -67],
            [484, 1023, 246, 202, 0, -26, -67],
            [231, 1226, 245, 202, 0, -35, -67],
            [1, 1248, 228, 202, 0, -26, -67],
            [1, 1248, 228, 202, 0, -26, -67],
            [1, 1248, 228, 202, 0, -26, -67],
            [1, 1248, 228, 202, 0, -26, -67],
            [1, 1248, 228, 202, 0, -26, -67],
            [1, 1248, 228, 202, 0, -26, -67],
            [732, 1226, 245, 202, 0, -26, -67],
            [478, 1227, 244, 202, 0, -34, -67],
            [231, 1430, 244, 202, 0, -26, -67],
            [1, 1452, 226, 202, 0, -26, -67],
            [724, 1430, 244, 202, 0, -18, -67],
            [477, 1431, 242, 202, 0, -26, -67],
            [229, 1634, 241, 202, 0, -26, -67],
            [1, 1656, 224, 202, 0, -33, -67],
            [721, 1634, 241, 202, 0, -26, -67],
            [472, 1635, 241, 202, 0, -26, -67]
        ],
        "animations": {
            "body-movements2": { "frames": [28, 21, 2, 1, 11, 35, 19, 0, 5, 27, 20, 10, 29], speed: 0.3 },
            "body-movements1": { "frames": [40, 8, 25, 42, 24, 43, 3, 6, 37], speed: 0.3 },
            "body-movements4": { "frames": [32, 38, 22, 12, 18, 41, 23, 39, 4, 26, 33], speed: 0.3 },
            "body-movements3": { "frames": [30, 34, 13, 14, 15, 16, 17, 9, 7, 36, 31], speed: 0.3 }
        }
    });

	spritesheets["quizmo_point"]  = new createjs.SpriteSheet({
        "images": [
            images['quizmo_point'] 
        ],
        "frames": [
            [1, 1, 38, 42, 0, -1, 0],
            [41, 1, 38, 42, 0, -1, 0]
        ],
        "animations": {
            "play": { "frames": [0, 1], next: -1 }
        }
    });

	spritesheets["dodo-sit"]  = new createjs.SpriteSheet({
        "images": [
            images['dodo-sit'] 
        ],
        "frames": [
            [1, 1, 660, 523, 0, -34, -117],
            [1, 526, 623, 523, 0, -53, -117],
            [1, 1051, 422, 540, 0, -154, -66],
            [425, 1051, 410, 540, 0, -154, -66],
            [663, 1, 574, 520, 0, -77, -120],
            [1239, 1, 511, 515, 0, -109, -125],
            [1752, 1, 431, 518, 0, -122, -122],
            [626, 526, 410, 523, 0, -154, -117],
            [837, 1051, 417, 536, 0, -154, -91],
            [1038, 523, 410, 523, 0, -154, -117],
            [1450, 521, 495, 507, 0, -95, -133],
            [1256, 1048, 441, 507, 0, -95, -133],
            [1699, 1030, 468, 507, 0, -95, -133]
        ],
        "animations": {
            "play": { "frames": [3, 2, 8, 7, 6, 11, 12, 10, 5, 4, 1, 0, 9], speed: 0.3 }
        }
    });

	spritesheets["stadium-soccer"]  = new createjs.SpriteSheet({
        "images": [
            images['stadium-soccer'] 
        ],
        "frames": [
            [1, 1, 123, 180, 0, -98, -80],
            [126, 1, 136, 165, 0, -91, -71],
            [264, 1, 136, 158, 0, -91, -94],
            [1, 183, 121, 172, 0, -99, -188],
            [1, 357, 125, 161, 0, -97, -238],
            [1, 520, 125, 158, 0, -97, -215],
            [1, 680, 130, 149, 0, -94, -223],
            [1, 831, 136, 149, 0, -91, -311],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -339],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [126, 168, 136, 136, 0, -91, -350],
            [264, 161, 136, 144, 0, -91, -225],
            [128, 306, 132, 131, 0, -93, -298],
            [128, 439, 136, 145, 0, -91, -327],
            [262, 307, 136, 124, 0, -91, -317],
            [266, 433, 129, 133, 0, -95, -239],
            [128, 586, 146, 88, 0, -86, -396],
            [276, 568, 155, 83, 0, -81, -400],
            [133, 676, 144, 114, 0, -87, -371],
            [279, 653, 146, 106, 0, -86, -321],
            [139, 792, 136, 115, 0, -91, -370],
            [139, 909, 149, 72, 0, -84, -411],
            [279, 761, 142, 105, 0, -88, -380],
            [290, 868, 136, 99, 0, -91, -385],
            [290, 868, 136, 99, 0, -91, -385]
        ],
        "animations": {
            "play": { "frames": [8, 30, 29, 31, 23, 0, 1, 2, 19, 9, 25, 27, 6, 3, 5, 20, 28, 24, 22, 4, 32, 7, 26, 21, 10, 11, 12, 13, 14, 15, 16, 17, 18] }
        }
    });

	spritesheets["football-jersey"]  = new createjs.SpriteSheet({
        "images": [
            images['football-jersey'] 
        ],
        "frames": [
            [1, 1, 1549, 296, 0, -20, -61],
            [1, 299, 1549, 296, 0, -20, -61],
            [1, 597, 1546, 297, 0, -20, -61],
            [1, 896, 1546, 296, 0, -20, -61],
            [1, 1194, 1546, 296, 0, -20, -61],
            [1, 1492, 1545, 297, 0, -20, -61],
            [1, 1791, 1545, 297, 0, -20, -61],
            [1, 2090, 1545, 297, 0, -20, -61],
            [1, 2389, 1545, 297, 0, -20, -61],
            [1, 2688, 1545, 297, 0, -20, -61],
            [1, 2987, 1545, 297, 0, -20, -61],
            [1, 3286, 1545, 297, 0, -20, -61]
        ],
        "animations": {
            "play": { "frames": [5, 6, 0, 3, 7, 4, 1, 2, 8, 9, 10, 11] }
        }
    });
	spritesheets["red-train"]  = new createjs.SpriteSheet({
        "images": [
            images['red-train'] 
        ],
        
        "frames": [
            [1, 1, 476, 518, 0, -71, -35],
            [1, 521, 476, 517, 0, -73, -36],
            [1, 1040, 476, 514, 0, -73, -39]
        ],
        
        "animations": {
            "run": { "frames": [2, 1, 0] }
        }
    });

	spritesheets["blue-train"]  = new createjs.SpriteSheet({
        "images": [
            images['blue-train'] 
        ],
        
        "frames": [
            [1, 1, 478, 518, 0, -69, -35],
            [1, 521, 478, 517, 0, -71, -36],
            [1, 1040, 478, 514, 0, -71, -39]
        ],
        
        "animations": {
            "run": { "frames": [2, 1, 0] }
        }
    });

	spritesheets["yellow-train"]  = new createjs.SpriteSheet({
        "images": [
            images['yellow-train'] 
        ],
        
        "frames": [
            [1, 1, 476, 518, 0, -71, -35],
            [1, 521, 476, 517, 0, -73, -36],
            [1, 1040, 476, 514, 0, -73, -39]
        ],
        
        "animations": {
            "run": { "frames": [2, 1, 0] }
        }
    });

	spritesheets["block-holdhands"]  = new createjs.SpriteSheet({
        "images": [
            images['block-holdhands'] 
        ],
        "frames": [
            [1, 1, 1468, 405, 0, -13, -80],
            [1, 408, 1438, 372, 0, -28, -114],
            [1471, 1, 1428, 373, 0, -33, -60],
            [1, 782, 1386, 403, 0, -54, -78],
            [1, 1187, 1408, 332, 0, -43, -154],
            [1, 1521, 1432, 330, 0, -31, -156],
            [1471, 376, 1422, 316, 0, -36, -170],
            [1441, 694, 1422, 316, 0, -36, -170],
            [1411, 1012, 1422, 316, 0, -36, -170],
            [1435, 1330, 1422, 316, 0, -36, -170],
            [1435, 1330, 1422, 316, 0, -36, -170],
            [1435, 1648, 1410, 299, 0, -42, -187]
        ],
        "animations": {
            "play": { "frames": [6, 7, 8, 9, 4, 1, 0, 2, 3, 11, 5, 10], speed: 0.3 }
        }
    });

	spritesheets["block-2"]  = new createjs.SpriteSheet({
        "images": [
            images['block-2'] 
        ],
        "frames": [
            [1, 1, 166, 252, 0, -75, -106],
            [169, 1, 156, 249, 0, -80, -29],
            [327, 1, 172, 240, 0, -72, -120],
            [501, 1, 167, 227, 0, -74, -135],
            [670, 1, 180, 221, 0, -68, -142],
            [852, 1, 176, 219, 0, -70, -91],
            [1030, 1, 178, 205, 0, -69, -161],
            [1210, 1, 195, 190, 0, -61, -178]
        ],
        "animations": {
            "play": { "frames": [2, 0, 4, 7, 5, 1, 3, 6] }
        }
    });

	spritesheets["block-3"]  = new createjs.SpriteSheet({
        "images": [
            images['block-3'] 
        ],
        "frames": [
            [1, 1, 173, 256, 0, -58, -114],
            [1, 259, 205, 194, 0, -40, -186],
            [176, 1, 180, 244, 0, -54, -128],
            [208, 247, 184, 223, 0, -52, -99],
            [358, 1, 189, 225, 0, -49, -150],
            [394, 228, 175, 231, 0, -57, -143],
            [549, 1, 187, 208, 0, -50, -170],
            [571, 211, 163, 254, 0, -64, -37]
        ],
        "animations": {
            "play": { "frames": [2, 0, 4, 1, 3, 7, 5, 6] }
        }
    });

	spritesheets["block-3-middle"]  = new createjs.SpriteSheet({
        "images": [
            images['block-3-middle'] 
        ],
        "frames": [
            [1, 1, 171, 258, 0, -67, -30],
            [1, 1, 171, 258, 0, -67, -126],
            [1, 261, 176, 247, 0, -64, -48],
            [174, 1, 180, 244, 0, -62, -142],
            [174, 1, 180, 244, 0, -62, -142],
            [1, 510, 193, 205, 0, -55, -186],
            [179, 247, 180, 236, 0, -62, -81],
            [196, 485, 186, 225, 0, -59, -164]
        ],
        "animations": {
            "play": { "frames": [3, 7, 6, 2, 0, 4, 5, 1] }
        }
    });

	spritesheets["block-4"]  = new createjs.SpriteSheet({
        "images": [
            images['block-4'] 
        ],
        "frames": [
            [1, 1, 173, 256, 0, -69, -122],
            [1, 259, 205, 194, 0, -55, -196],
            [176, 1, 180, 244, 0, -66, -136],
            [208, 247, 184, 224, 0, -64, -107],
            [358, 1, 189, 225, 0, -62, -159],
            [394, 228, 175, 231, 0, -68, -152],
            [549, 1, 187, 208, 0, -63, -179],
            [571, 211, 163, 253, 0, -73, -45]
        ],
        "animations": {
            "play": { "frames": [2, 0, 4, 1, 3, 7, 5, 6] }
        }
    });

	spritesheets["block-4-middle"]  = new createjs.SpriteSheet({
        "images": [
            images['block-4-middle'] 
        ],
        "frames": [
            [1, 1, 170, 259, 0, -81, -27],
            [1, 1, 170, 259, 0, -81, -123],
            [1, 262, 176, 247, 0, -78, -46],
            [173, 1, 180, 244, 0, -76, -140],
            [173, 1, 180, 244, 0, -76, -140],
            [1, 511, 194, 206, 0, -69, -185],
            [179, 247, 180, 236, 0, -76, -79],
            [197, 485, 186, 224, 0, -73, -163]
        ],
        "animations": {
            "play": { "frames": [3, 7, 6, 2, 0, 4, 5, 1] }
        }
    });

	spritesheets["block-5"]  = new createjs.SpriteSheet({
        "images": [
            images['block-5'] 
        ],
        "frames": [
            [1, 1, 174, 256, 0, -65, -115],
            [1, 259, 204, 194, 0, -50, -191],
            [177, 1, 180, 244, 0, -62, -130],
            [207, 247, 184, 223, 0, -60, -102],
            [359, 1, 189, 225, 0, -57, -153],
            [393, 228, 174, 231, 0, -65, -146],
            [550, 1, 186, 208, 0, -59, -174],
            [569, 211, 163, 254, 0, -71, -38]
        ],
        "animations": {
            "play": { "frames": [2, 0, 4, 1, 3, 7, 5, 6] }
        }
    });

	spritesheets["block-5-middle"]  = new createjs.SpriteSheet({
        "images": [
            images['block-5-middle'] 
        ],
        "frames": [
            [1, 1, 181, 244, 0, -61, -34],
            [1, 1, 181, 244, 0, -61, -130],
            [1, 247, 192, 230, 0, -56, -147],
            [1, 247, 192, 230, 0, -56, -147],
            [184, 1, 192, 223, 0, -56, -86],
            [1, 479, 205, 194, 0, -49, -190],
            [195, 226, 187, 233, 0, -58, -53],
            [208, 461, 198, 213, 0, -53, -168]
        ],
        "animations": {
            "play": { "frames": [2, 7, 4, 6, 0, 3, 5, 1] }
        }
    });

	spritesheets["block-6"]  = new createjs.SpriteSheet({
        "images": [
            images['block-6'] 
        ],
        "frames": [
            [1, 1, 173, 256, 0, -66, -116],
            [1, 259, 204, 193, 0, -48, -189],
            [176, 1, 180, 244, 0, -62, -130],
            [207, 247, 183, 223, 0, -60, -101],
            [358, 1, 188, 225, 0, -57, -152],
            [392, 228, 174, 231, 0, -65, -145],
            [548, 1, 186, 208, 0, -58, -172],
            [568, 211, 162, 253, 0, -72, -39]
        ],
        "animations": {
            "play": { "frames": [2, 0, 4, 1, 3, 7, 5, 6] }
        }
    });

	spritesheets["block-7"]  = new createjs.SpriteSheet({
        "images": [
            images['block-7'] 
        ],
        "frames": [
            [1, 1, 144, 256, 0, -63, -114],
            [1, 259, 169, 194, 0, -47, -187],
            [147, 1, 150, 244, 0, -59, -128],
            [172, 247, 156, 224, 0, -55, -151],
            [299, 1, 152, 224, 0, -58, -99],
            [330, 227, 145, 230, 0, -62, -144],
            [453, 1, 155, 208, 0, -56, -170],
            [477, 211, 135, 253, 0, -69, -37]
        ],
        "animations": {
            "play": { "frames": [2, 0, 3, 1, 4, 7, 5, 6] }
        }
    });

	spritesheets["block-7-middle"]  = new createjs.SpriteSheet({
        "images": [
            images['block-7-middle'] 
        ],
        "frames": [
            [1, 1, 161, 205, 0, -44, -185],
            [164, 1, 141, 258, 0, -57, -30],
            [164, 1, 141, 258, 0, -57, -126],
            [1, 208, 145, 248, 0, -54, -48],
            [148, 261, 155, 225, 0, -48, -163],
            [307, 1, 150, 244, 0, -51, -142],
            [307, 1, 150, 244, 0, -51, -142],
            [307, 247, 150, 236, 0, -51, -81]
        ],
        "animations": {
            "play": { "frames": [5, 4, 7, 3, 1, 6, 0, 2] }
        }
    });

	spritesheets["block-8"]  = new createjs.SpriteSheet({
        "images": [
            images['block-8'] 
        ],
        "frames": [
            [1, 1, 159, 256, 0, -70, -116],
            [1, 259, 187, 193, 0, -57, -189],
            [162, 1, 166, 244, 0, -67, -130],
            [190, 247, 168, 223, 0, -66, -101],
            [330, 1, 173, 225, 0, -64, -152],
            [360, 228, 160, 231, 0, -70, -145],
            [505, 1, 171, 208, 0, -65, -172],
            [522, 211, 149, 253, 0, -75, -39]
        ],
        "animations": {
            "play": { "frames": [2, 0, 4, 1, 3, 7, 5, 6] }
        }
    });

	spritesheets["block-8-middle"]  = new createjs.SpriteSheet({
        "images": [
            images['block-8-middle'] 
        ],
        "frames": [
            [1, 1, 177, 206, 0, -59, -182],
            [180, 1, 156, 259, 0, -70, -28],
            [180, 1, 156, 259, 0, -70, -124],
            [1, 209, 161, 248, 0, -68, -46],
            [164, 262, 171, 225, 0, -62, -161],
            [338, 1, 166, 244, 0, -65, -140],
            [338, 1, 166, 244, 0, -65, -140],
            [338, 247, 166, 236, 0, -65, -79]
        ],
        "animations": {
            "play": { "frames": [5, 4, 7, 3, 1, 6, 0, 2] }
        }
    });

	spritesheets["block-9"]  = new createjs.SpriteSheet({
        "images": [
            images['block-9'] 
        ],
        "frames": [
            [1, 1, 140, 256, 0, -70, -122],
            [143, 1, 146, 244, 0, -67, -136],
            [291, 1, 152, 224, 0, -64, -159],
            [445, 1, 150, 208, 0, -65, -179],
            [1, 259, 165, 193, 0, -58, -196],
            [168, 247, 148, 224, 0, -66, -107],
            [318, 227, 141, 230, 0, -69, -152],
            [461, 211, 131, 253, 0, -74, -45]
        ],
        "animations": {
            "play": { "frames": [1, 0, 2, 4, 5, 7, 6, 3] }
        }
    });

	spritesheets["animal-cat"]  = new createjs.SpriteSheet({
        "images": [
            images['animal-cat'] 
        ],
        "frames": [
            [1, 1, 214, 293, 0, -96, -20],
            [1, 296, 269, 197, 0, -4, -63],
            [217, 1, 255, 288, 0, -93, -22],
            [272, 291, 209, 209, 0, -86, -49],
            [474, 1, 212, 288, 0, -94, -18],
            [483, 291, 190, 197, 0, -85, -62],
            [675, 291, 173, 190, 0, -104, -69],
            [688, 1, 205, 282, 0, -94, -17],
            [895, 1, 200, 275, 0, -93, -17],
            [895, 278, 200, 222, 0, -79, -53],
            [1097, 1, 339, 269, 0, -90, -27],
            [1438, 1, 300, 247, 0, -87, -33],
            [1438, 250, 191, 249, 0, -94, -35],
            [1097, 272, 250, 223, 0, -86, -40]
        ],
        "animations": {
            "play": { "frames": [0, 4, 7, 8, 12, 9, 1, 5, 6, 3, 13, 11, 10, 2], speed: 0.3 }
        }
    });

	spritesheets["animal-dog"]  = new createjs.SpriteSheet({
        "images": [
            images['animal-dog'] 
        ],
        "frames": [
            [1, 1, 141, 194, 0, -32, -3],
            [144, 1, 159, 181, 0, -21, -17],
            [305, 1, 181, 167, 0, -8, -31]
        ],
        
        "animations": {
            "play": { "frames": [0, 1, 2], speed: 0.3 }
        }
    });

	spritesheets["animal-monkey"]  = new createjs.SpriteSheet({
        "images": [
            images['animal-monkey'] 
        ],
        "frames": [
            [1, 1, 215, 271, 0, -32, -36],
            [218, 1, 211, 281, 0, -49, -16],
            [431, 1, 202, 282, 0, -54, -28],
            [635, 1, 189, 288, 0, -64, -30],
            [826, 1, 187, 290, 0, -53, -25],
            [1, 274, 181, 312, 0, -43, -18],
            [184, 285, 288, 302, 0, -12, 0],
            [474, 291, 256, 303, 0, -25, -11],
            [732, 293, 273, 307, 0, -28, -19]
        ],
        "animations": {
            "play": { "frames": [8, 2, 1, 7, 5, 4, 6, 0, 3], speed: 0.3 }
        }
    });

	spritesheets["animal-rabbit"]  = new createjs.SpriteSheet({
        "images": [
            images['animal-rabbit'] 
        ],
        "frames": [
            [1, 1, 210, 300, 0, -66, -60],
            [213, 1, 230, 297, 0, -44, -11],
            [445, 1, 269, 291, 0, -21, -6],
            [716, 1, 235, 288, 0, -37, -36],
            [953, 1, 184, 287, 0, -76, -71],
            [1139, 1, 189, 285, 0, -69, -45],
            [1330, 1, 297, 277, 0, -2, -11],
            [1629, 1, 164, 275, 0, -77, -84]
        ],
        "animations": {
            "play": { "frames": [0, 4, 7, 5, 1, 2, 6, 3], speed: 0.3 }
        },
    });

	spritesheets["card-3"] = new createjs.SpriteSheet({
        "images": [
            images['card-3'] 
        ],
        "frames": [
            [0, 0, 103, 256, 0, -42, -1],
            [103, 0, 109, 252, 0, -55, -3],
            [212, 0, 178, 241, 0, -10, -10],
            [390, 0, 176, 237, 0, -29, -12],
            [566, 0, 19, 237, 0, -92, -11]
        ],
        "animations": {
            "play": { "frames": [3, 1, 4, 0, 2] }
        }
    });

	spritesheets["card-5"] = new createjs.SpriteSheet({
        "images": [
            images['card-5'] 
        ],
        "frames": [
            [0, 0, 106, 253, 0, -43, -3],
            [106, 0, 108, 247, 0, -53, -6],
            [214, 0, 184, 238, 0, -11, -12],
            [398, 0, 182, 235, 0, -22, -13],
            [580, 0, 17, 235, 0, -93, -11]
        ],
        "animations": {
            "play": { "frames": [3, 1, 4, 0, 2] }
        }
    });

	spritesheets["card-6"]  = new createjs.SpriteSheet({
        "images": [
            images['card-6'] 
        ],
        "frames": [
            [0, 0, 103, 251, 0, -43, -3],
            [103, 0, 107, 246, 0, -55, -6],
            [210, 0, 178, 238, 0, -12, -12],
            [388, 0, 176, 233, 0, -27, -13],
            [564, 0, 17, 232, 0, -93, -13]
        ],
        "animations": {
            "play": { "frames": [3, 1, 4, 0, 2] }
        }
    });

	spritesheets["card-7"]  = new createjs.SpriteSheet({
        "images": [
            images['card-7'] 
        ],
        "frames": [
            [1, 1, 101, 243, 0, -45, -6],
            [104, 1, 108, 237, 0, -54, -9],
            [214, 1, 178, 234, 0, -13, -11],
            [394, 1, 176, 232, 0, -26, -12],
            [572, 1, 19, 228, 0, -92, -13]
        ],
        "animations": {
            "play": { "frames": [3, 1, 4, 0, 2] }
        }
    });

	spritesheets["card-8"]  = new createjs.SpriteSheet({
        "images": [
            images['card-8'] 
        ],
        "frames": [
            [1, 1, 102, 244, 0, -45, -4],
            [105, 1, 106, 239, 0, -54, -7],
            [213, 1, 175, 236, 0, -16, -9],
            [390, 1, 173, 234, 0, -26, -10],
            [565, 1, 19, 230, 0, -92, -11]
        ],
        "animations": {
            "play": { "frames": [3, 1, 4, 0, 2] }
        }
    });

	spritesheets["card-10"]  = new createjs.SpriteSheet({
        "images": [
            images['card-10'] 
        ],
        "frames": [
            [0, 0, 102, 252, 0, -47, -3],
            [102, 0, 106, 247, 0, -52, -5],
            [208, 0, 179, 239, 0, -17, -11],
            [387, 0, 177, 237, 0, -21, -12],
            [564, 0, 16, 234, 0, -93, -12]
        ],
        "animations": {
            "play": { "frames": [3, 1, 4, 0, 2] }
        }
    });

	spritesheets["wheel-one"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-one'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-two"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-two'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-three"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-three'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-four"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-four'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-five"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-five'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-six"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-six'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-seven"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-seven'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-eight"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-eight'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-nine"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-nine'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	spritesheets["wheel-ten"]  = new createjs.SpriteSheet({
        "images": [
            images['wheel-ten'] 
        ],
        "frames": [
            [1, 1, 162, 157, 0, -5, -3],
            [165, 1, 154, 150, 0, -9, -6]
        ],
        "animations": {
            "shine": { "frames": [1, 0] }
        }
    });

	//spritesheets["splat_appendage"] = new createjs.SpriteSheet({
	//    "animations": {"all": {"frames": [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19, 19, 0], "frequency":2, "next":false}},

 spritesheets['fishing-1'] = new createjs.SpriteSheet({
        "images": [
           images['fishing-1']
        ],
        "frames": [
            [1, 1, 365, 108, 0, -18, -54],
            [368, 1, 365, 106, 0, -18, -59],
            [735, 1, 364, 106, 0, -17, -63],
            [1101, 1, 360, 106, 0, -18, -62],
            [1463, 1, 358, 106, 0, -18, -60]
        ],
        "animations": {
            "play": { "frames": [4, 3, 2, 1, 0],speed:0.3 }
        }
    });

    spritesheets['fishing-2'] = new createjs.SpriteSheet({
            "images": [
                images['fishing-2']
            ],
            "frames": [
                [1, 1, 258, 184, 0, -28, -10],
                [261, 1, 253, 184, 0, -26, -10],
                [516, 1, 261, 184, 0, -22, -10],
                [1, 187, 258, 185, 0, -24, -9],
                [261, 187, 255, 186, 0, -28, -9],
                [518, 187, 253, 187, 0, -28, -8]
            ],
            "animations": {
                "play": { "frames": [0, 4, 5, 1, 2, 3],speed:0.3 }
            }
        });

    spritesheets['fishing-3'] = new createjs.SpriteSheet({
            "images": [
                images['fishing-3']
            ],
            "frames": [
                [0, 0, 300, 150, 0, 0, -44],
                [0, 150, 299, 148, 0, -1, -45],
                [0, 298, 298, 171, 0, 0, -26],
                [0, 469, 296, 169, 0, -3, -28],
                [0, 638, 294, 171, 0, -3, -26],
                [0, 809, 295, 154, 0, -5, -42]
            ],
            "animations": {
                "play": { "frames": [5, 4, 0, 2, 1, 3],speed:0.3 }
            }
        });

    spritesheets['fishing-4'] = new createjs.SpriteSheet({
            "images": [
                images['fishing-4']
            ],
            "frames": [
                [1, 1, 505, 144, 0, -5, -32],
                [508, 1, 504, 144, 0, -6, -32],
                [1, 147, 503, 142, 0, -6, -35],
                [506, 147, 506, 140, 0, -6, -40],
                [506, 289, 503, 140, 0, -6, -40],
                [1, 291, 501, 140, 0, -7, -40]
            ],
            "animations": {
                "play": { "frames": [2, 5, 0, 4, 1, 3],speed:0.3 }
            }
        });

    spritesheets['fishing-5'] = new createjs.SpriteSheet({
            "images": [
                images['fishing-5']
            ],
            "frames": [
                [1, 1, 220, 167, 0, -22, -25],
                [223, 1, 213, 168, 0, -28, -19],
                [1, 170, 214, 168, 0, -25, -21],
                [217, 171, 216, 171, 0, -20, -21],
                [1, 340, 213, 175, 0, -21, -16],
                [216, 344, 219, 172, 0, -19, -21]
            ],
            "animations": {
                "play": { "frames": [1, 2, 4, 3, 5, 0],speed:0.3 }
            }
        });

    spritesheets['fishing-6'] = new createjs.SpriteSheet({
            "images": [
                images['fishing-6']
            ],
            "frames": [
                [1, 1, 455, 148, 0, -11, -25],
                [1, 151, 454, 148, 0, -11, -25],
                [1, 301, 454, 147, 0, -11, -26],
                [1, 450, 448, 146, 0, -11, -27],
                [1, 598, 448, 146, 0, -11, -27],
                [1, 746, 448, 146, 0, -11, -27]
            ],
            "animations": {
                "play": { "frames": [2, 3, 1, 4, 0, 5],speed:0.3 }
            }
        });

    spritesheets['fishing-7'] = new createjs.SpriteSheet({
        "images": [
            images['fishing-7']
        ],
        "frames": [
            [1, 1, 260, 186, 0, -33, -11],
            [263, 1, 256, 192, 0, -31, -9],
            [521, 1, 258, 192, 0, -30, -9],
            [1, 189, 253, 192, 0, -30, -14],
            [256, 195, 264, 194, 0, -27, -10],
            [522, 195, 262, 194, 0, -26, -10]
        ],
        "animations": {
            "play": {"frames": [0, 1, 2, 3, 4, 5],speed:0.3}
        }
    });

    spritesheets['fishing-8'] = new createjs.SpriteSheet({
            "images": [
                images['fishing-8']
            ],
            "frames": [
                [1, 1, 362, 209, 0, -1, -12],
                [365, 1, 360, 206, 0, -6, -12],
                [365, 209, 361, 204, 0, 0, -13],
                [1, 212, 361, 202, 0, -6, -13],
                [364, 415, 356, 204, 0, -11, -12],
                [1, 416, 354, 203, 0, -1, -8]
            ],
            "animations": {
                "play": { "frames": [4, 3, 5, 2, 0, 1],speed:0.3 }
            }
        });

    spritesheets['boat'] = new createjs.SpriteSheet({
        "images": [
            images['boat']
        ],
        "frames": [
            [1, 1, 602, 168, 0, -17, -8],
            [1, 171, 600, 164, 0, -19, -9],
            [1, 337, 600, 162, 0, -21, -8],
            [1, 501, 599, 164, 0, -21, -9],
            [1, 667, 599, 163, 0, -24, -6]
        ],
        "animations": {
            "boat": { "frames": [1, 2, 4, 3, 0],speed:0.3 }
        }
    });

    spritesheets['sea'] = new createjs.SpriteSheet({
            "images": [
                images['sea']
            ],
            "frames": [
                [1, 1, 1024, 377, 0, 0, 0],
                [1, 380, 1024, 377, 0, 0, 0],
                [1, 759, 1024, 376, 0, 0, -1],
                [1, 1137, 1024, 375, 0, 0, -2]
            ],
            "animations": {
                "sea": { "frames": [0, 2, 1, 3],speed:0.3 }
            }
        })
}
