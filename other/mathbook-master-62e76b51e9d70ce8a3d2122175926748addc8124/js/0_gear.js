
var pages = function(pages) {

    var frame, world, debug, physics; // top view - no gravity, allow sleep
    var objectInterval = 200, timer= 600, SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;
    var ground, mouse_joint;
    var canvasElm = document.getElementById("gameCanvas");
    var gear1, gear2;


    
    pages.prep_0_gear = function(transition){
    	//**//**console.log('function: prep_0_gear');
    	world_current = worlds['0_gear'];
    	
    	ticker_world = (function(){
    		tick_0_gear();
    	});
    	end_world = (function(){
    		end_0_gear();
    	});
    	narrDone = (function(){
    		//narrDone_3_butcher();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = false;
    	arrowRight.visible = true;
    
        init_gear();
    
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_0_gear);
    }
    
    function init_gear() {
        var stageW = stage.canvas.width;
        var stageH = stage.canvas.height;
        frame = new zim.Frame("fit", stageW, stageH, "#000");
        var borders = {x:0, y:0, width:stageW, height:stageH};
        physics = new zim.Physics(frame, borders);
    
    	var canvas = zid('debugCanvas');
        var m_gravity = new b2Vec2(0.0,0.0);
        world = new b2World(m_gravity, true);
    	debug = new phys.Debug(canvas, world, SCALE);
    
        var fixDef1 = new b2FixtureDef;
        fixDef1.density = 1.0;
        fixDef1.friction = 1;
        fixDef1.restitution = 0.2;
        var fixDef2 = new b2FixtureDef;
        fixDef2.density = 1.0;
        fixDef2.friction = 1;
        fixDef2.restitution = 0.2;
        var groundDef = new b2FixtureDef;
        groundDef.density = 1.0;
        groundDef.friction = 1;
        groundDef.restitution = 0.2;
    
        var m_jointDef1 = new b2RevoluteJointDef();
        var m_jointDef2 = new b2RevoluteJointDef();
        var bd1 = new b2BodyDef();
        bd1.position.x = 5;
        bd1.position.y = 10;
        //create dynamic circle object
        bd1.type = b2Body.b2_dynamicBody;
        var bd2 = new b2BodyDef();
        bd2.position.x = 13;
        bd2.position.y = 10;
        //create dynamic circle object
        bd2.type = b2Body.b2_dynamicBody;
        fixDef1.shape = new b2CircleShape(
           5 
        );
        fixDef2.shape = new b2CircleShape(
           3 
        );
        var ground_bd = new b2BodyDef();
        ground_bd.type = b2Body.b2_staticBody;
        groundDef.shape = new b2PolygonShape;
        groundDef.shape.SetAsBox(20, 2);
        ground_bd.position.Set(stageW/SCALE/2, stageH/SCALE);
        //create dynamic circle object
    
        gear1 = world.CreateBody(bd1);
        gear1.CreateFixture(fixDef1);
        gear1.SetUserData("gear1");
    
        //gear.SetMassFromShapes();
    	var circle1 = new createjs.Bitmap(story_preload.getResult("gear")); //this adds the image into the skeleton
        circle1.scaleX = circle1.scaleY = 1.6;
        // var circle1 = new zim.Circle(150, "pink");
        world_current.addChild(circle1);
        circle1.cursor = "pointer";
        physics.addMap(gear1, circle1);
    
        gear2 = world.CreateBody(bd2);
        gear2.CreateFixture(fixDef2);
        gear2.SetUserData("gear2");
    
        ground = world.CreateBody(ground_bd);
        ground.CreateFixture(groundDef);
    
        //gear.SetMassFromShapes();
    	var circle2 = new createjs.Bitmap(story_preload.getResult("gear")); //this adds the image into the skeleton
        //var circle2 = new zim.Circle(90, "blue");
        world_current.addChild(circle2);
        //circle2.x = 200;
        //circle2.y = 100;
        circle2.cursor = "pointer";
        physics.addMap(gear2, circle2);
    
        /*m_jointDef1.bodyA = gear1;
        m_jointDef1.bodyB = ground;
        m_jointDef1.localAnchorA = new b2Vec2(0, 0);
        m_jointDef1.localAnchorB = new b2Vec2(15, 0);*/
        //m_jointDef.Initialize(world.GetGroundBody(), gear1, new b2Vec2(5,6.5));
        m_jointDef1.Initialize(ground, gear1, gear1.GetWorldCenter());
        var first_joint = world.CreateJoint(m_jointDef1)
    
        /*m_jointDef2.bodyA = gear2;
        m_jointDef2.bodyB = ground;
        m_jointDef2.localAnchorA = new b2Vec2(0, 0);
        m_jointDef2.localAnchorB = new b2Vec2(5, 0);*/
        m_jointDef2.Initialize(ground, gear2, gear2.GetWorldCenter());
        var second_joint = world.CreateJoint(m_jointDef2)
    
        var gear_joint = new b2GearJointDef();
        gear_joint.bodyA = gear1;
        gear_joint.bodyB = gear2;
        gear_joint.joint1 = first_joint;
        gear_joint.joint2 = second_joint;
        gear_joint.ratio = 0.6;
        var the_gear_joint = world.CreateJoint(gear_joint);
    
        // listeners
        //circle1.addEventListener("mousedown", createMouse);
        stage.on("pressmove", dragCircle);
        //circle2.on("pressmove", dragCircle);
        stage.on("pressup", destroyMouse);
        physics.update();
    }
    
    function dragCircle(e) {
        var mouse_x = stage.mouseX * canvasElm.getBoundingClientRect().width / 1024 / SCALE;
        var mouse_y = stage.mouseY * canvasElm.getBoundingClientRect().height / 672 /SCALE;
        var p = new b2Vec2(mouse_x, mouse_y);
         
        if(!mouse_joint) {
            var body = GetBodyAtMouse(mouse_x, mouse_y);
             
            if(body)
            {
                //if joint exists then create
                var def = new b2MouseJointDef();
                def.bodyA = ground;
                def.bodyB = body;
                def.target = p;
                 
                def.collideConnected = true;
                def.maxForce = 1000 * body.GetMass();
                def.dampingRatio = 0;
                 
                mouse_joint = world.CreateJoint(def);
                 
                body.SetAwake(true);
            }
        }
         
        if(mouse_joint)
        {
            mouse_joint.SetTarget(p);
        }
    }
    
    function destroyMouse(evt) {
        console.log("in destroy: " + mouse_joint);
        if (mouse_joint) {
            world.DestroyJoint(mouse_joint);
            mouse_joint = null;
        }
    }
    
    function GetBodyAtMouse(mouse_x, mouse_y) {
         
        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouse_x - 0.001, mouse_y - 0.001);
        aabb.upperBound.Set(mouse_x + 0.001, mouse_y + 0.001);
    	var mousePVec = new b2Vec2(mouse_x, mouse_y);
         
        var body = null;
         
        // Query the world for overlapping shapes.
        function GetBodyCallback(fixture) {
    		if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
    			if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                    var shape = fixture.GetShape();
                    body = fixture.GetBody();
                    return false;
                }
            }
            return true;
        }
        world.QueryAABB(GetBodyCallback, aabb);
        return body;
    }
    
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_0_gear(){
    	//**//**console.log("WORLD 0 BEGIN");
    	
    	//FIX FOR ANDROID: play ~100ms of silence muted before playing actual gear audio
        var empty0 =  sounds['empty'][0] * 1000;
        var empty1 =  sounds['empty'][1] * 1000;
        soundManager.mute('multisound');
    	playFromTo(empty0, empty1, audio_0_gear);     
    }
    
    function audio_0_gear(){
    	soundManager.unmute('multisound');
    	playSound('0_gear');
    }
    
    
    function tick_0_gear(){
    	//run the timer
    	world.Step(TIMESTEP, 10, 10);
    	world.ClearForces();
        debug.update();
    	//mapManager.update(); // note, the added update for the maps after stepping
    	stage.update();
    }
    
    function end_0_gear(){
    	//**//**console.log('end_0_gear');	
    	createjs.Ticker.removeEventListener(ticker_world);
        world_current.removeAllChildren();
        physics.remove(gear1);
        physics.remove(gear2);
        physics.dispose();
    }
    return pages;
} (pages || {} );
