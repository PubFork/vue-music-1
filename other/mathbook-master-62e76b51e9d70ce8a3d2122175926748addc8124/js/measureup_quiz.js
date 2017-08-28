//"How Do You Measure Up?" Quiz vars

//page name of quiz_end page should be set to var quiz_end
//create one additional container in worlds[] with .name contained in quiz_end
var pagenames;
var quiz_end = 'measureup_quiz_end';
worlds[quiz_end] = new createjs.Container();

//define questions and answers here 
//Questions are always text. Answers can be txt or images....
/*
//quiz_words: array that holds each word being quizzed. array elements (strings) used as keys to access questions and answers in quiz_content

//TEXT-ONLY
//quiz_content 2D array, for each inner array, indices as follows:
	0 - question text
	1 - CORRECT answer choice
	2 - WRONG answer choice
	3 - WRONG answer choice
	4 - difficulty: 'easy', 'medium' 'hard', 'rc'(for reading comp question)
*/

//testing quiz_words as 2D array: [0] holds  words being tested, [1] holds type: txt or img
var quiz_words =  ['qfishing','q13','qscale', 'qstadium', 'qskywheel', 'qtrain', 'qblocklink', 'qpiglink', 'qcard', 'qanimal', 'qpresentb', 'qpresenta', 'qstadium', 'qblock', 'qfruit', 'q22', 'q21', 'q2', 'qscene', 'q0', 'q11', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
var quiz_content = [];
//txt questions
quiz_content['qfishing'] = ['fishing',{bg:'img/quiz/fishing/background.jpg',hookSrc:'img/quiz/fishing/fishhook.png'},[['img/quiz/number/2.png',2],['img/quiz/number/6.png',6],['img/quiz/number/4.png',4]],[[{src:'img/quiz/number/6.png',numSrc:'img/quiz/fishing/fishhook.png',choice:'中',xOffset:800,yOffset:350,rank:6,x:100,y:0,id:['fishing-4']}],[{src:'img/quiz/number/4.png',numSrc:'img/quiz/fishing/fishhook.png',choice:'中',xOffset:800,yOffset:450,rank:4,x:200,y:0,id:['fishing-8']}],[{src:'img/quiz/number/2.png',numSrc:'img/quiz/fishing/fishhook.png',choice:'中',xOffset:800,yOffset:550,rank:2,x:300,y:0,id:['fishing-6']}]],[['sea'],['boat']],'easy'];
quiz_content['q0'] = ["fill", "Two pigs plus three sheeps, there are totally ? animals here", 5, "easy"];
quiz_content['qscale'] = ["scale", [{img: 'img/mathquiz/scale/mushroom1.png', weight: 2, x: 100, y: 100}, {img: 'img/mathquiz/scale/mushroom2.png', weight: 5, x: 100, y: 200}, {img: 'img/mathquiz/scale/mushroom3.png', weight: 5, x: 100, y: 200}], 'medium'];
quiz_content['qscene'] = ["scene", {"png": "img/quiz/q5/spritesheet.png", "json": "img/quiz/q5/spritesheet.json"}, [["img/quiz/q5/background.png"], ["img/quiz/q5/ground.png"],["img/quiz/q5/midground.png"],["img/quiz/q5/foreground.png"]], [["img/quiz/q5/monalisa.jpg", 10, 10, "right"], ["img/quiz/q5/mouse.png", 400, 10, "wrong"]], 1, 'medium'];
quiz_content['qskywheel'] = ["skywheel", ["img/mathquiz/skywheel/background.jpg"], [["img/mathquiz/skywheel/choice2.png", 170, 210, 2, 0.5],["img/mathquiz/skywheel/choice4.png", 250, 210, 4, 0.5],["img/mathquiz/skywheel/choice7.png", 170, 290 , 7, 0.5],["img/mathquiz/skywheel/choice9.png", 250, 290, 9, 0.5]], [ ["wheel-one", 1, 0.5], ["wheel-two", 2, 0.5], ["wheel-three", 3, 0.5], ["wheel-four", 4, 0.5], ["wheel-five", 5, 0.5], ["wheel-six", 6, 0.5], ["wheel-seven", 7, 0.5], ["wheel-eight", 8, 0.5], ["wheel-nine", 9, 0.5], ["wheel-ten", 10, 0.5]], 1, 'medium'];
quiz_content['qconveyer'] = ["conveyer", {"png": "img/quiz/q5/spritesheet.png", "json": "img/quiz/q5/spritesheet.json"}, ["img/quiz/q5/background.png"], [["img/rtlstorybook/loader_bone.png", 100, 500], ["img/rtlstorybook/start_btn.png", 300, 500]], [["img/rtlstorybook/process_star.png", 100, 100, 1], ["img/rtlstorybook/process_star.png", 300, 100, 0]], 'medium'];
quiz_content['qfootball'] = ["rope", ["img/mathquiz/football/background.jpg"], [{ id: "", x: 0, y: 100} ], ["qfootball1",  [[{ src: "img/mathquiz/football/shirt_hanger1.png"}, 100, 100, -1], [{src: "img/mathquiz/football/hanger.png"}, 300, 100, 2], [{src:"img/mathquiz/football/shirt_hanger3.png"}, 500, 100, -1]], [{src: "img/mathquiz/football/shirt.png", x: 100, y: 500, label: 1}, {src: "img/mathquiz/football/shirt.png", x: 300, y: 500, label: 0}, {src: "img/mathquiz/football/shirt.png", x: 500, y: 500, label: 2} ]], 'medium'] 
quiz_content['qtrain'] = ["rope", ["img/mathquiz/train/background.jpg"], [ ], ["qtrain1",  [[ {id: "red-train", src: "img/mathquiz/train/3.png", x: 130, y: 160, scale: 0.5}, 100, 80, -1], [{id: "blue-train", src: "img/mathquiz/train/4.png", x: 130, y: 160, scale: 0.5, targetX: 350, targetY: 80}, 100, -300, 4], [{id: "yellow-train", src: "img/mathquiz/train/5.png", x: 130, y: 160, scale: 0.5}, 600, 80, -1]], [{src: "img/mathquiz/train/2.png", x: 100, y: 500, label: 2, type: "click"}, {src: "img/mathquiz/train/4.png", x: 350, y: 500, label: 4, type: "click"}, {src: "img/mathquiz/train/6.png", x: 600, y: 500, label: 6, type: "click"}] ], ["qtrain2", [[ {id: "red-train", src: "img/mathquiz/train/7.png", x: 130, y: 160, scale: 0.5}, 100, 80, -1], [{id: "blue-train", src: "img/mathquiz/train/8.png", x: 130, y: 160, scale: 0.5, targetX: 350, targetY: 80}, 100, -300, 8], [{id: "yellow-train", src: "img/mathquiz/train/9.png", x: 130, y: 160, scale: 0.5}, 600, 80, -1]], [{src: "img/mathquiz/train/6.png", x: 100, y: 500, label: 6, type: "click"}, {src: "img/mathquiz/train/8.png", x: 350, y: 500, label: 8, type: "click"}, {src: "img/mathquiz/train/6.png", x: 600, y: 500, label:6, type: "click"} ]], ["qtrain3",  [[ {id: "red-train", src: "img/mathquiz/train/6.png", x: 130, y: 160, scale: 0.5}, 100, 80, -1], [{id: "blue-train", src: "img/mathquiz/train/7.png", x: 130, y: 160, scale: 0.5, targetX: 350, targetY: 80}, 100, -300, 7], [{id: "yellow-train", src: "img/mathquiz/train/8.png", x: 130, y: 160, scale: 0.5}, 600, 80, -1]], [{src: "img/mathquiz/train/7.png", x: 100, y: 500, label: 7, type: "click"}, {src: "img/mathquiz/train/8.png", x: 350, y: 500, label: 8, type: "click"}, {src: "img/mathquiz/train/5.png", x: 600, y: 500, label: 5, type: "click"} ]], ["qtrain4",  [[ {id: "red-train", src: "img/mathquiz/train/4.png", x: 130, y: 160, scale: 0.5}, 100, 80, -1], [{id: "blue-train", src: "img/mathquiz/train/5.png", x: 130, y: 160, scale: 0.5, targetX: 350, targetY: 80}, 100, -300, 5], [{id: "yellow-train", src: "img/mathquiz/train/6.png", x: 130, y: 160, scale: 0.5}, 600, 80, -1]], [{src: "img/mathquiz/train/7.png", x: 100, y: 500, label: 7, type: "click"}, {src: "img/mathquiz/train/4.png", x: 350, y: 500, label: 4, type: "click"}, {src: "img/mathquiz/train/5.png", x: 600, y: 500, label: 5, type: "click"} ]], 'medium'];
quiz_content['qblock'] = ["rope", ["img/mathquiz/block/background.jpg"], [{id: "block-holdhands", y: 50, targetX: 100, targetY: 100}], ["qblock1",  [[ {id: "block-3"}, 50, 80, -1], [{src: "img/mathquiz/block/blank.png"}, 430, 180, 4], [{id: "block-5"}, 800, 80, -1]], [{id: "block-2", x: 100, y: 400, label: 2}, {id: "block-4-middle", x: 350, y: 400, label: 4}, {id: "block-6", x: 600, y: 400, label: 6} ]], ["qblock2",  [[ {id: "block-6"}, 50, 80, -1], [{src: "img/mathquiz/block/blank.png"}, 430, 180, 7], [{id: "block-8"}, 800, 80, -1]], [{id: "block-5", x: 100, y: 400, label: 5}, {id: "block-4", x: 350, y: 400, label: 4}, {id: "block-7-middle", x: 600, y: 400, label: 7} ]], ["qblock3",  [[ {id: "block-7"}, 50, 80, -1], [{src: "img/mathquiz/block/blank.png"}, 430, 180, 8], [{id: "block-9"}, 800, 80, -1]], [{id: "block-8-middle", x: 100, y: 400, label: 8}, {id: "block-9", x: 350, y: 400, label: 9}, {id: "block-7", x: 600, y: 400, label: 7} ]], ["qblock4",  [[ {id: "block-2"}, 50, 80, -1], [{src: "img/mathquiz/block/blank.png"}, 430, 180, 3], [{id: "block-4"}, 800, 80, -1]], [{id: "block-5", x: 100, y: 400, label: 5}, {id: "block-3-middle", x: 350, y: 400, label: 3}, {id: "block-4", x: 600, y: 400, label: 4} ]], 'medium'];
quiz_content['qfruit'] = ["rope", ["img/mathquiz/fruit/background.jpg"], [], ["qfruit1",  [[ {src: "img/mathquiz/fruit/3-apple.png"}, 50, 80, -1], [{src: "img/mathquiz/fruit/blank.png"}, 350, 80, 4], [{src: "img/mathquiz/fruit/5-orange.png"}, 700, 80, -1]], [{src: "img/mathquiz/fruit/4-banana.png", x: 100, y: 400, label: 4}, {src: "img/mathquiz/fruit/5-strawberry.png", x: 350, y: 400, label: 5}, {src: "img/mathquiz/fruit/3-pear.png", x: 600, y: 400, label: 6} ]],["qfruit2",  [[ {src: "img/mathquiz/fruit/2-banana.png"}, 50, 80, -1], [{src: "img/mathquiz/fruit/blank.png"}, 350, 80, 3], [{src: "img/mathquiz/fruit/4-strawberry.png"}, 700, 80, -1]], [{src: "img/mathquiz/fruit/4-banana.png", x: 100, y: 400, label: 4}, {src: "img/mathquiz/fruit/2-cherry.png", x: 350, y: 400, label: 2}, {src: "img/mathquiz/fruit/3-kiwi.png", x: 600, y: 400, label: 3} ]],["qfruit3",  [[ {src: "img/mathquiz/fruit/5-strawberry.png"}, 50, 80, -1], [{src: "img/mathquiz/fruit/blank.png"}, 350, 80, 6], [{src: "img/mathquiz/fruit/7-cherry.png"}, 700, 80, -1]], [{src: "img/mathquiz/fruit/6-apple.png", x: 100, y: 400, label: 6}, {src: "img/mathquiz/fruit/5-strawberry.png", x: 350, y: 400, label: 5}, {src: "img/mathquiz/fruit/8-pear.png", x: 600, y: 400, label: 8} ]],["qfruit4",  [[ {src: "img/mathquiz/fruit/8-pear.png"}, 50, 80, -1], [{src: "img/mathquiz/fruit/blank.png"}, 350, 80, 9], [{src: "img/mathquiz/fruit/10-banana.png"}, 700, 80, -1]], [{src: "img/mathquiz/fruit/8-strawberry.png", x: 100, y: 400, label: 8}, {src: "img/mathquiz/fruit/1-pear.png", x: 350, y: 400, label: 1}, {src: "img/mathquiz/fruit/9-strawberry.png", x: 600, y: 400, label: 9} ]], 'medium'];
quiz_content['qcard'] = ["rope", ["img/mathquiz/card/background.jpg"], [], ["qcard1",  [[ {id: "card-3"}, 50, 80, -1], [{src: "img/mathquiz/card/blank.png"}, 350, 80, 4], [{id: "card-5"}, 700, 80, -1]], [{src: "img/mathquiz/card/2.png", x: 100, y: 400, label: 2}, {src: "img/mathquiz/card/4.png", x: 300, y: 400, label: 4}, {src: "img/mathquiz/card/6.png", x: 500, y: 400, label: 6}, {src: "img/mathquiz/card/8.png", x: 700, y: 400, label: 8} ]],["qcard2",  [[ {id: "card-5"}, 50, 80, -1], [{src: "img/mathquiz/card/blank.png"}, 350, 80, 6], [{id: "card-7"}, 700, 80, -1]], [{src: "img/mathquiz/card/4.png", x: 100, y: 400, label: 4}, {src: "img/mathquiz/card/6.png", x: 300, y: 400, label: 6}, {src: "img/mathquiz/card/8.png", x: 500, y: 400, label: 8}, {src: "img/mathquiz/card/10.png", x: 700, y: 400, label: 10} ]], ["qcard3",  [[ {id: "card-6"}, 50, 80, -1], [{src: "img/mathquiz/card/blank.png"}, 350, 80, 7], [{id: "card-8"}, 700, 80, -1]], [{src: "img/mathquiz/card/7.png", x: 100, y: 400, label: 7}, {src: "img/mathquiz/card/5.png", x: 300, y: 400, label: 5}, {src: "img/mathquiz/card/9.png", x: 500, y: 400, label: 9}, {src: "img/mathquiz/card/4.png", x: 700, y: 400, label: 4} ]], ["qcard4",  [[ {id: "card-8"}, 50, 80, -1], [{src: "img/mathquiz/card/blank.png"}, 350, 80, 9], [{id: "card-10"}, 700, 80, -1]], [{src: "img/mathquiz/card/7.png", x: 100, y: 400, label: 7}, {src: "img/mathquiz/card/6.png", x: 300, y: 400, label: 6}, {src: "img/mathquiz/card/5.png", x: 500, y: 400, label: 5}, {src: "img/mathquiz/card/9.png", x: 700, y: 400, label: 9} ]], 'medium'];
quiz_content['qstadium'] = ["dragdrop", "qstadium1, qstadium2, qstadium3, qstadium4", "img/mathquiz/stadium/background.jpg", [{id: "dodo-sit", x: 100, y: 350, labels: [1,1,1,1], scale: 0.4, targetX: -30, targetY: -30, clone: true}], [{src: 'img/mathquiz/stadium/4.png', x:80, y:115, labels: [-1,-1,-1,-1]}, {src: 'img/mathquiz/stadium/5.png', x:230, y:115, labels: [-1,-1,1,-1]}, {src: 'img/mathquiz/stadium/6.png', x:380, y:115, labels: [-1,-1,-1,1]}, {src: 'img/mathquiz/stadium/7.png', x:530, y:115, labels: [-1,1,-1,-1]}, {src: 'img/mathquiz/stadium/8.png', x:680, y:115, labels: [1,-1,-1,-1]}, {src: 'img/mathquiz/stadium/9.png', x:830, y:115, labels: [-1,-1,-1,-1]} ],  'easy'];
quiz_content['qpresenta'] = ["dragdrop", "qpresent1, qpresent2, qpresent3, qpresent4", "img/mathquiz/present/background2.png", [{src: "img/mathquiz/present/package1.png", x: 100, y: 530, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package2.png', x: 150, y: 540, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package3.png', x: 120, y: 550, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package4.png', x:160, y: 560, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package5.png', x: 80, y: 520, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package6.png', x: 200, y: 540, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}], [{src: 'img/mathquiz/present/door.png', x:455, y:410, targetX: 130, labels: [1,-1,-1,-1], mask: true}, {src: 'img/mathquiz/present/door.png', x:790, y:410, targetX: 130, labels: [-1,1,-1,-1], mask: true},{src: 'img/mathquiz/present/door.png', x:275, y:135, targetX: 130, labels: [-1,-1,1,-1], mask: true}, {src: 'img/mathquiz/present/door.png', x:620, y:135, targetX: 130, labels: [-1,-1,-1,1], mask: true} ],  'easy'];
quiz_content['qpresentb'] = ["dragdrop", "qpresent1, qpresent2, qpresent3, qpresent4", "img/mathquiz/present/background1.png", [{src: "img/mathquiz/present/package1.png", x: 100, y: 530, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package2.png', x: 150, y: 540, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package3.png', x: 120, y: 550, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package4.png', x:160, y: 560, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package5.png', x: 80, y: 520, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}, {src: 'img/mathquiz/present/package6.png', x: 200, y: 540, labels: [1,1,1,1], targetX: 10, targetY: -10, animation: "disappear"}], [{src: 'img/mathquiz/present/door.png', x:275, y:410, targetX: 130, labels: [1,-1,-1,-1], mask: true}, {src: 'img/mathquiz/present/door.png', x:450, y:410, targetX: 130, labels: [-1,1,-1,-1], mask: true},{src: 'img/mathquiz/present/door.png', x:105, y:135, targetX: 130, labels: [-1,-1,1,-1], mask: true}, {src: 'img/mathquiz/present/door.png', x:780, y:135, targetX: 130, labels: [-1,-1,-1,1], mask: true} ],  'easy'];
quiz_content['qsupermarket'] = ["dragdrop", "qsupermarket1, qsupermarket2, qsupermarket3, qsupermarket4", "img/mathquiz/supermarket/background.jpg", [{src: "img/mathquiz/supermarket/biscuit.png", x: 100, y: 530, labels: [1,-2,-2,-2], targetX: 10, targetY: -10}, {src: 'img/mathquiz/supermarket/sugar.png', x: 250, y: 540, labels: [-2,1,-2,-2], targetX: 10, targetY: -10}, {src: 'img/mathquiz/supermarket/coco.png', x: 400, y: 550, labels: [-2,-2,-2,1], targetX: 10, targetY: -10}, {src: 'img/mathquiz/supermarket/popcorn.png', x:550, y: 560, labels: [-2,-2,1,-2], targetX: 10, targetY: -10}], [{src: 'img/mathquiz/supermarket/blank.png', x:40, y:270, targetX: 130, labels: [-1,-1,1,-1], mask: true}, {src: 'img/mathquiz/supermarket/blank.png', x:255, y:270, targetX: 130, labels: [-1,-1,-1,1], mask: true},{src: 'img/mathquiz/supermarket/blank.png', x:460, y:270, targetX: 130, labels: [-1,1,-1,-1], mask: true}, {src: 'img/mathquiz/supermarket/blank.png', x:680, y:55, targetX: 130, labels: [1,-1,-1,-1], mask: true} ],  'easy'];
quiz_content['q13'] = ["dragdrop2","a","x",[[{src:'img/quiz/animal/pig.png',numSrc:'img/quiz/number/7.png',choice:'中',xOffset:100,yOffset:550,rank:4}],[{src:'img/quiz/animal/cow.png',numSrc:'img/quiz/number/6.png',choice:'中',xOffset:300,yOffset:550,rank:3}],[{src:'img/quiz/animal/cat.png',numSrc:'img/quiz/number/3.png',choice:'中',xOffset:550,yOffset:550,rank:0}],[{src:'img/quiz/animal/dog.png',numSrc:'img/quiz/number/4.png',choice:'中',xOffset:750,yOffset:550,rank:1}],[{src:'img/quiz/animal/sheep.png',numSrc:'img/quiz/number/5.png',choice:'中',xOffset:950,yOffset:550,rank:2}]],'img/bg/background.jpg','easy'];

quiz_content['qanimal'] = ["dragdrop", "qanimal1, qanimal2, qanimal3, qanimal4", "img/mathquiz/animal/background.jpg", [{id: "animal-cat", x: 100, y: 450, labels: [-2,-2,-2,1]}, {id: 'animal-dog', x: 300, y: 450, labels: [-2,-2,1,-2]}, {id: 'animal-monkey', x: 100, y: 450, labels: [-2,1,-2,-2]}, {id: 'animal-rabbit', x:500, y: 450, labels: [1,-2,-2,-2]}], [{src: 'img/mathquiz/present/door.png', x:535, y:355, targetX: 350, labels: [1,-1,-1,-1], mask: true}, {src: 'img/mathquiz/present/door.png', x:690, y:355, targetX: 955, labels: [-1,-1,1,-1], mask: true},{src: 'img/mathquiz/present/door.png', x:220, y:110, targetX: 455, labels: [-1,-1,-1,1], mask: true}, {src: 'img/mathquiz/present/door.png', x:380, y:110, targetX: 915, labels: [-1,1,-1,-1], mask: true} ],  'easy'];
quiz_content['q2'] = ["link", "When you want to find out how tall someone is, you measure their...",[['img/quiz/dragdrop_appendage/dogs.png', 100, 300, "1", "火星"], ['img/quiz/dragdrop_appendage/dogs.png', 600, 300, "2", "火星"]], [['img/quiz/dragdrop_appendage/plate.png', 100, 100, "1", "水星"], ['img/quiz/dragdrop_appendage/plate.png', 600, 100, "2", "水星"]], 'medium'];
quiz_content['qblocklink'] = ["link2", "img/mathquiz/block_link/background.jpg", {points: "214,17,1;4,276,2;192,443,3;472,444,4;553,249,5;499,195,6;485,68,7;453,163,8;386,68,9;278,5,10", src: "img/mathquiz/block_link/block.png", foreground: "img/mathquiz/block_link/eyes.png", x: 200, y: 200}, 'medium'];
quiz_content['qpiglink'] = ["link2", "img/mathquiz/pig_link/background.jpg", {points: "135,4,1;134,53,2;89,44,3;103,108,4;87,143,5;6,86,6;85,169,7;100,302,8;77,397,9;116,309,10;", src: "img/mathquiz/pig_link/pig.png", foreground: "img/mathquiz/pig_link/line.png", x: 200, y: 200}, 'medium'];
quiz_content['q21'] = ["memory", [["img/quiz/pickitems/monalisa.jpg", 100, 100], ["img/quiz/pickitems/mouse.png", 100, 100]], "wrong", 'medium'];
quiz_content['q22'] = ["match", [["img/quiz/pickitems/monalisa.jpg", "img/quiz/match/back.jpg", 2], ["img/quiz/pickitems/mouse.png", "img/quiz/match/back.jpg", 2]], [1, 2], 'medium'];
quiz_content['q3'] = ["select", "离地球最近的行星?", [{word: '金星', image: 'img/quiz/q3/jinxing.png'}, {word: '火星', image: 'img/quiz/q3/huoxing.png'}, {word: '水星', image: 'img/quiz/q3/shuixing.png'}], 'medium'];
quiz_content['q4'] = ["select", "When you want to find the size or amount of something you…", ['measure', 'estimate', 'compare'], 'hard'];
quiz_content['q5'] = ["select", "When you measure how long something is, what are you measuring?", ['length ', 'height', 'weight'], 'hard'];
quiz_content['q6'] = ["select", "When you find something out you…", ['determine it', 'construct it', 'divide it'], 'hard'];
quiz_content['q7'] = ["select", "When you use what you know about measuring to find something out you...", ['apply it', 'sweep it', 'comfort it'], 'hard'];
quiz_content['q8'] = ["select", "What do you need to measure to figure out how hot or cold something is?", ['temperature', 'distance', 'speed'], 'hard'];
quiz_content['q9'] = ["select", "What does a scale measure?", ['weight', 'height', 'length'], 'hard'];
quiz_content['q10'] = ["select", "To figure out how far apart two things are, you need to figure out its...", ['distance', 'weight', 'height'], 'hard'];


//FOR FIRST question:
//pull a random quiz question... 
//_questionNumber will be random # to pull a random word from quiz_words
//quiz_content holds the question text and answer choices for the word in quiz_words 
quiz_doCover();


//for quiz only: set narrDone to nothing:
function narrDone(){}

//SOUNDS: path+filename of this storybook's multisound file (without extension)
var sndurl = 'sound/measure_quiz';

/*
//functions below are called at certain points in the main storybook js (rtlstorybook.js)
1: makeSounds() -- call makeSound() and define defintions in definitionText[]
2: make_storymanifest() -- defines the differnet image files that preload.js will load 
3: story_spritesheets() -- called by main js (rtlstorybook.js)'s make_spritesheet's function to create storybook specific ss
*/

function makeSounds(){
	// all timecodes are in seconds format... converted to milliseconds at runtime (onPlay event)
	
	//quiz sfx:
	makeSound('sfx_biscuits', 116.056104, 117.029715);
	makeSound('sfx_splat', 117.308417, 118.419256);
	makeSound('sfx_pie', 118.502263, 119.312165);
	makeSound('sfx_lazer', 119.481508, 121.524669);
	makeSound('sfx_wrong', 122.087919, 123.427938);


	//question-specific audio:
    console.log("making sounds");
	makeSound('q_q0', 0.495087, 3.701368);
	makeSound('q_qscene', 0.495087, 3.701368);
	makeSound('q_qconveyer', 0.495087, 3.701368);
	makeSound('q_qfootball', 0.495087, 3.701368);
	makeSound('q_qfootball1', 19.685622, 23.599171);
	makeSound('q_qfootball2', 30.719000, 35.174788);
	makeSound('q_qskywheel', 30.719000, 35.174788);
	makeSound('q_q6', 38.027435, 40.078511);
	makeSound('q_q7', 41.469472, 45.170840);
	makeSound('q_q9', 46.278893, 47.787731);
	makeSound('q_qblocklink', 0.495087, 3.701368, ["请", "连", "线"], [0.495087, 1.1, 2.2]);
	makeSound('q_qpiglink', 0.495087, 3.701368, ["请", "连", "线"], [0.495087, 1.1, 2.2]);
	makeSound('q_qpresenta', 0.495087, 3.701368, ["If ", "you want to measure the weight of something you use a "], [0.495087, 1.1]);
	makeSound('q_qpresentb', 0.495087, 3.701368, ["If ", "you want to measure the weight of something you use a "], [0.495087, 1.1]);
	makeSound('q_qblock', 4.856573, 8.793697);
	makeSound('q_qfruit', 4.856573, 8.793697);
	makeSound('q_qcard', 4.856573, 8.793697);
	makeSound('q_qstadium', 4.856573, 8.793697);
	makeSound('q_qscale', 4.856573, 8.793697);
	makeSound('q_qanimal', 4.856573, 8.793697);
	makeSound('q_qanimal1', 4.856573, 8.793697);
	makeSound('q_qanimal2', 30.719000, 35.174788);
	makeSound('q_qanimal3', 4.856573, 8.793697);
	makeSound('q_qanimal4', 4.856573, 8.793697);
    makeSound('q_qblock1', 4.856573, 8.793697);
    makeSound('q_qblock2', 30.719000, 35.174788);
    makeSound('q_qblock3', 4.856573, 8.793697);
    makeSound('q_qblock4', 4.856573, 8.793697);
	makeSound('q_qsupermarket', 4.856573, 8.793697);
	makeSound('q_qsupermarket1', 4.856573, 8.793697);
	makeSound('q_qsupermarket2', 30.719000, 35.174788);
	makeSound('q_qsupermarket3', 4.856573, 8.793697);
	makeSound('q_qsupermarket4', 4.856573, 8.793697);
	makeSound('q_qpresent1', 4.856573, 8.793697);
	makeSound('q_qpresent2', 30.719000, 35.174788);
	makeSound('q_qpresent3', 4.856573, 8.793697);
	makeSound('q_qpresent4', 4.856573, 8.793697);
	makeSound('q_qtrain', 0.495087, 3.701368, ["If ", "you want to measure the weight of something you use a "], [0.495087, 1.1]);
	makeSound('q_qtrain1', 4.856573, 8.793697);
    makeSound('q_qtrain2', 4.856573, 8.793697);
    makeSound('q_qtrain3', 4.856573, 8.793697);
    makeSound('q_qtrain4', 4.856573, 8.793697);
	makeSound('q_qstadium1', 4.856573, 8.793697);
    makeSound('q_qstadium2', 4.856573, 8.793697);
    makeSound('q_qstadium3', 4.856573, 8.793697);
    makeSound('q_qstadium4', 4.856573, 8.793697);
	makeSound('q_qcard1', 4.856573, 8.793697);
    makeSound('q_qcard2', 4.856573, 8.793697);
    makeSound('q_qcard3', 4.856573, 8.793697);
    makeSound('q_qcard4', 4.856573, 8.793697);
	makeSound('q_qfruit1', 4.856573, 8.793697);
    makeSound('q_qfruit2', 4.856573, 8.793697);
    makeSound('q_qfruit3', 4.856573, 8.793697);
    makeSound('q_qfruit4', 4.856573, 8.793697);
	makeSound('q_q2', 4.856573, 8.793697);
	makeSound('q_q21', 4.856573, 8.793697);
	makeSound('q_q22', 4.856573, 8.793697);
	makeSound('q_q3', 10.161081, 12.730821);
	makeSound('q_q4', 14.239659, 17.516667);
	makeSound('q_q8', 19.685622, 23.599171);
	makeSound('q_q5', 25.579521, 29.139435);
	makeSound('q_q10', 30.719000, 35.174788);
	makeSound('q_q11', 30.719000, 35.174788);
	makeSound('q_q6', 38.027435, 40.078511);
	makeSound('q_q7', 41.469472, 45.170840);
	makeSound('q_q9', 46.278893, 47.787731);
	makeSound('q_q13',0.44444,0.55555);
	makeSound('q_qfishing',0.44444,0.55555);


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
	makeSound('水星', 67.025416, 67.584555);
	makeSound('金星', 67.025416, 67.584555);
	makeSound('火星', 67.025416, 67.584555);
	makeSound('短', 68.109894, 68.675708);
	makeSound('中', 69.194371, 69.939889);
	makeSound('长', 70.184546, 70.942490);
	makeSound('train_whistle', 70.184546, 70.942490);
	makeSound('length ', 68.109894, 68.675708);
	makeSound('height', 69.194371, 69.939889);
	makeSound('speed', 70.184546, 70.942490);
	makeSound('distance', 71.304387, 72.348112);
	makeSound('temperature', 72.506742, 73.252260);
	makeSound('estimate', 73.544068, 74.115405);
	makeSound('compare', 115.797153,116.481301);
	makeSound('f_q0', 75.630509, 78.512319);
	makeSound('f_qpresenta', 75.630509, 78.512319);
	makeSound('f_qpresentb', 75.630509, 78.512319);
	makeSound('f_q2', 78.872153, 81.887586);
	makeSound('f_q21', 78.872153, 81.887586);
	makeSound('f_q22', 78.872153, 81.887586);
	makeSound('f_q3', 82.408492, 85.906000);
	makeSound('f_q4', 86.227739, 89.547433);
	makeSound('f_q5', 89.988046, 92.651904);
	makeSound('f_q6', 92.946783, 95.153372);
	makeSound('f_q7', 95.386857, 97.760293);
	makeSound('f_q8', 98.027324, 101.659857);
	makeSound('f_q9', 102.082326, 103.851766);
	makeSound('f_q10', 104.145191, 107.206568);
	makeSound('f_q11', 104.145191, 107.206568);
	makeSound('f_qrope', 104.145191, 107.206568);
	
	//required for quiz question outocomes:
	makeSound('empty', 4.5,4.6);
	makeSound('quizmo', 107.410411, 108.640050);
	makeSound('correct_1', 109.011801, 110.198546);
	makeSound('correct_2', 110.355825, 111.560707);
	makeSound('incorrect_1', 111.927255, 113.158259);
	makeSound('incorrect_2', 113.887464, 115.196398);	
}
