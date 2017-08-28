var pages = function(pages) {
    var world = new b2World(new b2Vec2(0, 20), true); // top view - no gravity, allow sleep
    var mapManager, debug;
    var dropThings = new createjs.Container();
    var objects = [];
    var nObject = 0, nextObject;
    var physics;
    var objectInterval = 200, timer= 600, SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;
    var stickBody;
    
    pages.prep_0_seesaw = function(transition){
    	//**//**console.log('function: prep_0_seesaw');
    	world_current = worlds['0_seesaw'];
    	
    	ticker_world = (function(){
    		tick_0_seesaw();
    	});
    	end_world = (function(){
    		end_0_seesaw();
    	});
    	narrDone = (function(){
    		//narrDone_3_butcher();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = false;
    	arrowRight.visible = true;
    
        init_seesaw();
    
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_0_seesaw);
    }
    
    function init_seesaw() {
                var rockFixtureDef, ballFixtureDef, watermelonFixtureDef;
                var rockBodyDef, ballBodyDef, watermelonBodyDef;
    			var canvas = zid('debugCanvas');
    			var stageW = canvas.width;
    			var stageH = canvas.height;
    
    			debug = new phys.Debug(canvas, world, SCALE);
    
    			var barW = 267 / SCALE;
    			var barH = 20 / SCALE;
    
    			//LAND SKELETON
    			//LEFT BAR
    			//1) making the skeleton of my object
    			var leftLandBodyDef = new b2BodyDef();
    			leftLandBodyDef.type = b2Body.b2_staticBody;
    			//position the skeleton
    			leftLandBodyDef.position.Set(132/SCALE, 470/SCALE);
    			leftLandBodyDef.angle = 170*Math.PI/180;
    
    			//2) adding it to the 2D world
    			var leftLandBody = world.CreateBody(leftLandBodyDef);
    			leftLandBody.SetUserData("land"); //need to name an object if you want to do an if statement
    			var leftLandBox = new b2PolygonShape();
    			//set the size
    			leftLandBox.SetAsBox(barW/2, barH/2);
    
    			//3) fixture: density and friction
    			var leftLandFixtureDef = new b2FixtureDef();
    			leftLandFixtureDef.shape = leftLandBox;
    			leftLandFixtureDef.density = 0.1;
    			leftLandFixtureDef.friction = 0.8;
    			leftLandFixtureDef.restitution = 0.1;
    			leftLandBody.CreateFixture(leftLandFixtureDef);
    
    			//MIDDLE BAR
    			//1) making the skeleton of my object
    			var middleLandBodyDef = new b2BodyDef();
    			middleLandBodyDef.type = b2Body.b2_staticBody;
    			//position the skeleton
    			middleLandBodyDef.position.Set(400/SCALE, 447/SCALE);
    			middleLandBodyDef.angle = 180*Math.PI/180;
    
    			//2) adding it to the 2D world
    			var middleLandBody = world.CreateBody(middleLandBodyDef);
    			middleLandBody.SetUserData("land"); //need to name an object if you want to do an if statement
    			var middleLandBox = new b2PolygonShape();
    			//set the size
    			middleLandBox.SetAsBox(barW/2, barH/2);
    
    			//3) fixture: density and friction
    			var middleLandFixtureDef = new b2FixtureDef();
    			middleLandFixtureDef.shape = middleLandBox;
    			middleLandFixtureDef.density = 0.1;
    			middleLandFixtureDef.friction = 0.8;
    			middleLandFixtureDef.restitution = 0.1;
    			middleLandBody.CreateFixture(middleLandFixtureDef);
    
    			//RIGHT BAR
    			//1) making the skeleton of my object
    			var rightLandBodyDef = new b2BodyDef();
    			rightLandBodyDef.type = b2Body.b2_staticBody;
    			//position the skeleton
    			rightLandBodyDef.position.Set(667/SCALE, 472/SCALE);
    			rightLandBodyDef.angle = 10*Math.PI/180;
    
    			//2) adding it to the 2D world
    			var rightLandBody = world.CreateBody(rightLandBodyDef);
    			rightLandBody.SetUserData("land"); //need to name an object if you want to do an if statement
    			var rightLandBox = new b2PolygonShape();
    			//set the size
    			rightLandBox.SetAsBox(barW/2, barH/2);
    
    			//3) fixture: density and friction
    			var rightLandFixtureDef = new b2FixtureDef();
    			rightLandFixtureDef.shape = rightLandBox;
    			rightLandFixtureDef.density = 0.1;
    			rightLandFixtureDef.friction = 0.8;
    			rightLandFixtureDef.restitution = 0.1;
    			rightLandBody.CreateFixture(rightLandFixtureDef);
    
    			//SEESAW
    			//making the base
    			var baseW= 55 / SCALE;
    			var baseH= 120 / SCALE;
    
    			var baseBodyDef = new b2BodyDef();
    			baseBodyDef.type = b2Body.b2_staticBody;
    			baseBodyDef.position.Set(stageW/2 / SCALE, 430 / SCALE);
    			var baseBody =  world.CreateBody(baseBodyDef);
    			var baseBox =  new b2PolygonShape();
    			baseBox.SetAsBox(baseW/2, baseH/2);
    
    			var baseFixtureDef = new b2FixtureDef();
    			baseFixtureDef.shape=baseBox;
    			baseFixtureDef.density = 1;
    			baseFixtureDef.friction = 1;
    			baseBody.CreateFixture(baseFixtureDef);
    
    			//making the stick
    			var stickW = 680 / SCALE;
    			var stickH = 28 / SCALE;
    
    			var stickBodyDef = new b2BodyDef();
    			stickBodyDef.type = b2Body.b2_dynamicBody;
    			stickBodyDef.position.Set(stageW/2 / SCALE, 380 / SCALE);
    			stickBody = world.CreateBody(stickBodyDef);
    			var stickFixtureDef =  new b2FixtureDef();
    			stickFixtureDef.density = 1;
    			stickFixtureDef.friction = 1;
    			var stickBox = new b2PolygonShape();
    			//setting the size
    			stickBox.SetAsBox(stickW/2, stickH/2);
    			stickFixtureDef.shape = stickBox;
    			stickBody.CreateFixture(stickFixtureDef);
    
    			//left handle
    			var leftHandleW = 19 / SCALE;
    			var leftHandleH = 55 / SCALE;
    
    			var leftHandleBox = new b2PolygonShape();
    			//set the size
    			leftHandleBox.SetAsOrientedBox(leftHandleW/2, leftHandleH/2, new b2Vec2(stickW/2-615/SCALE, -leftHandleH/2-13/SCALE));
    
    			//3) fixture: density and friction
    			stickFixtureDef.shape = leftHandleBox;
    			stickBody.CreateFixture(stickFixtureDef);
    
    			//right handle
    			var rightHandleW = 19 / SCALE;
    			var rightHandleH = 55 / SCALE;
    
    			var rightHandleBox = new b2PolygonShape();
    			//set the size
    			rightHandleBox.SetAsOrientedBox(rightHandleW/2, rightHandleH/2, new b2Vec2(stickW/2-60/SCALE, -rightHandleH/2-13/SCALE));
    
    			//3) fixture: density and friction
    			stickFixtureDef.shape = rightHandleBox;
    			stickBody.CreateFixture(stickFixtureDef);
    
    			//MAKING SKELETON OF BALL
    			var ballW = 110 / SCALE;
    			var ballH = 110 / SCALE;
    
    			ballBodyDef = new b2BodyDef();
    			ballBodyDef.type = b2Body.b2_dynamicBody;
    
    			//ballBodyDef.position.Set(zim.rand(ballW,stageW/SCALE-ballW), -ballH);
    
    			var ballBody;
    
    			ballFixtureDef =  new b2FixtureDef();
    			ballFixtureDef.density = 1; //higher the number "heavier" it is
    			ballFixtureDef.friction = 0.4; //between 0~1
    			ballFixtureDef.restitution = 0.8//0~1
    
    			var ballBox = new b2CircleShape();
    			//setting the size
    			ballBox.SetRadius(ballW/2);
    			ballFixtureDef.shape = ballBox;
    
    			//MAKING WATERMELON SKELETON
    			var waterMelonW = 83/2 / SCALE;
    			var waterMelonH = 83/2 / SCALE;
    
    			waterMelonBodyDef = new b2BodyDef();
    			waterMelonBodyDef.type = b2Body.b2_dynamicBody;
    
    			//waterMelonBodyDef.position.Set(zim.rand(waterMelonW,stageW/SCALE-waterMelonW), -waterMelonH);
    
    			var waterMelonBody;
    
    			waterMelonFixtureDef =  new b2FixtureDef();
    			waterMelonFixtureDef.density = 60; //higher the number "heavier" it is
    			waterMelonFixtureDef.friction = 0.8; //between 0~1
    			waterMelonFixtureDef.restitution = 0.1//0~1 (higher the number bouncier)
    
    			//making a custom shape -
    			var waterMelonBox = new b2PolygonShape();
    			var verticesVec = new Vector(); //this new vector is like an array and you put all the verticles(points) in it
    
    			//vertices: 1)how many points
    			var vertices = 300;
    			//2) angle: angles between each verticles ex. 360degree of circle divided by 300 vertices
    			var angles = 360 / vertices; //angles of each vertices
    			var deg, rad, vecX, vecY;
    
    			//making a for loop to create all the vector by connecting the vertices
    			for(var i=0; i<vertices/2; i++){ //dividing vertices in half makes half circle #1/2
    				//calculating the first vertices degree
    				deg = i*angles;
    				rad = deg*(Math.PI/180);
    				vecX = waterMelonW*Math.cos(rad);
    				vecY = waterMelonH*Math.sin(rad);
    				verticesVec.push(new b2Vec2(vecX, vecY));
    			}
    			//verticesVec contains all the points(x&y and info of each point), vertices is how many you have
    			waterMelonBox.SetAsVector(verticesVec, vertices/2); //half circle#2/2
    			waterMelonFixtureDef.shape = waterMelonBox;
    			//waterMelonBody.CreateFixture(waterMelonFixtureDef);
    
    
    			//ROCK SKELETON
    			var rockW = 83/2 / SCALE;
    			var rockH = 83/2 / SCALE;
    
    			rockBodyDef = new b2BodyDef();
    			rockBodyDef.type = b2Body.b2_dynamicBody;
    
    			//rockBodyDef.position.Set(zim.rand(rockW,stageW/SCALE-rockW), -rockH);
    
    			var rockBody;
    
    			rockFixtureDef =  new b2FixtureDef();
    			rockFixtureDef.density = 80; //higher the number "heavier" it is
    			rockFixtureDef.friction = 0.1; //between 0~1
    			rockFixtureDef.restitution = 0.1//0~1 (higher the number bouncier)
    
    			//making a custom shape -
    			var rockBox = new b2PolygonShape();
    			var verticesVec = new Vector(); //this new vector is like an array and you put all the verticles(points) in it
    
    			//making all the points for rock
    			//in the bracket(x position, y position)
    			verticesVec.push(new b2Vec2(-8 / SCALE, -22 / SCALE));
    			verticesVec.push(new b2Vec2(17 / SCALE, -18 / SCALE));
    			verticesVec.push(new b2Vec2(20 / SCALE, -15 / SCALE));
    			verticesVec.push(new b2Vec2(26 / SCALE, -3 / SCALE));
    			verticesVec.push(new b2Vec2(21 / SCALE, 7 / SCALE));
    			verticesVec.push(new b2Vec2(15 / SCALE, 12 / SCALE));
    			verticesVec.push(new b2Vec2(6 / SCALE, 22 / SCALE));
    			verticesVec.push(new b2Vec2(-12 / SCALE, 17 / SCALE));
    			verticesVec.push(new b2Vec2(-26 / SCALE, 6 / SCALE));
    			verticesVec.push(new b2Vec2(-19 / SCALE, -14 / SCALE));
    
    
    			//verticesVec contains all the points(x&y and info of each point), vertices is how many you have
    			rockBox.SetAsVector(verticesVec, 10); //half circle#2/2
    			rockFixtureDef.shape = rockBox;
    
    			//after the last object put all the objects in an array - this is for function that will make the objects appear
    			objects = [
    				{ //beach ball
    					"name": "ball",
    					"body": ballBody,
    					"bodyDef": ballBodyDef,
    					"fix": ballFixtureDef,
    					"regX": 55,
    					"regY": 55
    				},
    				{	//watermelon
    					"name": "watermelon",
    					"body": waterMelonBody,
    					"bodyDef": waterMelonBodyDef,
    					"fix": waterMelonFixtureDef,
    					"regX": 83/2,
    					"regY": (83/2)/2
    				},
    				{ //rock
    					"name": "rock",
    					"body": rockBody,
    					"bodyDef": rockBodyDef,
    					"fix": rockFixtureDef,
    					"regX": 52/2,
    					"regY": 45/2
    				}
    			]
    
    			//JOINT BETWEEN BASE + STICK
    			//creating the joint
    			var jointDef = new b2RevoluteJointDef();
    			jointDef.Initialize(baseBody, stickBody, new b2Vec2(stageW/2 / SCALE, 420 / SCALE));
    			var joint = world.CreateJoint(jointDef);
    
    			//CreateJS
    
    			// MapManager records all the mappings between Box2D and CreateJS
    			// we will add a Map object for each object in the world
    			mapManager = new phys.MapManager();
    
    			//container with all the dropping items
    			dropThings = new createjs.Container();
    
    			var land= new zim.Circle(530,"#548754");
    			land.regY=480;
    			land.scaleY=0.3;
    
    			world_current.addChild(land);
    			world_current.addChild(dropThings);
    			mapManager.add(new phys.Map(middleLandBody, land, "land", SCALE));
    
    			//making objects fall randomly by creating a function
    			var nObject = 0;
    
    			//timer is when I want the first item to drop
                nextObject = zim.rand(timer-objectInterval,timer);
    
    			//interval between each objects must be atleast 70 miliseconds
    			var objectInterval = 200;
    
    			//next object will fall between (here, and here) basically: here - and here. the number here is the amount of time when the next item will drop
    			//zim.rand is in square brackets because its in an array. objects.length=3 so need to minus 1,and it becomes 0,1,2
    			addObjects(objects[zim.rand(0,objects.length-1)]);
    
    			//seesaw image
    			var seesaw =  new createjs.Bitmap(story_preload.getResult("seesaw"));
    			seesaw.regX = 680/2;
    			seesaw.regY = 65;
    			world_current.addChild(seesaw);
    			mapManager.add(new phys.Map(stickBody, seesaw, "seesaw", SCALE));
    
    			//base image
    			var base =  new createjs.Bitmap(story_preload.getResult("base"));
    			base.regX = 82/2;
    			base.regY = 90;
    			world_current.addChild(base);
    			mapManager.add(new phys.Map(baseBody, base, "base", SCALE));
    }
    
    function addObjects(obj){
    	console.log(obj.name);
    	//create variable to make it easier to name them-nickname basically
    	var objectBody = obj.body;
    	var objectBodyDef = obj.bodyDef;
    	var objectFixture = obj.fix;
    	//bringing in the object images
    	var object = new createjs.Bitmap(story_preload.getResult(obj.name)); //this adds the image into the skeleton
    	object.regX = obj.regX;
    	object.regY = obj.regY;
    	//setting the position of box2D body
    	objectBodyDef.position.Set(Math.random()*stage.canvas.width/SCALE, 20);
    	//adding the body to the world
    	objectBody = world.CreateBody(objectBodyDef);
    	//put all the fixture in the body-physics properties in the body
    	objectBody.CreateFixture(objectFixture);
    	//adding the createjs to the stage
    	dropThings.addChild(object);
    	//making each object have unique name
    	nObject++;
    	mapManager.add(new phys.Map(objectBody, object, "eachObject"+nObject, SCALE));
    	//physics.addMap(objectBody, object);
        //physics.drag();
    }
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_0_seesaw(){
    	//**//**console.log("WORLD 0 BEGIN");
    	
    	//FIX FOR ANDROID: play ~100ms of silence muted before playing actual seesaw audio
        var empty0 =  sounds['empty'][0] * 1000;
        var empty1 =  sounds['empty'][1] * 1000;
        soundManager.mute('multisound');
    	playFromTo(empty0, empty1, audio_0_seesaw);     
    }
    
    function audio_0_seesaw(){
    	soundManager.unmute('multisound');
    	playSound('0_seesaw');
    }
    
    
    function tick_0_seesaw(){
    	//run the timer
    	timer--;
    	if (timer<= nextObject){
    		addObjects(objects[zim.rand(0, objects.length-1)]);
    		nextObject = zim.rand(timer-objectInterval,timer);
    	}
    
    	world.Step(TIMESTEP, 10, 10);
    	world.ClearForces();
        debug.update();
    	mapManager.update(); // note, the added update for the maps after stepping
    	stage.update();
    }
    
    function end_0_seesaw(){
    	//**//**console.log('end_0_seesaw');	
    	createjs.Ticker.removeEventListener(ticker_world);
        world_current.removeAllChildren();
        physics.remove(stickBody);
        physics.dispose();
    }
    return pages;
}(pages || {});
