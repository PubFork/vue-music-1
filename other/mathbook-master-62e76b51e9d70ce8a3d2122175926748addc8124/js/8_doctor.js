
var pages = function(pages) {

    pages.prep_8_doctor = function(transition){
    	//**//**console.log('function: prep_8_doctor');
    	world_current = worlds['8_doctor'];
    	
    	ticker_world = (function(){
    		tick_8_doctor();
    	});
    	end_world = (function(){
    		end_8_doctor();
    	});
    	narrDone = (function(){
    		narrDone_8_doctor();
    	});
    
    	//if game, visible = false. if storybook, visible = true
    	arrowLeft.visible = true;
    	arrowRight.visible = true;
    
    	//adding background color (shape) or image (bitmap, and white border (bitmap)
    	bg = new createjs.Bitmap(images['bg_story']);
    	world_current.addChild(bg);
    
    	//** page assets:
    	dr = new createjs.Bitmap(images['8-dr']);
    	dr.x = 185; dr.y = 70;
    	world_current.addChild(dr);
    
    	kid = new createjs.Bitmap(images['8-kid']);
    	kid.x = 445; kid.y = 130;
    	world_current.addChild(kid);
    	//
    
    
    	//********
    	//text stuff:
    	bg_wordcloud = new createjs.Bitmap(images['bg_wordcloud']);
    	world_current.addChild(bg_wordcloud);
    
    	setNarrationText();
    
    	//params: sndID, defintion words in array
    	renderNarration('8_doctor', ['measure', 'weight,', 'temperature']);
    
    	setDefinitionText();
    	//********
    
    	//
    	// passing optional callback function to be called once this world_current is fully transitioned in
    	initTransitionAndLoad(transition, begin_8_doctor);
    
    
    
    }
    
    //level specific functions:
    
    //called once this level is fully slid into place
    function begin_8_doctor(){
    	//**//**console.log("WORLD 8 BEGIN");
    	playSound('8_doctor');
    }
    
    function narrDone_8_doctor(){
    	//play PAWS audio for this page:
    	//playSound('8_doctor_PAWS');
    }
    
    function tick_8_doctor(){
    	stage.update();
    }
    
    
    
    function end_8_doctor(){
    	//**//**console.log('end_8_doctor');	
    
    	stopSound(); //if PAWS audio in narrDone function - make sure to stop it before going to next page
    	
    	createjs.Ticker.removeEventListener(ticker_world);
    }

    return pages;
} (pages || {} );
