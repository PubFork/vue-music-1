var Card = function(parent, faceImages, label, callback) {
    var _this = this;
    this.status = "back";
    for (i = 0; i < faceImages.length; i++) {
        var image = new Image();
        image.index = i;
        image.src = faceImages[i];
        image.onload = function() {
            var bmp = new createjs.Bitmap(this);
            if (this.index == 0) { bmp.name = 'front'; bmp.visible = false; _this.front = bmp; } 
            else { bmp.name = "back"; bmp.visible = true; _this.back = bmp; }
            bmp.shadow = new createjs.Shadow("#666", 3, 3, 5);
            this.regX = bmp.image.width / 2;
            //this.regY = bmp.image.height / 2;
            _this.addChild(bmp);
        }
     }
     if (callback) this.on("click", callback);
     this.label = lable;
     this.visible = true;
     parent.addChild(this);
}

Card.prototype = new createjs.Container();

Card.prototype.dealCard = function(x, y) {
    this.rotation = Math.random() * 600;
    createjs.Tween.get(this).to({x:x, y:y, rotation:0}, 300);
}

Card.prototype.flip = function(e) {
    if (this.status == "front") {
        createjs.Tween.get(this.front).to({skewY: 90}, 500).call(function() { this.front.visible = false; this.back.visible = true; this.front.skewY = 0;} );
        createjs.Tween.get(this.back).to({skewY: 90}, 500).to({skewY: 0}, 500);
        this.status = "back";
    } else {
        createjs.Tween.get(this.back).to({skewY: 90}, 500).call(function() { this.front.visible = true; this.back.visible = false; this.back.skewY = 0;} );
        createjs.Tween.get(this.front).to({skewY: 90}, 500).to({skewY: 0}, 500);
        this.status = "front";
    }
    return this.label;
}

Card.prototype.kill = function() {
    this.parent.removeChild(this);
}
