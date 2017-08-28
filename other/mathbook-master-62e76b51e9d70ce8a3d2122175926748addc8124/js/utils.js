//****************
//HELPER FUNCTIONS:

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//Array indexOf: Returns the index of the found element.
Array.prototype.indexOf = function(elt /*, from*/)
{
var len = this.length;

var from = Number(arguments[1]) || 0;
from = (from < 0)
     ? Math.ceil(from)
     : Math.floor(from);
if (from < 0)
  from += len;

for (; from < len; from++)
{
  if (from in this &&
      this[from] === elt)
    return from;
}
return -1;
};

// get random Int
function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get random num
function randomNum (min, max) {
    return Math.random() * (max - min) + min;
}


function lineDistance( point1, point2 )
{
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
}


//HELPER FUNCTION:
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/* Common methods */
var Util = {
    objectDrag: function (obj, hitTargets, hitCallback, snapbackCallback){
    	addShadow(obj);
    	doPulse(obj);
    
    	(function(target) {
    		target.addEventListener("mousedown", function(evt) {
    			if(!_active) return;
    			
    			target.scaleX = target.scaleY = 1.1;
    			////**//**console.log(evt.target + " pressed!");
    			
    			// bump the target in front of it's siblings:
    			world_current.addChild(target);
    			this.offset = {x:evt.stageX - target.x, y: evt.stageY - target.y};
            });
            target.addEventListener("pressmove", function(evt) {
    			target.x = evt.stageX - this.offset.x;
    			target.y = evt.stageY - this.offset.y;
    		});
    
    	    target.addEventListener("pressup", function(evt){
    			//**//**console.log(target + " released!");
    			target.scaleX = target.scaleY = 1;
    
    			//if hitTest w/ scalereading is true, then modify scale display, else, return the meat
                var hit = false;
                for(var idx = 0; idx < (hitTargets? hitTargets.length: 0); idx++) { 
                    var hitTarget = hitTargets[idx];
    			    var pt = hitTarget.globalToLocal(evt.stageX, evt.stageY);
    			    if (hitTarget.hitTest(pt.x, pt.y)) { 
    			    	//**//**console.log('target has hit the scale!');
    			    	hitCallback(target, idx, hitTarget);	
                        hit = true;
                        break;
    			    }
                }
                if (!hit) {
    			    Util.snapback(target, snapbackCallback);	
                }
    		});		
    	})(obj);	
    },

    disableDrag: function(target) {
    	target.removeAllEventListeners("mousedown");
    	target.removeAllEventListeners("pressmove");
    	target.removeAllEventListeners("pressup");
    },
    
    snapback: function (target, callback) {
    	target.x = target.startX;
    	target.y = target.startY;	
        if (callback) callback(target);
    },
};

function Button(label, img, width, height, callback) {
   this.initialize(label, img, width, height, callback); 
}

Button.prototype = new createjs.Sprite();
Button.prototype.Sprite_initialize = Button.prototype.initialize; //unique to avoid overiding base class

Button.prototype.initialize = function (label, img, width, height, callback) {
    var localSpriteSheet = new createjs.SpriteSheet({
        images: [img], //image to use
        frames: {width: width, height: height},
        animations: {
            unclick: [0, 0, "unclick", 4],
            clicked: [1, 1, "clicked", 4],
        }
    });

    this.Sprite_initialize(localSpriteSheet);
    this.label = label;

    // start playing the first sequence:
    this.gotoAndStop("unclick");     //animate

    // starting directly at the first frame of the walk_h sequence
    this.currentFrame = 0;
    this.clickEvent = this.addEventListener("click", createjs.proxy(this.handleButtonClick, this));
    this.callback = callback;
};

Button.prototype.handleButtonClick = function (evt) {
    this.gotoAndPlay("clicked");
    this.removeEventListener("click", this.clickEvent);
    this.callback(this.label);
}

function Card(parent, faceImages, label, callback) {
    var _this = this;
    this.Container_initialize();
    this.status = "back";
    for (i = 0; i < faceImages.length; i++) {
        var image = new Image();
        image.src = faceImages[i];
        image.index = i;
        image.onload = function() {
            var bmp = new createjs.Bitmap(this);
            if (this.index == 0) { bmp.name = 'front'; bmp.visible = false; _this.front = bmp;  } 
            else { bmp.name = "back"; bmp.visible = true; _this.back = bmp; }
            bmp.shadow = new createjs.Shadow("#666", 3, 3, 5);
            bmp.regX = bmp.image.width / 2;
            //_this.regY = bmp.image.height / 2;
            _this.addChild(bmp);
        }
     }
     this.label = label;
     this.visible = true;
     if (callback) this.on("click", callback);
     parent.addChild(this);
}

Card.prototype = new createjs.Container();
Card.prototype.Container_initialize = Card.prototype.initialize; //unique to avoid overiding base class

Card.prototype.dealCard = function(x, y) {
    this.rotation = Math.random() * 600;
    createjs.Tween.get(this).to({x:x, y:y, rotation:0}, 300);
}

Card.prototype.flip = function(callback) {
    var _this = this;
    if (!callback) callback = function() {};
    if (this.status == "front") {
        createjs.Tween.get(this.front).to({skewY: 90}, 1000).call(function() { _this.front.visible = false; _this.back.visible = true; _this.front.skewY = 0;} );
        createjs.Tween.get(this.back).to({skewY: -90}, 1000).to({skewY: 0}, 1000).call(callback);
        this.status = "back";
    } else {
        createjs.Tween.get(this.back).to({skewY: 90}, 1000).call(function() { _this.front.visible = true; _this.back.visible = false; _this.back.skewY = 0;} );
        createjs.Tween.get(this.front).to({skewY: -90}, 1000).to({skewY: 0}, 1000).call(callback);
        this.status = "front";
    }
    return this.label;
}

Card.prototype.kill = function() {
    this.parent.removeChild(this);
}
