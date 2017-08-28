var pages = function(pages) {
    pages.prep_1_intro = function(transition){
    	//**//**console.log('function: prep_1_intro');
    	world_current = worlds['1_intro'];
    	
    	ticker_world = (function(){
    		tick_1_intro();
    	});
    	end_world = (function(){
    		end_1_intro();
    	});
    	narrDone = (function(){
    		narrDone_1_intro();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//teachertip:
    	teachertipcontainer.onPage = true;
    	teachertiptext.text = "Parent tip: When you read with your child, pause to discuss the text on screen. It's helpful to reuse any new words your child might be hearing for the first time. You could say, \"What do you think the word measure means? Can you remember a time when you measured something?\"";
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	//** page assets:
    	helen = new createjs.Bitmap(images['1-helen']);
    	helen.x = 260; helen.y = 64;
    	world_current.addChild(helen);
    
    	dogs = new createjs.Bitmap(images['1-dogs']);
    	dogs.x = 506; dogs.y = 218;
    	world_current.addChild(dogs);
    
        init_maze();
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
        console.log("remove bg_wordcloud");
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText(830);
    
    	//params: sndID, defintion words in array
    	renderNarration('1_intro', ['measure.']);
    
    	setDefinitionText();
    	//********
    	
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_1_intro);
    }
    
    
    function init_maze() {
        var width = 1000;
        var height = 800;
        var color = "#333";
        var hitChildren = new Set();
        
        var maze = new lib.maze();
        maze.setBounds(0,0,416,299);
        world_current.addChild(maze);


        var childrenConf = [{"xOffset": 10, "yOffset": 20, "scaleX": 1, "scaleY": 1, "rotation": 0, "path": "AYmWpIAAhkIGQAAIAAlxI8wAAIAAhkIEOAAIAApiIvIAAIAABaIhkAAIAAq6IigAAIAAhkIH0AAIAABkIjwAAIAAH8ITMAAIAABkIigAAIAAJiIMqAAIAAiqIBkAAIAACqIIwAAIAA78IiWAAIAAhkICWAAIAAlUMgxqAAAIAAhkMAzOAAAMAAAAtRgEggZAWpMAAAgtRIIbAAIAABkIm3AAIAAFUMApXAAAIAABkIleAAIAAHWIPeAAIAAnWIlUAAIAAhkIISAAIAABkIhaAAIAAUIIhkAAIAAhuIlKAAIAAhkIFKAAIAAn8IzsAAIAAhkICqAAIAAnWI4WAAIAAHWIDmAAIAABkIjmAAIAAGsIhkAAIAAvmIobAAMAAAAjRIIbAAIAAtRIBkAAIAAF8IKeAAIAAjIIBkAAIAADIIDmAAIAABkIvoAAIAAFxMAoIAAAIAABkg"}, 
                            {"xOffset": 10, "yOffset": 20, "scaleX": 1, "scaleY": 1, "rotation": 0, "path": "AYmWpIAAhkIGQAAIAAlxI8wAAIAAhkIEOAAIAApiIvIAAIAABaIhkAAIAAq6IigAAIAAhkIH0AAIAABkIjwAAIAAH8ITMAAIAABkIigAAIAAJiIMqAAIAAiqIBkAAIAACqIIwAAIAA78IiWAAIAAhkICWAAIAAlUMgxqAAAIAAhkMAzOAAAMAAAAtRgEggZAWpMAAAgtRIIbAAIAABkIm3AAIAAFUMApXAAAIAABkIleAAIAAHWIPeAAIAAnWIlUAAIAAhkIISAAIAABkIhaAAIAAUIIhkAAIAAhuIlKAAIAAhkIFKAAIAAn8IzsAAIAAhkICqAAIAAnWI4WAAIAAHWIDmAAIAABkIjmAAIAAGsIhkAAIAAvmIobAAMAAAAjRIIbAAIAAtRIBkAAIAAF8IKeAAIAAjIIBkAAIAADIIDmAAIAABkIvoAAIAAFxMAoIAAAIAABkg"}];
        var children = [];

        for (var idx = 0; idx < childrenConf.length; idx++) {
            var childConf = childrenConf[idx];
	        var childObject = new createjs.Shape();
            childObject.graphics.f("#EB0000").s().p(childConf["path"]);
            var xOffset = childConf.xOffset? childConf.XOffset : 0;
            var yOffset = childConf.yOffset? childConf.yOffset : 0;
            var scaleX = childConf.scaleX? childConf.scaleX: 1;
            var scaleY = childConf.scaleY? childConf.scaleY: 1;
            var rotation = childConf.rotation? childConf.rotation: 0;
	        childObject.setTransform(xOffset, yOffset, scaleX, scaleY, rotation);
            world_current.addChild(childObject);
            children.push(childObject);
        }
        
        var pawn = new zim.Circle(10, "blue");
        // zim.place(pawn, "pawn");
        pawn.x = 358;
        pawn.y = 222;
        world_current.addChild(pawn);
        
        var damp = .05;
        var dampX = new zim.Damp(pawn.x, damp);
        var dampY = new zim.Damp(pawn.y, damp);
        
        var followCheck = false;
        
        var maxMove = 200;
        
        var desiredX = pawn.x;
        var desiredY = pawn.y;
       
        world_current.on("click", function(){
        	if (!followCheck) { // not yet following so turn on
        		zim.Ticker.add(animate, stage);
        		followCheck = true;
        	} else { // already following so turn off
        		zim.Ticker.remove(animate);
        		followCheck = false;
        	}
        });
        
        var pulseCheck = false;
        function animate() {
        	var lastX = pawn.x;
        	var lastY = pawn.y;
        
        	pawn.x = dampX.convert(stage.mouseX);
        	pawn.y = dampY.convert(stage.mouseY);
        
        	if (zim.hitTestCircle(maze, pawn)) {
        
        		if (!pulseCheck) {
        			pulseCheck = true;
        			zim.animate({
        				target:pawn,
        				obj:{scale:1.2},
        				props:{rewind:true},
        				call:function(){
        					pulseCheck=false;
        					pawn.color = "blue"; 
        				},
        				time:200
        			});
        		}
        
        		pawn.x = lastX;
        		pawn.y = lastY;
        
        		dampX.immediate(pawn.x);
        		dampY.immediate(pawn.y);
        	}
            for (var childIdx = 0; childIdx < children.length; childIdx++ ) {
                var child = children[childIdx];
        	    if (zim.hitTestCircle(child, pawn)) {
                    console.log("hitted!");
                    console.log(child);
                    hitChildren.add(child);
                    break;
                }
            }
        }
        
        //stage.update();
    }
    
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_1_intro(){
    	//**//**console.log("WORLD 1 BEGIN");
    	
    	playSound('1_intro');
    	
    }
    
    function narrDone_1_intro(){
    	//play PAWS audio for this page:
    	//playSound('1_intro_PAWS');
    }
    
    function tick_1_intro(){
    	stage.update();
    }
    
    
    function end_1_intro(){
    	//**//**console.log('end_1_intro');	
    	
    	stopSound(); //if PAWS audio in narrDone function - make sure to stop it before going to next page
    	
    	createjs.Ticker.removeEventListener(ticker_world);
    }
    return pages;
}(pages || {});
