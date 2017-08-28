var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2World = Box2D.Dynamics.b2World,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,          
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

(function() {    
    var world = buildWorld();
    
    var leftBlock = buildBlock({world: world, x: 2, y: 8, width: 2, height: 12, static: true});
    var rightBlock = buildBlock({world: world, x: 12, y: 8, width: 2, height: 12, static: true});
    var bottomBlock = buildBlock({world: world, x: 7, y: 13, width: 8, height: 2, static: false});
    var box = buildBlock({world: world, x: 7, y: 10, width: 2, height: 2, static: false});
    
    var joint = buildPrismaticJoint({world: world, 
                                     anchorA: new b2Vec2(7, 13), 
                                     axis: new b2Vec2(0, 1), 
                                     bodyA: bottomBlock, 
                                     bodyB: world.GetGroundBody()});
    
    var debugDraw = buildDebugDraw(world);
    
    setInterval(function(){
        world.Step(1 / 60, 10, 10);
        world.DrawDebugData();
        world.ClearForces();
    },1000/60);
})();

function buildWorld() {    
    return new b2World(
        new b2Vec2(0, 10), //gravity vector
        true
    );
}

function buildBlock(state) {
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = .5;         
    fixDef.shape.SetAsBox(state.width / 2, state.height / 2);
    var bodyDef = new b2BodyDef;
    bodyDef.type = state.static?b2Body.b2_staticBody:b2Body.b2_dynamicBody;
    bodyDef.position.Set(state.x, state.y);
    var body = state.world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    return body;
}

//buildPrismaticJoint(world, 9, 15, 0, 1, bottomBlock, world.GetGroundBody());
function buildPrismaticJoint(state) {
    var jointDef = new b2PrismaticJointDef();
    jointDef.Initialize(state.bodyA, state.bodyB, state.anchorA, state.axis);
    jointDef.collideConnected = false;
    jointDef.lowerTranslation = 0.0;
    jointDef.upperTranslation = 5.0;
    jointDef.enableLimit = true;
    jointDef.maxMotorForce = 400.0;
    jointDef.motorSpeed = 3.0;
    jointDef.enableMotor = true;
    return state.world.CreateJoint(jointDef);
}

function buildDebugDraw(world) {
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("playground").getContext("2d"));
    debugDraw.SetDrawScale(20.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(
        b2DebugDraw.e_shapeBit | 
        b2DebugDraw.e_jointBit |
        b2DebugDraw.e_aabbBit |
        b2DebugDraw.e_pairBit |
        b2DebugDraw.e_centerOfMassBit |
        b2DebugDraw.e_controllerBit
    );
    world.SetDebugDraw(debugDraw);
    
    return debugDraw;
}
