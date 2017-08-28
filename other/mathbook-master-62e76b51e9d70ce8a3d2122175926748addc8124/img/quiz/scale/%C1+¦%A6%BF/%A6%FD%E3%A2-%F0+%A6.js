(function (lib, img, cjs, ss, an) {

var p; // shortcut to reference prototypes
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];
lib.ssMetadata = [];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != cur) {		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {		
		cur = textInst;		
		while(cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.元件2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#4F3903").s().p("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");
	this.shape.setTransform(141.7,38.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DECE5F").s().p("AqODLQi1gChugJQiggMiAgeQg8gPgmgSQgtgVgbghQAKgYAlgXQBeg7BvghQA+gSBtgTQCegdBXgNQCHgVBvgJQBQgHCggGQHggPFaAWQGnAcFeBYQAGgEAEABQADABAEAFIABABIASAFQAFABAFAEQAGAEACAFIAAAFIgBAFIgEAHIgSARIgCABIAAABIgFADQgRALgHAFIgEAEIgrAbQgBABAAAAQAAAAAAAAQAAAAABAAQAAAAABgBQgXANgNAFQhFAdgbAJQgsAOhDAMQh0AWiVARQhFAJinARIgDABIgIABQgSADgPgBQgOABgPAAIgCAAQiDANjOAEQijACj0AAIhvAAQjNAAhPgCgAk2C4QBPADAvgBQApgCAxgDIA1gEQEfgSCPgMIAFAAQAwgDBTgHQBlgHA2gBIApAAIApgBQATgBAogEQDBgYDAg2QAsgNAbgKIAUgJIADgBQAmgTAjghQAFgEgCgEQgCgDgEABIgFAEIgVARQgCgCgDgCIgrgRIgEgDIhKgcIABgBIgKgCIgNgGIgIgBIgBABIgpgLQg2gNhZgNQjIgei6gKQhDgEiJgFIhLgDIhngDQiNgDkYAKIhYAEIhFADQhEAEidAUIkrAoQhcAOgcAFQheATiUAzQggALgTAIQgmAQghAdIgDADIAAAAIgFgGQgDgCgDABQgDACAAAEIADAGQALANAeAPIALAGQA/AgBUASQBEAOB2AJQCkAMCLAEIAEAAQAvADBDAAIB7gCIB+ADgAU5hBIAAAAIAAAAg");
	this.shape_1.setTransform(141.6,21.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#5B4110").s().p("AkyCsIiKgDIhyACQhEABgtgEQgDgBgDABQjKgGirgRQhRgJgogJQgzgMhFgeIgFgDQgWgKgQgKIgHgEIAFgEQAbgXAngSQAagMAtgPQBxgnBWgSQA0gLB9gRIDyghQCZgVBZgGIBGgDIBXgDQEMgLCIADIBqADIBRACQB9AEBaAFQCwALDGAcQA6AIAtAJQArAIBGAUIAKADIAtARQAGACAKAEIATAJIAFADIAKAEIAKAEIAFADIAGABIACACIgRALIgHAEIgBAAIgUAKQgXALglAMQh+ApjRAiQhLANgvACQgUACgqAAQifAEifAPIgNAAQioAOjzAPIhIAFIhHAEIgqABQgpAAg4gDg");
	this.shape_2.setTransform(141,21.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AA7B1E").s().p("Ap1DFQkkgEjLgqIjjgwQgVgEgHAKQAEgGACABIACgEIgOhwIgCgSIgBgtIAAgKQAAAAABAAQAAgBABAAQAAAAABAAQABAAABAAIAIgBIACAAQALARATAOQAiAXAlgDIAigHQAVgEANAAQAjABA2AqQA5AqAfAEQAXAEAogLQAsgMASAAQAsAAA0AlIBZA+QAqAXAhgHQAVgEAfgYQAXgSAvgwQAtgrAbgUQApgfAsgOQAxgPAtAMIAmANQAXAJAQAAQASAAAigMQAhgMASAAQASABAgAOQAhAPAPABQAaADAogOQAvgSARgCQAcgDAhAKQAXAHAjAQIBbAqQA1AZApAMQBwAjBXgZQA2gQA/gtQAlgbBHg4QBGgzA1AEQATACAaAKIAsAQQA5ATAhgYQALgHAcgoQAUgeAXgBQAMgBAPAIIAYAPQAaAPAbABQAVAAANgIIgDCKIgFBTInGA8QhqAOhGAIQjBAWlHANQijAHnUAOQh8AEhKAAIgfAAg");
	this.shape_3.setTransform(142.3,56);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#C29C23").s().p("ArNDZQgPgIgVgPIghgaQhMg2g/AHQgLABgkALQgeAJgSgCQgUgBgUgLQgPgIgWgPQgqghgUgKQgmgUggAGIgiALQgVAGgNgCQgMgCgOgJQgHgGgOgOIgrgoQADAJAFAJIgIgCIAAACIgBABIAAgNIAFhiQABgQACgLQAQAKASAJQAjARA2ANQCXAmDAANQB4AIDjACQELACCWgBQDmgBC7gGQCLgEBagJQAFABAJgBIEwgiQBIgHAlgHQAggFA9gNIA/gKQAmgGAYgHQAfgIA0gWQAwgTAdgNIACgBIACgCIAJgFQAigRAbgUIgCADIABgCQAJAXADAuIABAKQACAegBAOQgBAFABADIACABIgCAhQgQAEgRAAQgYgBgUgLQgUgMgKgFQgRgKgPABQgXABgWAfQgdAogLAIQggAVg4gTIgrgQQgYgJgUgBQgtgEg8AmQgNAIhgBKQhCAzgzASQhTAdhpgZQhHgRhqg2Qg1gagZgJQgtgQgmAGQgKACg7ATQgpANgZgHQgMgCgWgMQgXgMgMgCQgXgFgpANQgsAOgUgBQgNgBgVgHIghgMQgqgMgyANQgqAMgqAeQgeAWgqAoIhFBBQgcAZgWAGQgMADgNAAQgbAAgfgQg");
	this.shape_4.setTransform(142.4,45.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AAAAAIAAAAIAAAAg");
	this.shape_5.setTransform(275.3,15.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.元件2, new cjs.Rectangle(0,0,283.4,76.9), null);


// stage content:
(lib.天平 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.instance = new lib.元件2();
	this.instance.parent = this;
	this.instance.setTransform(778.1,576.6,1,1,-0.3,0,0,141.8,38.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1436.1,1137.4,283.8,78.3);
// library properties:
lib.properties = {
	width: 1600,
	height: 1200,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [],
	preloads: []
};




})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{}, AdobeAn = AdobeAn||{});
var lib, images, createjs, ss, AdobeAn;