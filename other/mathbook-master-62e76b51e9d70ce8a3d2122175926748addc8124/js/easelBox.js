/*
EaselBox codebase, modified by Bharat Battu, WGBH Educational Foundation

modifications to allow easelbox to work with createjs engine for multipage storybooks for
Martha Speaks RTL Year 3 Storybooks

'world' is the reserved var name used for the box2d world created by easelbox.
'world_current' is the easeljs Container for the current page in RTL storybooks, on which all createjs content is added & rendered. (instead of canvas or stage) 

other modifications:

EaselBoxWorld.prototype.tick: added check for doPhysics bool:
  - if false, box2D ticker will not execute.
  - allows enabling/disabling of box2D physics as needed within storybook

updated EaselBoxRectangle and EaselBoxCircle functions to allow basic DisplayObject properties, such as alpha, during instantiation as easelbox objects

new functions:
EaselBoxWorld.prototype.changeGravity(gravityX, gravityY) : allows changing of box2D world's gravity AFTER the world has been created.

EaselBoxObject.prototype.addShadow: example of how to update the displayobject of a easelbox object after world creation
  **can also be done elsewhere via [object].easelObj.anyproperty
*/

//Ticker = {};

(function() {

  var PIXELS_PER_METER,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.EaselBoxObject = (function() {
    var getType;

    function EaselBoxObject(easelObj, box2dShape, options) {
      var density, friction, restitution;
      this.easelObj = easelObj;
      density = (options && options.density) || 1;
      friction = (options && options.friction) || 0.5;
      restitution = (options && options.restitution) || 0.2;
      this.fixDef = new Box2D.Dynamics.b2FixtureDef;
      this.fixDef.density = density;
      this.fixDef.friction = friction;
      this.fixDef.restitution = restitution;
      this.fixDef.shape = box2dShape;
      this.bodyDef = new Box2D.Dynamics.b2BodyDef;
      this.body = null;
    }

    EaselBoxObject.prototype.update = function() {
      this.easelObj.x = this.body.GetPosition().x * PIXELS_PER_METER;
      this.easelObj.y = this.body.GetPosition().y * PIXELS_PER_METER;
      return this.easelObj.rotation = this.body.GetAngle() * (180 / Math.PI);
    };

    EaselBoxObject.prototype.setType = function(type) {
      return this.body.SetType(getType(type));
    };

    EaselBoxObject.prototype.setState = function(options) {
      var angleDegrees, angleRadians, angularVelDegrees, angularVelRadians, xMeters, xPixels, xVelMeters, xVelPixels, yMeters, yPixels, yVelMeters, yVelPixels;
      if (options && options.xPixels) {
        xPixels = options.xPixels;
        xMeters = xPixels / PIXELS_PER_METER;
      } else if (options && options.Xmeters) {
        xMeters = options.Xmeters;
        xPixels = xMeters * PIXELS_PER_METER;
      } else {
        xMeters = 0;
        xPixels = 0;
      }
      if (options && options.yPixels) {
        yPixels = options.yPixels;
        yMeters = yPixels / PIXELS_PER_METER;
      } else if (options && options.Xmeters) {
        yMeters = options.Ymeters;
        yPixels = YMeters * PIXELS_PER_METER;
      } else {
        yMeters = 0;
        yPixels = 0;
      }
      if (options && options.xVelPixels) {
        xVelPixels = options.xVelPixels;
        xVelMeters = xVelPixels / PIXELS_PER_METER;
      } else if (options && options.xVelMeters) {
        xVelMeters = options.xVelMeters;
        xVelPixels = xVelMeters * PIXELS_PER_METER;
      } else {
        xVelMeters = 0;
        xVelPixels = 0;
      }
      if (options && options.yVelPixels) {
        yVelPixels = options.yVelPixels;
        yVelMeters = yVelPixels / PIXELS_PER_METER;
      } else if (options && options.yVelMeters) {
        yVelMeters = options.yVelMeters;
        yVelPixels = yVelMeters * PIXELS_PER_METER;
      } else {
        yVelMeters = 0;
        yVelPixels = 0;
      }
      if (options && options.angleDegrees) {
        angleDegrees = options.angleDegrees;
        angleRadians = Math.PI * angleDegrees / 180;
      } else if (options && options.angleRadians) {
        angleRadians = options.angleRadians;
        angleDegrees = 180 * angleRadians / Math.PI;
      } else {
        angleRadians = 0;
        angleDegrees = 0;
      }
      if (options && options.angularVelRadians) {
        angularVelRadians = options.angularVelRadians;
        angularVelDegrees = 180 * angularVelRadians / Math.PI;
      } else if (options && options.angularVelDegrees) {
        angularVelDegrees = options.angularVelDegrees;
        angularVelRadians = Math.PI * angularVelDegrees / 180;
      } else {
        angularVelDegrees = 0;
        angularVelRadians = 0;
      }
      this.easelObj.x = xPixels;
      this.easelObj.y = yPixels;
      this.easelObj.rotation = angleDegrees;
      this.body.GetPosition().x = xMeters;
      this.body.GetPosition().y = yMeters;
      this.body.SetAngle(angleRadians);
      this.body.SetAngularVelocity(angularVelRadians);
      return this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(xVelMeters, yVelMeters));
    };
    
    EaselBoxObject.prototype.addShadow = function() {
      //this.easelObj.visible = false;
      this.easelObj.shadow = new createjs.Shadow("#000000", 3, 3, 1); 
    };

    getType = function(type) {
      if ('dynamic' === type) {
        return Box2D.Dynamics.b2Body.b2_dynamicBody;
      } else if ('static' === type) {
        return Box2D.Dynamics.b2Body.b2_staticBody;
      } else if ('kinematic' === type) {
        return Box2D.Dynamics.b2Body.b2_kinematicBody;
      }
    };

    return EaselBoxObject;

  })();

  window.EaselBoxCircle = (function(_super) {

    __extends(EaselBoxCircle, _super);

    function EaselBoxCircle(radiusPixels, options) {
      var bmpAnim, box2dShape, data, object, radiusMeters;
      if (radiusPixels == null) radiusPixels = 20;
      if (options == null) options = null;
      radiusMeters = radiusPixels / PIXELS_PER_METER;
      box2dShape = new Box2D.Collision.Shapes.b2CircleShape(radiusMeters);
      object = null;
      if (options && options.imgSrc) {
        if (options && options.frames) {
          if(options.animations)
          {
            data = {
              images: [options.imgSrc],
              frames: options.frames,
              animations:options.animations
            };
          }else{
            data = {
              images: [options.imgSrc],
              frames: options.frames,
            };
          }
          bmpAnim = new createjs.SpriteSheet(new createjs.SpriteSheet(data));
          object = bmpAnim.clone();
          object.gotoAndPlay(options.startFrame | 0);
        } else {
          object = new createjs.Bitmap(options.imgSrc);
        }
        object.scaleX = options.scaleX || 1;
        object.scaleY = options.scaleY || 1;
        //object.regX = radiusPixels;
        //object.regY = radiusPixels;
        object.regX = options.imgSrc.width/2 || radiusPixels;
        object.regY = options.imgSrc.height/2 || radiusPixels;
      } else {
        object = new createjs.Shape();
        if(options.color) {
          object.graphics.beginFill(options.color).drawCircle(0, 0, radiusPixels);
        }       
        else {
          object.graphics.beginRadialGradientFill(["#F00", "#00F"], [0.1, .9], 0, 0, 0, 0, 0, radiusPixels).drawCircle(0, 0, radiusPixels).beginFill("#FFF").drawRect(0, -1, radiusPixels, 2);
        }        
      }
      if(options.alpha ==0 ) object.visible = false;
      EaselBoxCircle.__super__.constructor.call(this, object, box2dShape, options);
    }

    return EaselBoxCircle;

  })(EaselBoxObject);

  window.EaselBoxRectangle = (function(_super) {

    __extends(EaselBoxRectangle, _super);

    function EaselBoxRectangle(widthPixels, heightPixels, options) {
      var bmpAnim, box2dShape, data, heightMeters, object, widthMeters;
      if (options == null) options = null;
      widthMeters = widthPixels / PIXELS_PER_METER;
      heightMeters = heightPixels / PIXELS_PER_METER;
      box2dShape = new Box2D.Collision.Shapes.b2PolygonShape.AsBox(widthMeters / 2, heightMeters / 2);
      object = null;
      if (options && options.imgSrc) {
        if (options && options.frames) {
          if(options.animations)
          {
            data = {
              images: [options.imgSrc],
              frames: options.frames,
              animations:options.animations
            };
          }else{
            data = {
              images: [options.imgSrc],
              frames: options.frames,
            };
          }
          bmpAnim = new createjs.SpriteSheet(new createjs.SpriteSheet(data));
          object = bmpAnim.clone();
          object.gotoAndPlay(options.startFrame | 0);
        } else {
          object = new createjs.Bitmap(options.imgSrc);
        }
        //object.regX = widthPixels / 2;
        //object.regY = heightPixels / 2;
        object.regX = options.imgSrc.width/2 || widthPixels / 2;
        object.regY = options.imgSrc.height/2 || heightPixels / 2;
        object.scaleX = options.scaleX || 1;
        object.scaleY = options.scaleY || 1;        
      } else {
        object = new createjs.Shape();
        if(options.color) {
          object.graphics.beginFill(options.color).drawRect(-widthPixels / 2, -heightPixels / 2, widthPixels, heightPixels);          
        }
        else {
          object.graphics.beginLinearGradientFill(["#F00", "#00F"], [0, 0.5], -widthPixels / 2, 0, widthPixels, 0).drawRect(-widthPixels / 2, -heightPixels / 2, widthPixels, heightPixels);          
        }
       if(options.alpha == 0 ) object.visible = false;       
      }
      EaselBoxRectangle.__super__.constructor.call(this, object, box2dShape, options);
    }

    return EaselBoxRectangle;

  })(EaselBoxObject);

  PIXELS_PER_METER = 30;

  window.EaselBoxWorld = (function() {
    ////**console.log('1: easelboxworld');
    var minFPS;
    minFPS = 10;

    function EaselBoxWorld(callingObj, frameRate, canvas, gravityX, gravityY, pixelsPerMeter) {
      ////**console.log('2: easelboxworld');
      //var debugDraw;
     // //**console.log('this is: ' + this);
      this.callingObj = callingObj;
      this.pixelsPerMeter = pixelsPerMeter;
      PIXELS_PER_METER = this.pixelsPerMeter;

      //Ticker = ticker_world; //setting Ticker to be the RTL storybook's ticker
      ////**console.log('Ticker is: ' + Ticker);
      
      //Ticker.addListener(this);
      //Ticker.setFPS(frameRate);
      this.box2dWorld = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(gravityX, gravityY), true);
      
      this.easelStage = world_current;
      ////**console.log('easelstage is: '  + this.easelStage);
      
      this.objects = [];
    };

    EaselBoxWorld.prototype.addEntity = function(options) {
      var object;
      object = null;
      if (options.radiusPixels) {
        object = new EaselBoxCircle(options.radiusPixels, options);
      } else {
        object = new EaselBoxRectangle(options.widthPixels, options.heightPixels, options);
      }
      this.easelStage.addChild(object.easelObj);
      object.body = this.box2dWorld.CreateBody(object.bodyDef);
      object.body.CreateFixture(object.fixDef);
      object.setType(options.type || 'dynamic');
      object.setState(options);
      this.objects.push(object);
      return object;
    };

    EaselBoxWorld.prototype.removeEntity = function(object) {
      this.box2dWorld.DestroyBody(object.body);
      return this.easelStage.removeChild(object.easelObj);
    };

    EaselBoxWorld.prototype.addImage = function(imgSrc, options) {
      var obj, property, value;
      obj = new createjs.Bitmap(imgSrc);
      for (property in options) {
        value = options[property];
        obj[property] = value;
      }
      return this.easelStage.addChild(obj);
    };

    EaselBoxWorld.prototype.tick = function() {
      if(!doPhysics) return; //** bool must be true for box2D physics to happen.

      var object, _i, _len, _ref;
      if (createjs.Ticker.getMeasuredFPS() > minFPS) {
        this.box2dWorld.Step(1 / createjs.Ticker.getMeasuredFPS(), 10, 10);
        this.box2dWorld.ClearForces();
        _ref = this.objects;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          object = _ref[_i];
          object.update();
        }
      }
      if (typeof this.callingObj.tick === 'function') this.callingObj.tick();
      //this.easelStage.update(); //no need todo this is easelStage is a world (container object)
      return this.box2dWorld.DrawDebugData();
    };

    EaselBoxWorld.prototype.vector = function(x, y) {
      return new Box2D.Common.Math.b2Vec2(x, y);
    };


    EaselBoxWorld.prototype.changeGravity = function(gravityX, gravityY){
        //**console.log("change gravity AFTER box2D running")
        
        var gravity = new Box2D.Common.Math.b2Vec2(gravityX, gravityY, true);
        return this.box2dWorld.SetGravity( gravity );
    };

    return EaselBoxWorld;

  })();

}).call(this);
