var pages = function(pages) {
    var frame, physics;
    
    pages.prep_0_bowl = function(transition){
    	//**//**console.log('function: prep_0_bowl');
    	world_current = worlds['0_bowl'];
    	
    	ticker_world = (function(){
    		tick_0_bowl();
    	});
    	end_world = (function(){
    		end_0_bowl();
    	});
    	narrDone = (function(){
    		//narrDone_3_butcher();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
        arrowbgLeft.visible = true;
    	arrowRight.visible = true;
        arrowbgRight.visible = true;
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);

    
        frame = new zim.Frame("fit", 1000, 800, "#FFF");
        init_bowl();
    
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_0_bowl);
    
    }
    
    function init_bowl() {
    	var stageW = frame.width;
    	var stageH = frame.height;
    
    	var assetPath = "img/measureup_story/0_bowl/";
    	frame.loadAssets(["bowlBacking.png", "bowl.png", "steam.png"], assetPath);
    	frame.on("complete", bowlReady, null, true);
    
    	function bowlReady() {
    
    		// 2. when loaded make the bowl, some steam and a food container
    		var air = new zim.Rectangle(stageW, stageH*.65, frame.yellow);
    		air.alpha = .95;
    		world_current.addChild(air);
    
    		var bowlBacking = frame.asset("bowlBacking.png");
    		bowlBacking.scale(.76).centerReg(world_current);
    		bowlBacking.y += 140;
    
    		var steam = frame.asset("steam.png");
    		steam.scale(.70).centerReg(world_current);
    		steam.y -= 240;
    		steam.animate({
    			obj:{alpha:0},
    			time:3000,
    			loop:true,
    			rewind:true
    		});
    
    		var food = new zim.Container(stageW,stageH);
    		food.on("mousedown",function(){});
    		world_current.addChild(food);
    
    		var steam2 = steam.clone();
    		steam2.scale(.70).centerReg(world_current);
    		steam2.y -= 160;
    		steam2.x -= 50;
    		steam2.alpha = 0;
    		steam2.rotation = 180;
    		steam2.animate({
    			obj:{alpha:1},
    			time:3000,
    			props:{loop:true, rewind:true}
    		});
    
    		var bowl = frame.asset("bowl.png");
    		bowl.scale(.76).centerReg(world_current);
    		bowl.alpha = .8
    		bowl.y += 160;
    
    		frame.loadAssets([
    			"carrot1.png", "carrot2.png",
    			"mushroom1.png", "mushroom2.png", "mushroom3.png",
    			"cellery1.png", "cellery2.png", "cellery3.png",
    		], assetPath);
    
    		var ingredients = [];
    		frame.on("assetload", function(e){
    
    			// 3. load in the ingredients into an array
    			ingredients.push(e.asset);
    
    			// 4. once one ingredient is in the array start the app
    			// add the asset to the ingredient list
    			// and if this is the first asset, it goes through to start the app
    			// otherwise if it is a subsequent ingredient it exits the function
    			if (ingredients.length>1) return;
    
    			// 5. define the borders
    			var fromBottom = 150;
    			var borders = {x:0, y:0, width:stageW, height:stageH-fromBottom};
    
    			// 6. make a physics.World and pass in the frame and borders
    			physics = new zim.Physics(frame, borders);
    			var world = physics.world;
    			var scale = physics.scale;
    
    			// 7. remove borders we do not need
    			// could have left the sides in but decided not to
    			// but must remove the top to let the ingredients fall in
    			physics.remove(physics.borderTop);
    			physics.remove(physics.borderLeft);
    			physics.remove(physics.borderRight);
    
    			// 8. create a b2BuoyancyController with desired properties
    			var bc = new b2BuoyancyController();
    			bc.normal.Set(0,-1);
    			bc.offset = -stageH/2/physics.scale;
    			bc.density = 3;
    			bc.linearDrag = 3;
    			bc.angularDrag = 2;
    			world.AddController(bc);
    
    			// 9. in an interval add a bunch of ingredients
    			var count = 0;
    			var interval = setInterval(function() {
    				count++;
    				addIngredient(zim.rand(300, stageW-300));
    				if (count > 8) clearInterval(interval);
    			}, 300);
    
    			// 10. make the addIngredient function work on mouse and key down
    			air.on("mousedown", addIngredient);
    
    			var s = .4; // ingredient scale
    			var reduce = .9; // make hit area a little smaller
    			function addIngredient(loc) {
    				// 11. make a ZIM ingredient from a shuffled array
    				// we randomize array and then pick first element
    				// could also use ingredients[zim.rand(ingredients.length-1)]
    				var ing = zim.shuffle(ingredients)[0].clone();
    
    				// 12. based on the ingredient, make a physics Box2D body
    				var body;
    				if (ing.id.match(/mushroom/i)) {
    					body = physics.makeCircle(ing.width*s/2*reduce, true, 1, 2, 2);
    				} else if (ing.id.match(/carrot/i)) {
    					body = physics.makeCircle(ing.width*s/2, true, 1, 1, 2.4);
    				} else {
    					body = physics.makeRectangle(ing.width*s*reduce, ing.height*s*reduce, true, 1, 2, 2.7);
    				}
    
    				// 13. position and rotate the body
    				body.x = (typeof loc == "number") ? loc : stage.mouseX+zim.rand(-5,5);
    				body.y = -100;
    				body.rotation = zim.rand(360);
    
    				// 14. spin the body with an impulse force
    				// will push in the y direction a random positive or negative force
    				// that is between 5 and 10 and 600 off to the side
    				// this is because this version of Box2D does not have impulseTorque
    				var force = (zim.rand(1)==0?1:-1)*zim.rand(5,10);
    				body.ApplyImpulse(new b2Vec2(0,force), body.GetWorldPoint(new b2Vec2(600,0)));
    
    				// 15. add the centerReg ZIM ingredient to the food container
    				// note that zim.scale returns the object being scaled
    				ing.scale(s).centerReg(food);
    
    				// 16. map the ZIM ingredient to the Box2D body
    				physics.addMap(body, ing);
    			}
    
    			// MAKING BOWL
    			// 17. use traditional Box2D to make a custom bowl body
    			// fun wow!  This is what the ZIM physics.js is abstracing
    			var bowlDef = new b2BodyDef();
    			bowlDef.type = b2Body.b2_staticBody;
    			var bowlBody = world.CreateBody(bowlDef);
    			var bowlShape = new b2PolygonShape();
    			var points = [];
    			var bTopW = 500;
    			var bBotW = 400;
    			var bHeight = stageH/2-fromBottom;
    			points[0] = new b2Vec2(0/scale, 0/scale);
    			points[3] = new b2Vec2(bTopW/scale, 0/scale);
    			points[2] = new b2Vec2((bTopW-(bTopW-bBotW)/2)/scale, bHeight/scale);
    			points[1] = new b2Vec2((bTopW-bBotW)/2/scale, bHeight/scale);
    			bowlBody.x = (stageW-bTopW)/2;
    			bowlBody.y = stageH/2;
    			bowlBody.SetPosition(new b2Vec2(bowlBody.x/scale,bowlBody.y/scale));
    			bowlShape.SetAsArray(points, points.length);
    			var bowlFixture = new b2FixtureDef();
    
    			// 18. set the bowl as a sensor (will no longer physically interact)
    			bowlFixture.isSensor = true
    			bowlFixture.shape = bowlShape;
    			bowlBody.CreateFixture(bowlFixture);
    
    			// 19. create physic rectangles for edges of bowl
    			// includes various fudge values
    			// use debug mode to get physics
    			// then stretch bowl graphic in image editor (i.e. photoshop)
    			var bowlLeftBody = physics.makeRectangle(10, bHeight*1.2, false)
    			bowlLeftBody.x = bowlBody.x + (bTopW-bBotW)/2/2 - 6;
    			bowlLeftBody.y = bowlBody.y + bHeight/2 - 22;
    			bowlLeftBody.rotation = -11;
    
    			var bowlRightBody = physics.makeRectangle(10, bHeight*1.2, false)
    			bowlRightBody.x = bowlBody.x + bTopW - (bTopW-bBotW)/2/2 + 6;
    			bowlRightBody.y = bowlBody.y + bHeight/2 - 22;
    			bowlRightBody.rotation = 11
    
    			var contactListener = new b2ContactListener();
    			contactListener.BeginContact = function(e) {
    				if (e.m_fixtureA.m_isSensor || e.m_fixtureB.m_isSensor) {
    					if (e.m_fixtureA.m_isSensor) {
    						bc.AddBody(e.m_fixtureB.GetBody());
    					} else {
    						bc.AddBody(e.m_fixtureA.GetBody());
    					}
    				}
    			}
    
    			contactListener.EndContact = function(e) {
    				if (e.m_fixtureA.m_isSensor || e.m_fixtureB.m_isSensor) {
    					if (e.m_fixtureA.m_isSensor) {
    						bc.RemoveBody(e.m_fixtureB.GetBody());
    					} else {
    						bc.RemoveBody(e.m_fixtureA.GetBody());
    					}
    				}
    			}
    			// set the contact listener on the world
    			world.SetContactListener(contactListener);
    
    			// MOUSE
    			// 22. set optional mouse dragging
    			setTimeout(function() {physics.drag();}, 1000);

    		}); // end first ingredient added

    
    	} // end bowlReady
    
    }
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_0_bowl(){
    	//**//**console.log("WORLD 0 BEGIN");
    	
    	//FIX FOR ANDROID: play ~100ms of silence muted before playing actual bowl audio
        var empty0 =  sounds['empty'][0] * 1000;
        var empty1 =  sounds['empty'][1] * 1000;
        soundManager.mute('multisound');
    	playFromTo(empty0, empty1, audio_0_bowl);     
    }
    
    function audio_0_bowl(){
    	soundManager.unmute('multisound');
    	playSound('0_bowl');
    }
    
    
    function tick_0_bowl(){
        physics.update();
    	stage.update();
    }
    
    function end_0_bowl(){
    	//**//**console.log('end_0_bowl');	
    	createjs.Ticker.removeEventListener(ticker_world);
    }
    
        return pages;
} (pages || {} );
