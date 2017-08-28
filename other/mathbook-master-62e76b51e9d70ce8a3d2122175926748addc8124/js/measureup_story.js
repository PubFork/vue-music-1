//"How Do You Measure Up?" story-specific vars

var pagenames = [
	'0_cover',
    '0_bowl',
    'q1',
    'q4',
    'q5',
    'q2',
	'4_carpenter',
	'1_intro',
    '0_gear',
    'q3',
    '0_seesaw',
	'2_baker',
	'3_butcher',
	'5_carpenter',
	'6_policeofficer',
	'7_coach',
	'8_doctor',
	'9_kitchen',
	'10_end',
	'glossary',
];

//define quiz_url as the page to switch to upon press of arrowGame on final page (glossary)

var quiz_content = [];
quiz_content['q3'] = ["select", "What's another word for how fast you're going?", ['speed', 'height', 'weight'], 'medium'];
quiz_content['q1'] = ["scale", "What's another word for how fast you're going?", [{img: 'img/quiz/scale/weight.png', weight: 2, x: 100, y: 100}, {img: 'img/quiz/scale/weight.png', weight: 5, x: 100, y: 200} ], 'medium'];
quiz_content['q2'] = ["pick", ["img/quiz/pickitems/monalisa.jpg", "img/quiz/pickitems/monalisa.jpg"], [["img/quiz/pickitems/mouse.png", 550, 200, 1],  ["img/quiz/pickitems/nose.png", 550, 50, 1]], 2, 'medium'];
quiz_content['q4'] = ["memory", [["img/quiz/pickitems/monalisa.jpg", 100, 100], ["img/quiz/pickitems/mouse.png", 100, 100]], "wrong", 'medium'];
quiz_content['q5'] = ["scene", {"png": "img/quiz/q5/spritesheet.png", "json": "img/quiz/q5/spritesheet.json"}, [["img/quiz/q5/background.png"], ["img/quiz/q5/ground.png"],["img/quiz/q5/midground.png"],["img/quiz/q5/foreground.png"]], [["img/quiz/q5/monalisa.jpg", 10, 10], ["img/quiz/q5/mouse.png", 400, 10]], 1, 'medium'];

var glossary_definitions = []; //defined per storybook (storybook's js). used to store defintion words themselves, used with definitionText[] in Glossary

//for use with glossary:
glossary_definitions.push(
	['measure', 'txt'],
	['scale', 'txt'],
	['weight', 'txt'],
	['length ', 'txt'],
	['determine', 'txt'],
	['speed', 'txt'],
	['distance', 'txt'],
	['temperature', 'txt'],	
	['apply', 'txt']	
);

//SOUNDS: path+filename of this storybook's multisound file (without extension)
var sndurl = 'sound/measure_text';
quiz_url = "measureup_game.html";
/*
//functions below are called at certain points in the main storybook js (rtlstorybook.js)
1: makeSounds() -- call makeSound() and define defintions in definitionText[]
2: make_storymanifest() -- defines the differnet image files that preload.js will load 
3: story_spritesheets() -- called by main js (rtlstorybook.js)'s make_spritesheet's function to create storybook specific ss
*/

function makeSounds(){	
	//empty:
	makeSound('empty', 8.2,8.3);
	
	//narration:
	makeSound('0_cover',	194.330364,	198.008253);
	makeSound('0_gear',	194.330364,	198.008253);
	makeSound('0_seesaw',	194.330364,	198.008253);
	makeSound('0_lab',	194.330364,	198.008253);
	makeSound('0_bowl',	194.330364,	198.008253);
	makeSound('1_intro', 0.552926, 8.2, ["There ", "are ", "all ", "kinds ", "of ", "reasons ", "why ", "we ", "need ", "to ", "measure. ", "Measuring ", "helps ", "us ", "be ", "sure ", "the ", "things ", "we ", "make ", "come ", "out ", "as ", "planned."], [0.552926, 0.705136, 0.844921, 1.202148, 1.51278, 1.689841, 2.130939, 2.363914, 2.572037, 2.749098, 2.938584, 3.97299, 4.46379, 4.802379, 5.019822, 5.159607, 5.547897, 5.715639, 5.970358, 6.122567, 6.545028, 6.656855, 6.880511, 7.032721]);
	makeSound('2_baker', 9.020769, 14.637006, ["Bakers ", "have ", "to ", "measure ", "the ", "amount ", "of ", "different ", "ingredients, ", "so ", "that ", "their ", "treats ", "taste ", "yummy ", "and ", "delicious."], [9.120172, 9.673097, 9.918497, 9.98373, 10.337851, 10.458998, 10.810013, 10.977754, 11.310131, 12.19854, 12.335218, 12.434621, 12.633426, 13.037248, 13.301286, 13.692683, 13.875956]);
	makeSound('3_butcher', 15.668306, 22.688601, ["Butchers ", "use ", "scales ", "to ", "measure ", "the ", "weight ", "of ", "meat ", "to ", "sell ", "at ", "the ", "supermarket. ", "But ", "measuring ", "isn't ", "just ", "used ", "with ", "food."], [15.7149, 16.215019, 16.442557, 16.981505, 17.178756, 17.501038, 17.65946, 17.842733, 18.010475, 18.345958, 18.423616, 18.662803, 18.790163, 18.908203, 20.234604, 20.352644, 20.877613, 21.119907, 21.470921, 21.91202, 22.24129]);
	makeSound('4_carpenter', 24.440569, 28.8, ["Carpenters ", "use ", "a ", "measuring ", "tape ", "to ", "find ", "out ", "the ", "length  ", "of ", "things."], [24.499589, 25.33519, 25.555739, 25.624079, 26.15526, 26.369597, 26.537338, 26.773419, 27.0095, 27.149284, 27.453704, 27.615233]);
	makeSound('5_carpenter', 29.870425, 37.176503, ["Carpenters ", "use ", "a ", "measuring ", "tape ", "to ", "determine ", "how ", "tall ", "things ", "are, ", "too! ", "They ", "need ", "to ", "make ", "sure ", "everything ", "is ", "just ", "the ", "right ", "size. "], [29.963615, 30.522754, 30.727771, 30.811642, 31.302442, 31.634818, 31.746646, 32.119405, 32.358592, 32.687863, 32.939475, 33.175556, 34.088815, 34.2286, 34.411873, 34.520595, 34.706974, 34.995862, 35.461811, 35.732062, 36.011631, 36.107927, 36.390603]);
	makeSound('6_policeofficer', 39.363356, 46, ["Police ", "officers ", "measure ", "the ", "speed ", "of ", "cars. ", "They ", "need ", "to ", "check ", "that ", "everyone ", "is ", "driving ", "at ", "a ", "safe ", "speed."], [39.409951, 39.804454, 40.285935, 40.636949, 40.742565, 41.127749, 41.283065, 42.426193, 42.60636, 42.774101, 42.892142, 43.18103, 43.289751, 43.687361, 43.855103, 44.240287, 44.355221, 44.432879, 44.787]);
	makeSound('7_coach', 46.980066, 54.5, ["Track ", "coaches ", "use ", "stopwatches ", "to ", "measure ", "the ", "amount ", "of ", "time ", "a ", "racer ", "takes ", "to ", "run ", "the ", "distance ", "from ", "one ", "place ", "to ", "another."], [47.082575, 47.532992, 47.989622, 48.228809, 49.117218, 49.197982, 49.517934, 49.632868, 49.980776, 50.123667, 50.372173, 50.487107, 50.934418, 51.198456, 51.394155, 51.614704, 51.726531, 52.071333, 52.267032, 52.503113, 52.792001, 52.888297]);
	makeSound('8_doctor', 55.516248, 63.0, ["Doctors ", "measure ", "all ", "kinds ", "of ", "things: ", "your ", "height, ", "your ", "weight, ", "and ", "your ", "temperature ", "- all ", "to ", "make ", "sure ", "you're ", "healthy."], [55.516248, 56.041217, 56.485422, 56.824011, 57.237153, 57.389363, 58.184582, 58.343005, 58.749933, 59.051247, 59.374305, 59.768808, 59.933443, 60.837384, 61.14491, 61.275376, 61.446224, 61.7786, 62.048851]);
	makeSound('9_kitchen', 63.940603, 72.8, ["And ", "temperature ", "brings ", "us ", "back ", "to ", "baking! ", "When ", "you ", "bake, ", "you ", "have ", "to ", "set ", "the ", "oven ", "at ", "the ", "right ", "temperature ", "so ", "that ", "your ", "treats ", "will ", "be ", "tasty."], [64.030686, 64.282299, 64.94084, 65.183133, 65.409895, 65.652188, 65.87895, 66.826379, 67.031397, 67.236414, 67.680619, 67.795553, 67.966401, 68.065803, 68.233545, 68.379542, 68.621835, 68.749195, 68.851704, 69.097103, 69.811558, 69.951343, 70.109765, 70.265082, 70.61299, 70.749668, 70.88324]);
	makeSound('10_end',	73.272005, 79.5, ["You ", "can ", "apply ", "measuring ", "to ", "just ", "about ", "anything ", "you ", "do. ", "What ", "kinds ", "of ", "things ", "do ", "you ", "measure ", "?"], [73.299962, 73.532936, 73.64787, 74.042373, 74.753722, 74.918357, 75.10163, 75.399838, 75.965189, 76.170206, 77.182868, 77.335078, 77.617754, 77.779283, 78.052639, 78.192424, 78.487525]);

	//sfx:
	makeSound('milk_pour',	201.103512,	203.854238);
	makeSound('car_horn',	204.954512,	206.043512);
	makeSound('slow_pug',	207.255512,	212.427478);
	makeSound('fast_pug',	213.454512,	216.769451);
	makeSound('toy_bell',	217.498512,	218.543025);
	makeSound('buzzer',	219.096512,	219.566717);
	makeSound('ding',	219.992512,	221.1419);
	//glossary sfx:
	makeSound('wordbones',	198.693931,	199.921681);
	makeSound('boing_bonk',	221.833512,	224.06154);

	//definition audio:
	makeSound('def_measure', 80.50353, 84.833748);
	makeSound('def_measure.', 80.50353, 84.833748);
	makeSound('def_scale',	85.299697, 94.07196);
	makeSound('defONLY_scale',	94.687012, 97.401941);	
	makeSound('def_scales',	85.299697, 94.07196);
	makeSound('defONLY_scales',	94.687012, 97.401941);
	makeSound('def_weight',	97.961079, 101.794285);
	makeSound('def_weight,',	97.961079, 101.794285);
	makeSound('def_length ', 103.080304, 111.082198);
	makeSound('defONLY_length ', 112.175625, 116.275974);
	makeSound('def_determine', 122.538326, 126.41502);
	makeSound('def_speed', 127.458746, 132.404016);
	makeSound('def_distance', 133.845351, 150.470405);
	makeSound('defONLY_distance', 151.290475, 156.136342);
	makeSound('def_temperature', 156.707906, 161.876832);
	makeSound('def_apply',	162.891776,	166.32116);
	makeSound('def_check',	167.309,	171.967027);
	makeSound('def_amount',	172.802027,	176.595633);
	makeSound('def_ingredient',	177.553,	188.218215);
	makeSound('def_ingredients,',	177.553,	188.218215);
	makeSound('def_size',	189.165,	193.342664);
	makeSound('def_size.',	189.165,	193.342664);


	//definitions go into definitionText array (need to put word verbatim from phrase's text array above, including punctuation if necessary)
	definitionText['measure.'] = definitionText['measure'] = "When you measure, you find the size or amount of something.";
	definitionText['scale'] = definitionText['scales'] = "A scale is a tool for weighing.";
	definitionText['weight'] = definitionText['weight,'] = "Weight means how heavy or light something is.";
	definitionText['length '] = "Length means how long something is.";	
	definitionText['determine'] = "Determine means to find out.";
	definitionText['speed'] = "Speed means how fast or slow something is moving.";
	definitionText['distance'] = "Distance means how far apart two things are.";
	definitionText['temperature'] = "Temperature tells you how hot or cold something, or someone, is.";
	definitionText['apply'] = "To apply means to put to use.";
	definitionText['height'] = "The height of something is how tall or short it is.";
	definitionText['check'] = "When you check something, it means you make sure that it's right.";
	definitionText['amount'] = "An amount of something is how much of it there is.";
	definitionText['ingredient'] = "An ingredient is one of the things that goes into a mixture.";
	definitionText['ingredients,'] = definitionText['ingredient'];
	definitionText['size'] = "Size means how big or small something is.";
	definitionText['size.'] = definitionText['size'];

	//quiz sfx:
	makeSound('sfx_biscuits', 116.056104, 117.029715);
	makeSound('sfx_splat', 117.308417, 118.419256);
	makeSound('sfx_pie', 118.502263, 119.312165);
	makeSound('sfx_lazer', 119.481508, 121.524669);
	makeSound('sfx_wrong', 122.087919, 123.427938);


	//question-specific audio:
    console.log("making sounds");
	makeSound('q_q0', 0.495087, 3.701368);
	makeSound('q_q1', 0.495087, 3.701368);
	makeSound('q_q2', 4.856573, 8.793697);
	makeSound('q_q3', 10.161081, 12.730821);
	makeSound('q_q4', 14.239659, 17.516667);
	makeSound('q_q8', 19.685622, 23.599171);
	makeSound('q_q5', 25.579521, 29.139435);
	makeSound('q_q10', 30.719000, 35.174788);
	makeSound('q_q6', 38.027435, 40.078511);
	makeSound('q_q7', 41.469472, 45.170840);
	makeSound('q_q9', 46.278893, 47.787731);

	makeSound('determine it', 49.555901, 50.593227);
	makeSound('apply it', 51.347646, 52.432123);
	makeSound('stopwatch', 53.775932, 54.907561);
	makeSound('construct it', 55.567677, 56.652155);
	makeSound('sweep it', 57.642330, 58.608929);
	makeSound('ruler', 59.764133, 60.494977);
	makeSound('divide it', 61.650181, 62.593205);
	makeSound('comfort it', 63.347624, 64.267072);
	makeSound('measure', 64.832886, 65.360961);
	makeSound('scale', 66.011666, 66.695058);
	makeSound('weight', 67.025416, 67.584555);
	makeSound('length ', 68.109894, 68.675708);
	makeSound('height', 69.194371, 69.939889);
	makeSound('speed', 70.184546, 70.942490);
	makeSound('distance', 71.304387, 72.348112);
	makeSound('temperature', 72.506742, 73.252260);
	makeSound('estimate', 73.544068, 74.115405);
	makeSound('compare', 115.797153,116.481301);
	makeSound('f_q0', 75.630509, 78.512319);
	makeSound('f_q1', 75.630509, 78.512319);
	makeSound('f_q2', 78.872153, 81.887586);
	makeSound('f_q3', 82.408492, 85.906000);
	makeSound('f_q4', 86.227739, 89.547433);
	makeSound('f_q5', 89.988046, 92.651904);
	makeSound('f_q6', 92.946783, 95.153372);
	makeSound('f_q7', 95.386857, 97.760293);
	makeSound('f_q8', 98.027324, 101.659857);
	makeSound('f_q9', 102.082326, 103.851766);
	makeSound('f_q10', 104.145191, 107.206568);
	
	//required for quiz question outocomes:
	makeSound('empty', 4.5,4.6);
	makeSound('quizmo', 107.410411, 108.640050);
	makeSound('correct_1', 109.011801, 110.198546);
	makeSound('correct_2', 110.355825, 111.560707);
	makeSound('incorrect_1', 111.927255, 113.158259);
	makeSound('incorrect_2', 113.887464, 115.196398);	
}


//story_manifest: unique for each storybook:
function make_storymanifest(){
	//**console.log("HI I AM MEASURE UP...");
	//image assets:
	//for preloader, each storybook's image assets should be defined here
	//id is used within images array to reference images:  images['i_pops']
	story_manifest = [
		
		//cover image:
		{src:imgPath+"img/covers/cover.jpg", id:"cover_story"},
		//background image;
		{src:imgPath+"img/bg/bg_red.jpg", id:"bg_story"},

        // for 0_gear
		{src:"img/measureup_story/0_gear/gear.png", id:"gear"},

        // for 0_seesaw
		{src:"img/measureup_story/0_seesaw/watermelon.png", id:"watermelon"},
		{src:"img/measureup_story/0_seesaw/ball.png", id:"ball"},
		{src:"img/measureup_story/0_seesaw/seesaw.png", id:"seesaw"},
		{src:"img/measureup_story/0_seesaw/rock.png", id:"rock"},
		{src:"img/measureup_story/0_seesaw/base.png", id:"base"},

        /*
        // for 0_lab
		{src:"img/measureup_story/0_lab/spritesheet.png", id:"lab_spritesheet"},
		{src:"img/measureup_story/0_lab/spritesheet.json", id:"lab_spritesheet_json"},
		{src:"img/measureup_story/0_lab/ground.png", id:"lab_ground"},
		{src:"img/measureup_story/0_lab/foreground.png", id:"foreground"},
		{src:"img/measureup_story/0_lab/midground.png", id:"midground"},
		{src:"img/measureup_story/0_lab/background.png", id:"background"},
		{src:"img/measureup_story/0_lab/shoot.mp3", id:"shoot_mp3"},
		{src:"img/measureup_story/0_lab/sneak.mp3", id:"sneak_mp3"},
        */

		//for 1_intro:
		{src:imgPath+"img/measureup_story/1_intro/helen.png", id:"1-helen"},
		{src:imgPath+"img/measureup_story/1_intro/dogs.png", id:"1-dogs"},
		
		//for 2_baker:
		{src:imgPath+"img/measureup_story/2_baker/chef_counter.png", id:"2-chef_counter"},
		{src:imgPath+"img/measureup_story/2_baker/empty_cup.png", id:"2-emptycup"},		
		{src:imgPath+"img/measureup_story/2_baker/measurecup_fill.png", id:"2-measurecup"},
		{src:imgPath+"img/measureup_story/2_baker/carton.png", id:"2-milkcarton"},
		{src:imgPath+"img/measureup_story/2_baker/milkpour.png", id:"2-milkcarton_pour"},

		//for 3_butcher:
		{src:imgPath+"img/measureup_story/3_butcher/sausage.png", id:"3-sausage"},
		{src:imgPath+"img/measureup_story/3_butcher/nuggets.png", id:"3-nuggets"},
		{src:imgPath+"img/measureup_story/3_butcher/steak.png", id:"3-steak"},
		{src:imgPath+"img/measureup_story/3_butcher/sausages.png", id:"3-sausages"},
		{src:imgPath+"img/measureup_story/3_butcher/roast.png", id:"3-roast"},
		{src:imgPath+"img/measureup_story/3_butcher/scale.png", id:"3-scale"},
		{src:imgPath+"img/measureup_story/3_butcher/scale_readings.png", id:"3-scale_readings"},
		{src:imgPath+"img/measureup_story/3_butcher/butcher.png", id:"3-butcher"},

		//for 4_carpenter:
		{src:imgPath+"img/measureup_story/4_carpenter/board.png", id:"4-board"},
		{src:imgPath+"img/measureup_story/4_carpenter/tape-body.png", id:"4-measuringtape_body"},
		{src:imgPath+"img/measureup_story/4_carpenter/tapewithtab.png", id:"4-tapewithtab"},
		{src:imgPath+"img/measureup_story/4_carpenter/td.png", id:"4-td"},

		//for 5_carpenter:
		{src:imgPath+"img/measureup_story/5_carpenter/door.png", id:"5-door"},
		{src:imgPath+"img/measureup_story/5_carpenter/alice.png", id:"5-alice"},

		//for 6_policeofficer:
		{src:imgPath+"img/measureup_story/6_policeofficer/radar.png", id:"6-radar"},
		{src:imgPath+"img/measureup_story/6_policeofficer/cop.png", id:"6-cop"},
		{src:imgPath+"img/measureup_story/6_policeofficer/road.png", id:"6-road"},
		{src:imgPath+"img/measureup_story/6_policeofficer/car.png", id:"6-car-body"},
		{src:imgPath+"img/measureup_story/6_policeofficer/wheel.png", id:"6-car-wheel"},
	
		//for 7_coach:
		{src:imgPath+"img/measureup_story/7_coach/pops-walk-run.png", id:"7-pops-walk-run"},
		{src:imgPath+"img/measureup_story/7_coach/track.png", id:"7-track"},
		{src:imgPath+"img/measureup_story/7_coach/stopwatch-start.png", id:"7-stopwatch-start"},
		{src:imgPath+"img/measureup_story/7_coach/stopwatch-running.png", id:"7-stopwatch-running"},

		//for 8_doctor:
		{src:imgPath+"img/measureup_story/8_doctor/dr.png", id:"8-dr"},
		{src:imgPath+"img/measureup_story/8_doctor/kid.png", id:"8-kid"},

		//for 9_kitchen:
		{src:imgPath+"img/measureup_story/9_kitchen/meter.png", id:"9-meter"},
		{src:imgPath+"img/measureup_story/9_kitchen/cursor.png", id:"9-cursor"},
		{src:imgPath+"img/measureup_story/9_kitchen/oven-front.png", id:"9-oven-front"},
		{src:imgPath+"img/measureup_story/9_kitchen/oven.png", id:"9-oven"},
		{src:imgPath+"img/measureup_story/9_kitchen/treats-burnt.png", id:"9-treats-burnt"},
		{src:imgPath+"img/measureup_story/9_kitchen/treats-soggy.png", id:"9-treats-soggy"},
		{src:imgPath+"img/measureup_story/9_kitchen/treats-good.png", id:"9-treats-good"},
		{src:imgPath+"img/measureup_story/9_kitchen/skits-neutral.png", id:"9-skits-neutral"},
		{src:imgPath+"img/measureup_story/9_kitchen/skits-sad.png", id:"9-skits-sad"},
		{src:imgPath+"img/measureup_story/9_kitchen/skits-happy.png", id:"9-skits-happy"},

		//for 10_end:
		{src:imgPath+"img/measureup_story/10_end/apple.png", id:"10-apple"},
		{src:imgPath+"img/measureup_story/10_end/ball.png", id:"10-ball"},
		{src:imgPath+"img/measureup_story/10_end/carrot.png", id:"10-carrot"},
		{src:imgPath+"img/measureup_story/10_end/flowers.png", id:"10-flowers"},
		{src:imgPath+"img/measureup_story/10_end/helmet.png", id:"10-helmet"},
		{src:imgPath+"img/measureup_story/10_end/martha.png", id:"10-martha"},
		{src:imgPath+"img/measureup_story/10_end/pancake.png", id:"10-pancake"},
		{src:imgPath+"img/measureup_story/10_end/skateboard.png", id:"10-skateboard"},
		{src:imgPath+"img/measureup_story/10_end/violin.png", id:"10-violin"},
		{src:imgPath+"img/measureup_story/10_end/10_scale_readings.png", id:"10-scale_readings"},

		//for glossary (common assets for every use):
		{src:imgPath+"img/glossary/wordbone.png", id:"glossary-wordbone"},	
		//{src:imgPath+"img/glossary/martha_only.png", id:"glossary-martha"},
		{src:imgPath+"img/glossary/martha_only.png", id:"glossary-martha"},	
		{src:imgPath+"img/glossary/board_only.png", id:"glossary-board"},{src:imgPath+"img/glossary/glossary_title.png", id:"glossary-title"},	
		{src:imgPath+"img/glossary/bowl_only.png", id:"glossary-bowl"},	
		{src:imgPath+"img/glossary/splash_only.png", id:"glossary-splash"},			
		{src:imgPath+"img/glossary/cloud_defonly.png", id:"glossary-txtcloud"},
		{src:imgPath+"img/glossary/cloud_defandimage.png", id:"glossary-imgcloud"},

		//quiz-glossary img assets specific to this story:
		/*{src:imgPath+"img/measureup_story/quiz_glossary/scale.png", id:"scales"},
		{src:imgPath+"img/measureup_story/quiz_glossary/cake.png", id:"speed"},
		{src:imgPath+"img/measureup_story/quiz_glossary/steak.png", id:"temperature"},
		{src:imgPath+"img/measureup_story/quiz_glossary/roast.png", id:"weight"},
		{src:imgPath+"img/measureup_story/quiz_glossary/flowers.png", id:"distance"},*/
		
		//overwriting topright of frame with 2-btn sized img
		{src:imgPath+"img/rtlstorybook/frame_topright2.png",id:"rightborder"},

		//quiz_cover img for cover page:
		{src:imgPath+"img/quiz/quizmo-splash.jpg", id:"quiz_cover"},
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

		{src:imgPath+"img/quiz/splat_appendage/splat_0.png", id:"quizmo_splat_0"},
		{src:imgPath+"img/quiz/splat_appendage/splat_1.png", id:"quizmo_splat_1"},
		{src:imgPath+"img/quiz/splat_appendage/splat_2.png", id:"quizmo_splat_2"},
		{src:imgPath+"img/quiz/splat_appendage/splat_3.png", id:"quizmo_splat_3"},
		{src:imgPath+"img/quiz/splat_appendage/splat_4.png", id:"quizmo_splat_4"},

		{src:imgPath+"img/quiz/lazer_appendage/lazer_0.png", id:"quizmo_lazer_0"},
		{src:imgPath+"img/quiz/lazer_appendage/lazer_1.png", id:"quizmo_lazer_1"},

		{src:imgPath+"img/quiz/pie_appendage/pie.png", id:"quizmo_pie"},
		{src:imgPath+"img/quiz/pie_appendage/appendage_pie.png", id:"quizmo_pie_appendage"},
		{src:imgPath+"img/quiz/pie_appendage/pie_splat_full.png", id:"quizmo_pie_splat"},
		{src:imgPath+"img/quiz/pie_appendage/pie_remains.png", id:"quizmo_pie_remains"},


		{src:imgPath+"img/quiz/burger_appendage/burger_appendage.png", id:"quizmo_burger_appendage"},
		{src:imgPath+"img/quiz/burger_appendage/burger.png", id:"quizmo_burger"},
		{src:imgPath+"img/quiz/burger_appendage/burger_splat.png", id:"quizmo_burger_splat1"},
		{src:imgPath+"img/quiz/burger_appendage/burger_splat2.png", id:"quizmo_burger_splat2"},

		{src:imgPath+"img/quiz/lazer2_appendage/lazer2_0.png", id:"quizmo_lazer2_0"},
		{src:imgPath+"img/quiz/lazer2_appendage/lazer2_1.png", id:"quizmo_lazer2_1"},

		{src:imgPath+"img/quiz/alphabet_appendage/alphabet_appendage.png", id:"quizmo_alphabet_appendage"},
		{src:imgPath+"img/quiz/alphabet_appendage/alphabet_splat.png", id:"quizmo_alphabet_splat"},


		{src:imgPath+"img/quiz/wrong_answer_poof/sheet_0.png", id:"quizmo_wrong_answer_poof_0"},
		{src:imgPath+"img/quiz/wrong_answer_poof/sheet_1.png", id:"quizmo_wrong_answer_poof_1"},

		//USES IMG ASSETS FROM THE "HOW TO BE AN INVENTOR" STORY
		{src:imgPath+"img/inventor_story/6/foodbit1.png", id:"foodbit1"},
		{src:imgPath+"img/inventor_story/6/foodbit2.png", id:"foodbit2"},
		{src:imgPath+"img/inventor_story/6/foodbit3.png", id:"foodbit3"},
		{src:imgPath+"img/inventor_story/6/foodbit4.png", id:"foodbit4"},
		{src:imgPath+"img/inventor_story/6/foodbit5.png", id:"foodbit5"},
		{src:imgPath+"img/inventor_story/6/foodbit6.png", id:"foodbit6"},
		{src:imgPath+"img/inventor_story/6/foodbit7.png", id:"foodbit7"},	

		{src:imgPath+"img/quiz/scale/scale.png", id:"quizmo_scale"},
		{src:imgPath+"img/quiz/scale/scale_base.png", id:"quizmo_scale_base"},
		{src:imgPath+"img/quiz/scale/tray.png", id:"quizmo_scale_tray"},

		{src:imgPath+"img/quiz/pickitems/monalisa.jpg", id:"quizmo_monalisa"},

	];

}


//each storybook should have its spritesheets created in this function
function story_spritesheets(){
	//2_baker
	spritesheets['measurecup'] = new createjs.SpriteSheet({
		"frames": [[0, 0, 256, 128, 0, 256, 0], [256, 0, 256, 128, 0, 256, 0], [0, 128, 256, 128, 0, 256, 0], [256, 128, 256, 128, 0, 256, 0], [0, 256, 256, 128, 0, 256, 0], [256, 256, 256, 128, 0, 256, 0]], 
		"animations": {
			"pour": {				
				"frames": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,3,3,4,4,4,5,5,5,5,5,5],
				"frequency": 3,
				"next": false
			}
		}, 		
		"images": [images['2-measurecup']]
	});	

	spritesheets['milkcarton_pour'] = new createjs.SpriteSheet({
	    "frames": [
	        [2, 2, 252, 252, 0, 254, -2],
	        [258, 2, 252, 252, 0, 254, -2],
	        [514, 2, 252, 252, 0, 254, -2],
	        [770, 2, 252, 252, 0, 254, -2],
	        [1026, 2, 252, 252, 0, 254, -2],
	        [1282, 2, 252, 252, 0, 254, -2],
	        [1538, 2, 252, 252, 0, 254, -2],
	        [1794, 2, 252, 252, 0, 254, -2],
	        [2, 258, 252, 252, 0, 254, -2],
	        [258, 258, 252, 252, 0, 254, -2],
	        [514, 258, 252, 252, 0, 254, -2],
	        [770, 258, 252, 252, 0, 254, -2],
	        [1026, 258, 252, 252, 0, 254, -2],
	        [1282, 258, 252, 252, 0, 254, -2],
	        [1538, 258, 252, 252, 0, 254, -2],
	        [1794, 258, 252, 252, 0, 254, -2],
	        [2, 514, 252, 252, 0, 254, -2],
	        [258, 514, 252, 252, 0, 254, -2],
	        [514, 514, 252, 252, 0, 254, -2],
	        [770, 514, 252, 252, 0, 254, -2]
	    ],
	    "animations": {
	    	"up": {"frames": 0, "next": false},
	    	"pour": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 14, 14, 14, 13, 13, 13, 13, 15, 16, 17, 18, 19, 0, 0, 0, 0, 0, 0], "next": false, "frequency": 3}
	    },
		"images": [images['2-milkcarton_pour']]
	});

	//3_butcher:
	spritesheets['scale_readings'] = new createjs.SpriteSheet({
		"frames": [[0, 0, 128, 64, 0, 128, 0], [128, 0, 128, 64, 0, 128, 0], [256, 0, 128, 64, 0, 128, 0], [384, 0, 128, 64, 0, 128, 0], [512, 0, 128, 64, 0, 128, 0], [640, 0, 128, 64, 0, 128, 0]], 
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5]}},

		"images": [images['3-scale_readings']]
	});	

	//7_coach:
	spritesheets['pops_walk_run'] = new createjs.SpriteSheet({
	    "frames": [
	        [0, 0, 512, 256, 0, 512, 0],
	        [512, 0, 512, 256, 0, 512, 0],
	        [1024, 0, 512, 256, 0, 512, 0],
	        [1536, 0, 512, 256, 0, 512, 0],
	        [0, 256, 512, 256, 0, 512, 0],
	        [512, 256, 512, 256, 0, 512, 0],
	        [1024, 256, 512, 256, 0, 512, 0],
	        [1536, 256, 512, 256, 0, 512, 0],
	        [0, 512, 512, 256, 0, 512, 0],
	        [512, 512, 512, 256, 0, 512, 0],
	        [1024, 512, 512, 256, 0, 512, 0],
	        [1536, 512, 512, 256, 0, 512, 0],
	        [0, 768, 512, 256, 0, 512, 0],
	        [512, 768, 512, 256, 0, 512, 0],
	        [1024, 768, 512, 256, 0, 512, 0],
	        [1536, 768, 512, 256, 0, 512, 0],
	        [0, 1024, 512, 256, 0, 512, 0],
	        [512, 1024, 512, 256, 0, 512, 0],
	        [1024, 1024, 512, 256, 0, 512, 0],
	        [1536, 1024, 512, 256, 0, 512, 0],
	        [0, 1280, 512, 256, 0, 512, 0],
	        [512, 1280, 512, 256, 0, 512, 0],
	        [1024, 1280, 512, 256, 0, 512, 0],
	        [1536, 1280, 512, 256, 0, 512, 0],
	        [0, 1536, 512, 256, 0, 512, 0],
	        [512, 1536, 512, 256, 0, 512, 0],
	        [1024, 1536, 512, 256, 0, 512, 0],
	        [1536, 1536, 512, 256, 0, 512, 0],
	        [0, 1792, 512, 256, 0, 512, 0],
	        [512, 1792, 512, 256, 0, 512, 0]
	    ],
	    "animations": {
	    	"idle": {"frames": [0, 1, 2, 3], "loop": true, "frequency": 6},
	    	"run": {"frames": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], "loop": true, "frequency": 2}, 
	    	"walk": {"frames": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "loop": true, "frequency": 4}
	    },
	    "images": [images['7-pops-walk-run']]
	});		
	
	//10_end:
	spritesheets['10_scale_readings'] = new createjs.SpriteSheet({
	    "frames": [[480, 0, 0, 0, 0, 0, 0], [244, 0, 114, 32, 0, -217, -100], [0, 0, 122, 34, 0, -212, -100], [122, 0, 122, 33, 0, -212, -100], [357, 34, 119, 30, 0, -214, -102], [238, 34, 119, 30, 0, -214, -102], [119, 34, 119, 30, 0, -214, -102], [0, 34, 119, 30, 0, -214, -102], [358, 0, 122, 30, 0, -212, -101]],
	    "animations": {
	    	"helmet": {"frames": [5]}, 
	    	"ball": {"frames": [2]}, 
	    	"flowers": {"frames": [1]}, 
	    	"skateboard": {"frames": [8]}, 
	    	"carrot": {"frames": [4]}, 
	    	"none": {"frames": [0]}, 
	    	"violin": {"frames": [7]}, 
	    	"pancake": {"frames": [6]}, 
	    	"apple": {"frames": [3]}
	    },
	    "images": [images['10-scale_readings']]
	});

	//glossary:
	spritesheets['glossary-martha'] = new createjs.SpriteSheet({
	    "frames": [
	        [1037, 2, 259, 217, 0, -20, -114],
	        [538, 2, 248, 227, 0, -37, -128],
	        [288, 2, 246, 229, 0, -38, -118],
	        [790, 2, 243, 220, 0, -38, -121],
	        [1755, 450, 252, 196, 0, -30, -137],
	        [2, 2, 282, 237, 0, -4, -86],
	        [577, 656, 280, 157, 0, -149, -105],
	        [861, 656, 281, 157, 0, -183, -67],
	        [2, 656, 284, 190, 0, -208, -20],
	        [290, 656, 283, 189, 0, -228, -15],
	        [1463, 450, 288, 196, 0, -237, -10],
	        [1171, 450, 288, 196, 0, -244, -9],
	        [877, 450, 290, 200, 0, -247, -7],
	        [582, 450, 291, 200, 0, -249, -7],
	        [869, 243, 289, 203, 0, -252, -8],
	        [578, 243, 287, 203, 0, -255, -10],
	        [291, 450, 287, 202, 0, -257, -18],
	        [1742, 243, 286, 203, 0, -262, -30],
	        [1452, 243, 286, 203, 0, -268, -48],
	        [1162, 243, 286, 203, 0, -276, -73],
	        [2, 450, 285, 202, 0, -287, -107],
	        [290, 243, 284, 203, 0, -302, -152],
	        [2, 243, 284, 203, 0, -322, -215],
	        [1300, 2, 276, 204, 0, -356, -310],
	        [1580, 2, 275, 204, 0, -416, -495]
	    ],
	    "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], "next": false, "frequency": 3}},		
		"images": [images['glossary-martha']]
	});

	spritesheets['glossary-board'] = new createjs.SpriteSheet({
	    "frames": [[2, 209, 384, 69, 0, 0, -14], [2, 2, 387, 110, 0, 0, -2], [393, 2, 386, 99, 0, 0, -5], [2, 116, 386, 89, 0, 0, -8], [392, 116, 386, 79, 0, 0, -11], [580, 209, 304, 69, 0, 0, -14], [783, 2, 237, 69, 0, 0, -14], [390, 209, 186, 69, 0, 0, -14], [2, 282, 149, 68, 0, 0, -14], [782, 116, 127, 68, 0, 0, -14], [888, 209, 120, 68, 0, 0, -14]],
	    "animations": {"all": {"frames": [0, 1, 2, 3, 4, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10], "next": false, "frequency": 3}},
		"images": [images['glossary-board']]
	});

	spritesheets['glossary-bowl'] = new createjs.SpriteSheet({	
		"frames": [[0, 0, 629, 170, 0, 0, -1], [0, 170, 629, 166, 0, 0, -1]], 
		"animations": {"all": {"frames": [0, 1]}
		},
		"images": [images['glossary-bowl']]		
	});

	spritesheets['glossary-splash'] = new createjs.SpriteSheet({	
		"frames": [[1808, 0, 1, 1, 0, 0, 0], [451, 578, 422, 186, 0, -45, -134], [0, 578, 451, 230, 0, -30, -78], [0, 0, 543, 297, 0, 0, -4], [543, 0, 594, 295, 0, 0, 0], [1402, 297, 637, 262, 0, 0, -21], [1137, 0, 671, 282, 0, 0, 0], [0, 297, 694, 281, 0, 0, 0], [694, 297, 708, 280, 0, 0, 0]], 
		"animations": {
			"bowl_idle": {"frames": [0]}, 
			"bowl_splash": {"frames": [1, 2, 3, 4, 5, 6, 7, 8], "frequency": 4, "next": false}, 
		},			
		"images": [images['glossary-splash']]		
	});

 // quiz releated

	spritesheets["moreStoriesButton"]  = new createjs.SpriteSheet({
        images: [images['btn_stories']],
        frames: {width:265, height:118},
        animations: {
            off:[0],
            on:[1]
        }
     });

	spritesheets["splat_appendage"] = new createjs.SpriteSheet({
	    "animations": {"all": {"frames": [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19, 19, 0], "frequency":2, "next":false}},
	    "images": [images['quizmo_splat_0'], images['quizmo_splat_1'], images['quizmo_splat_2'], images['quizmo_splat_3'], images['quizmo_splat_4']],
	    "frames": [
	        [2, 2, 1020, 1020, 0, -2, -43],
	        [1026, 2, 1020, 1020, 0, -2, -43],
	        [2, 1026, 1020, 1020, 0, -2, -43],
	        [1026, 1026, 1020, 1020, 0, -2, -43],
	        [2, 2, 1020, 1020, 1, -2, -43],
	        [1026, 2, 1020, 1020, 1, -2, -43],
	        [2, 1026, 1020, 1020, 1, -2, -43],
	        [1026, 1026, 1020, 1020, 1, -2, -43],
	        [2, 2, 1020, 1020, 2, -2, -43],
	        [1026, 2, 1020, 1020, 2, -2, -43],
	        [2, 1026, 1020, 1020, 2, -2, -43],
	        [1026, 1026, 1020, 1020, 2, -2, -43],
	        [2, 2, 1020, 1020, 3, -2, -43],
	        [1026, 2, 1020, 1020, 3, -2, -43],
	        [2, 1026, 1020, 1020, 3, -2, -43],
	        [1026, 1026, 1020, 1020, 3, -2, -43],
	        [2, 2, 1020, 1020, 4, -2, -43],
	        [1026, 2, 1020, 1020, 4, -2, -43],
	        [2, 1026, 1020, 1020, 4, -2, -43],
	        [1026, 1026, 1020, 1020, 4, -2, -43]
	    ]
	});

	spritesheets["lazer_appendage"] = new createjs.SpriteSheet({
    "images": [images['quizmo_lazer_0'], images['quizmo_lazer_1']],
    "frames": [
        [707, 718, 64, 225, 1, -187, -270],
        [239, 718, 211, 293, 1, -118, -202],
        [211, 401, 209, 312, 1, -114, -183],
        [424, 401, 218, 300, 1, -95, -195],
        [2, 718, 233, 298, 1, -95, -197],
        [871, 2, 107, 302, 1, -171, -193],
        [121, 2, 95, 360, 1, -172, -135],
        [2, 2, 115, 395, 1, -167, -100],
        [516, 500, 128, 451, 0, -165, -44],
        [260, 2, 103, 481, 0, -165, -14],
        [2, 2, 97, 494, 0, -171, -1],
        [367, 2, 148, 478, 0, -150, -17],
        [103, 2, 153, 491, 0, -145, -4],
        [648, 500, 94, 435, 0, -157, -60],
        [519, 2, 153, 475, 0, -145, -20],
        [941, 2, 64, 274, 0, -187, -221],
        [454, 718, 72, 254, 1, -187, -241],
        [770, 401, 123, 299, 1, -175, -196],
        [220, 2, 173, 342, 1, -172, -150],
        [248, 500, 264, 473, 0, -151, -22],
        [676, 2, 261, 475, 0, -142, -20],
        [2, 500, 242, 475, 0, -92, -20],
        [530, 718, 173, 251, 1, -127, -244],
        [648, 2, 219, 318, 1, -98, -177],
        [897, 401, 121, 299, 1, -127, -195],
        [2, 401, 205, 313, 1, -42, -181],
        [397, 2, 247, 327, 1, 0, -167],
        [746, 500, 242, 396, 0, -4, -98],
        [646, 401, 120, 299, 1, -127, -195]
    ],
    "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 21, 22, 23, 24, 25, 26, 27, 26, 25, 28, 24,0], "frequency":3, "next": false}}
	});

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
            "run": { "frames": [4, 2, 1, 7, 6, 3, 0, 5] }
        },
	});

	spritesheets['pie_appendage'] = new createjs.SpriteSheet({
		"images": [images['quizmo_pie_appendage']], 
		"frames": [[1070, 2, 173, 175, 0, 0, -31], [1247, 2, 179, 167, 0, 0, -38], [893, 2, 173, 176, 0, 0, -31], [179, 2, 179, 182, 0, 0, -24], [716, 2, 173, 176, 0, -2, -29], [539, 2, 173, 176, 0, -2, -29], [362, 2, 173, 176, 0, -2, -29], [2, 2, 173, 187, 0, -2, -18], [1430, 2, 0, 0, 0, 0, 0]], 
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7], "next":false}}
	});

	spritesheets['burger_appendage'] = new createjs.SpriteSheet({
		"images": [images['quizmo_burger_appendage']], 		
		"frames": [[808, 0, 202, 161, 0, -1, -101], [404, 261, 198, 152, 0, -3, -110], [602, 261, 202, 144, 0, -1, -118], [804, 261, 202, 136, 0, -1, -126], [0, 421, 202, 132, 0, -1, -130], [606, 0, 202, 166, 0, -1, -96], [0, 261, 202, 160, 0, -1, -102], [202, 261, 202, 155, 0, -1, -107], [404, 0, 202, 182, 0, -1, -80], [202, 0, 202, 221, 0, -1, -41], [0, 0, 202, 261, 0, -1, -1]], 
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "frequency": 3,"next":false}}
	});


	spritesheets['lazer2_appendage'] = new createjs.SpriteSheet({
		"images": [images['quizmo_lazer2_0'],images['quizmo_lazer2_1']],
	    "frames": [[930, 0, 62, 209, 0, -260, -334], [860, 543, 72, 207, 0, -250, -336], [0, 0, 319, 543, 0, -3, 0], [133, 543, 158, 361, 0, -164, -182], [94, 0, 103, 187, 1, -219, -356], [319, 0, 246, 543, 0, -248, 0], [565, 0, 205, 531, 0, -271, -12], [0, 0, 94, 193, 1, -271, -350], [291, 543, 569, 305, 0, -271, -238], [197, 0, 108, 186, 1, -271, -357], [0, 543, 133, 408, 0, -271, -135], [770, 0, 160, 455, 0, -271, -88]],
	    "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,0], "frequency": 3,"next": false}}
	});

	spritesheets['alphabet_appendage'] = new createjs.SpriteSheet({
		"images": [images['quizmo_alphabet_appendage']], 		
		"frames": [[796, 0, 203, 162, 0, 0, -354], [586, 516, 193, 150, 0, -5, -366], [399, 516, 187, 156, 0, -8, -360], [0, 516, 199, 160, 0, -2, -356], [600, 0, 196, 381, 0, -2, -135], [200, 0, 200, 515, 0, 0, -1], [400, 0, 200, 515, 0, 0, -1], [0, 0, 200, 516, 0, 0, 0], [199, 516, 200, 159, 0, 0, -357]],
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 8], "frequency":4, "next":false}}
	});

	spritesheets["wrong_answer_poof"] = new createjs.SpriteSheet({
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],"frequency":2, "next":false}},
		"images": [images['quizmo_wrong_answer_poof_0'], images['quizmo_wrong_answer_poof_1']],
	    "frames": [
	        [2, 2, 508, 508, 0, -56, -21],
	        [514, 2, 508, 508, 0, -56, -21],
	        [1026, 2, 508, 508, 0, -56, -21],
	        [1538, 2, 508, 508, 0, -56, -21],
	        [2, 514, 508, 508, 0, -56, -21],
	        [514, 514, 508, 508, 0, -56, -21],
	        [1026, 514, 508, 508, 0, -56, -21],
	        [1538, 514, 508, 508, 0, -56, -21],
	        [2, 1026, 508, 508, 0, -56, -21],
	        [514, 1026, 508, 508, 0, -56, -21],
	        [1026, 1026, 508, 508, 0, -56, -21],
	        [1538, 1026, 508, 508, 0, -56, -21],
	        [2, 1538, 508, 508, 0, -56, -21],
	        [514, 1538, 508, 508, 0, -56, -21],
	        [1026, 1538, 508, 508, 0, -56, -21],
	        [1538, 1538, 508, 508, 0, -56, -21],
	        [2, 2, 508, 508, 1, -56, -21],
	        [514, 2, 508, 508, 1, -56, -21],
	        [1026, 2, 508, 508, 1, -56, -21],
	        [1538, 2, 508, 508, 1, -56, -21]
	    ]
    });
}
