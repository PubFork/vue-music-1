class Gear extends createjs.Container {

    var m_iterations = 10;
    var m_timeStep = 1.0/30.0;

    //this.m_worldAABB = new b2AABB();
    //this.m_worldAABB.lowerBound.Set(-100.0, -100.0);
    //this.m_worldAABB.upperBound.Set(100.0, 100.0);
    //m_gravity = new b2Vec2(0.0,10.0);
    //m_world = new b2World(this.m_worldAABB, this.m_gravity, true);
    constructor(m_world) {
        super();
        // world setup
        this.m_circleDef = new b2CircleDef();
        this.m_jointDef = new b2RevoluteJointDef();
        this.m_gearJoint = new b2GearJoint();

        // debug draw
        this.m_sprite = new createjs.Sprite();
        this.addChild(this.m_sprite);
        this.m_dbgDraw = new b2DebugDraw();
        this.dbgDraw.m_drawScale = 30;
        this.dbgDraw.m_alpha = 1;
        this.dbgDraw.m_fillAlpha = 0.5;
        this.dbgDraw.m_lineThickness = 1;
        this.dbgDraw.m_drawFlags = b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit;
        this.m_world.SetDebugDraw(dbgDraw);
        // 1st gear
        var the_circle = new b2CircleDef();
        the_circle.radius=2;
        the_circle.density=5;
        var bd = new b2BodyDef();
        bd.position.Set(5,6.5);
        this.gear = m_world.CreateBody(bd);
        this.gear.CreateShape(the_circle);
        this.gear.SetMassFromShapes();

        /*
        // joints
        var the_rev_joint = new b2RevoluteJointDef()
        the_rev_joint.Initialize(m_world.GetGroundBody(), gear, new b2Vec2(5,6.5));
        var joint = m_world.CreateJoint(the_rev_joint);
        // gear joint
        var gear_joint = new b2GearJointDef();
        gear_joint.body1 = gear1;
        gear_joint.body2 = gear2;
        gear_joint.joint1 = first_joint;
        gear_joint.joint2 = second_joint;
        gear_joint.ratio = 1;
        var the_gear_joint = m_world.CreateJoint(gear_joint);
        */

        // listeners
        this.addEventListener(MouseEvent.MOUSE_DOWN, createMouse);
        this.addEventListener(MouseEvent.MOUSE_UP, destroyMouse);
        this.addEventListener(Event.ENTER_FRAME, Update, false, 0, true);
    }
    
    function createMouse(evt) {
        var body = GetBodyAtMouse();
        if (body) {
            var mouseJointDef = new b2MouseJointDef();
            mouseJointDef.body1 = m_world.GetGroundBody();
            mouseJointDef.body2 = body;
            mouseJointDef.target.Set(mouseX/30, mouseY/30);
            mouseJointDef.maxForce = 30000;
            mouseJointDef.timeStep = m_timeStep;
            mouseJoint = m_world.CreateJoint(mouseJointDef);
        }
    }

    function destroyMouse(evt) {
        if (mouseJoint) {
            m_world.DestroyJoint(mouseJoint);
            mouseJoint = null;
        }
    }

    function GetBodyAtMouse(includeStatic=false) {
        var mouseXWorldPhys = (mouseX)/30;
        var mouseYWorldPhys = (mouseY)/30;
        mousePVec.Set(mouseXWorldPhys, mouseYWorldPhys);
        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouseXWorldPhys - 0.001, mouseYWorldPhys - 0.001);
        aabb.upperBound.Set(mouseXWorldPhys + 0.001, mouseYWorldPhys + 0.001);
        var k_maxCount = 10;
        var shapes = new Array();
        var count = m_world.Query(aabb,shapes,k_maxCount);
        var body = null;
        for (var i = 0; i < count; ++i) {
            if (shapes[i].GetBody().IsStatic() == false || includeStatic) {
                var tShape = shapes[i];
                var inside = tShape.TestPoint(tShape.GetBody().GetXForm(),mousePVec);
                if (inside) {
                    body = tShape.GetBody();
                    break;
                }
            }
        }
        return body;
    }
    public function Update(evt) {
        m_world.Step(m_timeStep, m_iterations);
        if (mouseJoint) {
            var mouseXWorldPhys = mouseX/30;
            var mouseYWorldPhys = mouseY/30;
            var p2 = new b2Vec2(mouseXWorldPhys,mouseYWorldPhys);
            mouseJoint.SetTarget(p2);
        }
    }
}
