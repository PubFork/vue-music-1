/**
    Make a rope in box2d in javascript
    Silver Moon (m00n.silv3r@gmail.com)
*/
var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2World = Box2D.Dynamics.b2World
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    , b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef
    ;
 
var world;
var ctx;
var canvas_width;
var canvas_height;
var mouse_pressed = false;
var mouse_joint = false;
var mouse_x, mouse_y;
var canvas_width_m, canvas_height_m;
 
//box2d to canvas scale , therefor 1 metre of box2d = 30px of canvas :)
var scale = 30;
 
//Draw a world, this method is called in a loop to redraw the world
function draw_world(world, context) 
{
    //convert the canvas coordinate directions to cartesian coordinate direction by translating and scaling
    ctx.save();
    ctx.translate(0 , canvas_height);
    ctx.scale(1 , -1);
    world.DrawDebugData();
    ctx.restore();
     
    //write some text
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px arial';
    ctx.fillText('Rope using box2d', canvas_width - 10, canvas_height - 10);
}
 
//Create box2d world object
function createWorld() 
{
    //Gravity vector x, y - 10 m/s2 - thats earth!!
    var gravity = new b2Vec2(0, -10);
     
    world = new b2World(gravity , true );
     
    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("playground").getContext("2d"));
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
     
    world.SetDebugDraw(debugDraw);
     
    //ceiling
    ground = ceiling = createBox(world, canvas_width_m / 2, canvas_height_m - 0.5, 16 , 1, {type : b2Body.b2_staticBody});
     
    var last_link = ceiling;
    var last_anchor_point = new b2Vec2(0, -0.5);
    var revolute_joint = new b2RevoluteJointDef();
     
    //height of rope elements, in metres ofcourse
    var r_height = 1.1;
     
    //rope
    for (var i = 1; i <= 10; i++) 
    {
        var body = createBox(world, canvas_width_m / 2 , canvas_height_m - 1 - i * 1.5, 0.25 , r_height);
         
        //revolute joint
        revolute_joint.bodyA = last_link;
        revolute_joint.bodyB = body;
        revolute_joint.localAnchorA = last_anchor_point;
        revolute_joint.localAnchorB = new b2Vec2(0 , r_height/2);
         
        last_anchor_point = new b2Vec2(0, -1 * r_height/2);
         
        //create the joint in world
        world.CreateJoint(revolute_joint);
         
        // saving the reference of the last placed link
        last_link = body;
    }
     
    var body = createBox(world, canvas_width_m / 2 , canvas_height_m - 1 - i * 1.5, r_height , r_height, {density : 5.0});
         
    //revolute joint
    revolute_joint.bodyA = last_link;
    revolute_joint.bodyB = body;
    revolute_joint.localAnchorA = last_anchor_point;
    revolute_joint.localAnchorB = new b2Vec2(0 , r_height/2);
     
    last_anchor_point = new b2Vec2(0, -1 * r_height/2);
     
    //create the joint in world
    world.CreateJoint(revolute_joint);
         
    return world;
}       
 
//Create standard boxes of given height , width at x,y
function createBox(world, x, y, width, height, options) 
{
     //default setting
    options = $.extend(true, {
        'density' : 1.0 ,
        'friction' : 1.0 ,
        'restitution' : 0.5 ,
         
        'type' : b2Body.b2_dynamicBody
    }, options);
       
    var body_def = new b2BodyDef();
    var fix_def = new b2FixtureDef();
     
    fix_def.density = options.density;
    fix_def.friction = options.friction;
    fix_def.restitution = options.restitution;
     
    fix_def.shape = new b2PolygonShape();
         
    fix_def.shape.SetAsBox( width/2 , height/2 );
     
    body_def.position.Set(x , y);
     
    body_def.type = options.type;
    body_def.userData = options.user_data;
     
    var b = world.CreateBody( body_def );
    var f = b.CreateFixture(fix_def);
     
    return b;
}
 
/*
    This method will draw the world again and again
    called by settimeout , self looped
*/
function step() 
{
    var fps = 60;
    var timeStep = 1.0/(fps * 0.8);
     
    //move the box2d world ahead
    world.Step(timeStep , 8 , 3);
    world.ClearForces();
     
    //redraw the world
    draw_world(world , ctx);
     
    //call this function again after 1/60 seconds or 16.7ms
    setTimeout(step , 1000 / fps);
}
 
//Convert coordinates in canvas to box2d world
function get_real(p)
{
    return new b2Vec2(p.x + 0, canvas_height_m - p.y);
}
 
function GetBodyAtMouse(includeStatic)
{
    var mouse_p = new b2Vec2(mouse_x, mouse_y);
     
    var aabb = new b2AABB();
    aabb.lowerBound.Set(mouse_x - 0.001, mouse_y - 0.001);
    aabb.upperBound.Set(mouse_x + 0.001, mouse_y + 0.001);
     
    var body = null;
     
    // Query the world for overlapping shapes.
    function GetBodyCallback(fixture)
    {
        var shape = fixture.GetShape();
         
        if (fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic)
        {
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);
             
            if (inside)
            {
                body = fixture.GetBody();
                return false;
            }
        }
         
        return true;
    }
     
    world.QueryAABB(GetBodyCallback, aabb);
    return body;
}
 
// main entry point
$(function() 
{
    var canvas = $('#playground');
    ctx = canvas.get(0).getContext('2d');
     
    //get internal dimensions of the canvas
    canvas_width = parseInt(canvas.attr('width'));
    canvas_height = parseInt(canvas.attr('height'));
     
    canvas_height_m = canvas_height / scale;
    canvas_width_m = canvas_width / scale;
     
    //first create the world
    world = createWorld();
     
     
    //If mouse is moving over the thing
    $(canvas).mousemove(function(e) 
    {
        var p = get_real(new b2Vec2(e.pageX/scale, e.pageY/scale))
         
        mouse_x = p.x;
        mouse_y = p.y;
         
        if(mouse_pressed && !mouse_joint)
        {
            var body = GetBodyAtMouse();
             
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
        else
        {
            //nothing
        }
         
        if(mouse_joint)
        {
            mouse_joint.SetTarget(p);
        }
    });
     
    $(canvas).mousedown(function() 
    {
        //flag to indicate if mouse is pressed or not
        mouse_pressed = true;
    });
     
    /*
        When mouse button is release, mark pressed as false and delete the mouse joint if it exists
    */
    $(canvas).mouseup(function() 
    {
        mouse_pressed = false;
         
        if(mouse_joint)
        {
            world.DestroyJoint(mouse_joint);
            mouse_joint = false;
        }
    });
     
    //start stepping
    step();
});
