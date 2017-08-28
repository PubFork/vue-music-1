var scale, scaleTrays, scaleReadings, scaleObjects, dynamicObjects;
var frame, physics, mapManager, debug, world, physicsScale;

function prep_quizmoscale(transition){
	////**console.log('function: prep_quizmoscale');
	//world_current = worlds['quizmoscale'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmoscale();
	});
	end_world = (function(){
		end_quizmoscale();
	});
	narrDone = (function(){
		narrDone_quizmoscale();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmoscale();
	});

	//if game, visible = false. if storybook, visible = true
	arrowLeft.visible = false;
	arrowRight.visible = false;
	arrowbgLeft.visible=false;
	arrowbgRight.visible=false;
	
	_quizActive = false;
	isCorrect=false;
    rightAnswer = 0;

    scale_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmoscale);
}


function scale_init() {
    scaleTrays = [];
    scaleReadings = [];
    dynamicObjects = [];
	//adding background color (shape) or image (bitmap, and white border (bitmap)
	bg = new createjs.Bitmap(images['quizmo_bg']);
    bg.on("click", addObject);
	world_current.addChild(bg);
    frame = new zim.Frame("fit", 1000, 800, "#FFF");
    var borders = {x:0, y:0, width: canvas.width, height:canvas.height-100};
    physics = new zim.Physics(frame, borders);
    world = physics.world;
    physics.debug();
    physicsScale = physics.scale;
    console.log(physicsScale);
    physics.remove(physics.borderTop);
    physics.remove(physics.borderLeft);
    physics.remove(physics.borderRight);

    var groundBody = physics.makeRectangle(canvas.width, 20, false)
	var ground = new createjs.Bitmap(images['scale-ground']);
    world_current.addChild(ground);
    physics.addMap(groundBody, ground);
    groundBody.x = canvas.width / 2;
    groundBody.y = 500;

	scale = new createjs.Bitmap(images['quizmo_scale']);
	scale.scaleX = 0.8;
	scale.scaleY = 0.8;
	scale.regX = scale.image.width / 2;
	scale.regY = 0; 
    scaleBody = physics.makeRectangle(scale.image.width*scale.scaleX, 20, true, 1, 2, 2.7);
	scaleBody.x = canvas.width / 2; 
	scaleBody.y = 400; 
    world_current.addChild(scale);
    physics.addMap(scaleBody, scale);

	var scaleBase = new createjs.Bitmap(images['quizmo_scale_base']);
	scaleBase.scaleX = 0.8;
	scaleBase.scaleY = 0.8;
	scaleBase.regX = scaleBase.image.width / 2;
	//scaleBase.regY = scaleBase.image.height * scaleBase.scaleY /2;
	//scaleBase.x = canvas.width/2;
    var scaleBaseBody = physics.makeRectangle(20, 100, false, 1, 2, 2.7);
    scaleBaseBody.x = canvas.width/2 - 10;
	scaleBaseBody.y = 400; 
    world_current.addChild(scaleBase);
    physics.addMap(scaleBaseBody, scaleBase);

	var scaleTray1 = new createjs.Bitmap(images['quizmo_scale_tray']);
    scaleTray1.scaleX = scaleTray1.scaleY = 0.8;
    scaleTray1.regX = scaleTray1.image.width / 2;
	//scaleTray1.x = 200;
	//scaleTray1.y = 300; 
    var trayBody1  = physics.makeRectangle(100, 20, true)
    world_current.addChild(scaleTray1);
    physics.addMap(trayBody1, scaleTray1);
    //trayBody1.x = 100;
    //trayBody1.y = 200;
    
    var trayWeldJoint1 = new b2WeldJointDef();
    trayWeldJoint1.bodyB = trayBody1;
    trayWeldJoint1.bodyA = scaleBody;
    //connect the centers - center in local coordinate - relative to body is 0,0
    trayWeldJoint1.localAnchorA = new b2Vec2(-10, -1);
    trayWeldJoint1.localAnchorB = new b2Vec2(0, 0);
    //joint_def.referenceAngle = 0 * Math.PI / 3;
    world.CreateJoint(trayWeldJoint1);

	var scaleTray2 = scaleTray1.clone() 
    scaleTray2.scaleX = scaleTray2.scaleY = 0.8;
    scaleTray2.regX = scaleTray2.image.width / 2;
    var trayBody2  = physics.makeRectangle(100, 20, true)
    world_current.addChild(scaleTray2);
    physics.addMap(trayBody2, scaleTray2);
    //trayBody2.x = 600;
    //trayBody2.y = 200;
    
    var trayWeldJoint2 = new b2WeldJointDef();
    trayWeldJoint2.bodyB = trayBody2;
    trayWeldJoint2.bodyA = scaleBody;
    //connect the centers - center in local coordinate - relative to body is 0,0
    trayWeldJoint2.localAnchorA = new b2Vec2(10, -1);
    trayWeldJoint2.localAnchorB = new b2Vec2(0, 0);
    //joint_def.referenceAngle = 0 * Math.PI / 3;
    world.CreateJoint(trayWeldJoint2);
    scaleTrays.push(scaleTray1);
    scaleTrays.push(scaleTray2);

    var jointDef = new b2RevoluteJointDef();
    jointDef.Initialize(scaleBaseBody, scaleBody, scaleBody.GetWorldCenter());
    var joint = world.CreateJoint(jointDef);

    var objectImgs = quiz_content[qWord][1];
    for (var i = 0; i < objectImgs.length; i++) {
        var objectImg = objectImgs[i];
        var image = new Image();
        image.xOffset = objectImg.x;
        image.yOffset = objectImg.y;
        image.weight = objectImg.weight;
        image.onload = function(objectImg) {
            var bmp = new createjs.Bitmap(this);
            bmp.x = this.xOffset;
            bmp.y = this.yOffset;
            console.log(bmp.x + ":" + bmp.y);
            bmp.startX = bmp.x;
            bmp.startY = bmp.y;
            bmp.weight = this.weight;
            //world_current.addChild(bmp);
            dynamicObjects.push(bmp);
        }
        image.src = objectImg.img;
    }

	//world_current.addChild(scale);
	//world_current.addChild(scaleBase);
	//world_current.addChild(scaleTray1);
	//world_current.addChild(scaleTray2);
    setTimeout(function() {physics.drag();}, 1000);
}


function addObject(evt) {
	var object = zim.shuffle(dynamicObjects)[0].clone();
    world_current.addChild(object);

	var body;
	body = physics.makeCircle(object.image.width/2, true, 1, 2, 2);

	body.x = evt.stageX; 
	body.y = -100;
	body.rotation = zim.rand(360);

	var force = (zim.rand(1)==0?1:-1)*zim.rand(5,10);
	body.ApplyImpulse(new b2Vec2(0,force), body.GetWorldPoint(new b2Vec2(600,0)));

	physics.addMap(body, object);
}


function objectOnScale(object, trayIdx, tray) {
    Util.disableDrag(object);
    object.trayId = trayIdx;
    console.log(object);
    object.on("click", freeback);
    scaleObjects[trayIdx].push(object);
    scaleWeight();
}


function freeback(event) {
    if (this.trayId == undefined || this.trayId == null)
        return;
    var index = scaleObjects[this.trayId].indexOf(this);
    if (index > -1) {
        scaleObjects[this.trayId].splice(index, 1);
        this.removeAllEventListeners("click");
        this.x = this.startX;
        this.y = this.startY;
        delete this.trayId;
        Util.objectDrag(this, scaleTrays, objectOnScale, null)
        scaleWeight();
    }
}

function scaleWeight() {
    var leftWeight = 0, rightWeight = 0;
    for (var idx = 0; idx < scaleObjects[0].length; idx++) {
        leftWeight += scaleObjects[0][idx].weight;
    }
    for (var idx = 0; idx < scaleObjects[1].length; idx++) {
        rightWeight += scaleObjects[1][idx].weight;
    }
    //scaleReadings[0].text = "" + leftWeight; 
    //scaleReadings[1].text = "" + rightWeight; 
    console.log(leftWeight + ":" + rightWeight);
    if (leftWeight > rightWeight) {
        scale.rotation = -15; 
        scaleTrays[0].y = 350;
        scaleTrays[1].y = 250;
    } else if (leftWeight < rightWeight) {
        scale.rotation = 15; 
        scaleTrays[0].y = 250;
        scaleTrays[1].y = 350;
    } else {
        scale.rotation = 0; 
        scaleTrays[0].y = 300;
        scaleTrays[1].y = 300;
    }
}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmoscale(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmoscale(){
	//**//**console.log("question has been read for quizmoscale");

	btnNarration.visible = false;
	//quizQ_fadein_left(true);

    console.log(allObjects);
    for (var idx = 0; idx < allObjects.length; idx++) {
        var weight = allObjects[idx];
        doPulse(weight);
        Util.objectDrag(weight, scaleTrays, objectOnScale, null)
    }

}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmoscale(){
	if(snd_active) btnNarration.visible = true;

	quiz_answerMouseOver(machine1);
	quiz_answerMouseOver(machine2);
	quiz_answerMouseOver(machine3);

}

function displayCorrectscale(machinePosition){
	
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

function displayIncorrectscale(machinePosition){
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

function tick_quizmoscale(){
    physics.update();
	stage.update();
}

function end_quizmoscale(){
	//**//**console.log('end_quizmoscale');	
	createjs.Ticker.removeEventListener(ticker_world);
}

