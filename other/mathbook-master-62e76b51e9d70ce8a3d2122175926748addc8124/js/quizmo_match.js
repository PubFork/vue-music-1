var cards, row, column, matchImages, firstCard, score, flipCount; 

function prep_quizmomatch(transition){
	////**console.log('function: prep_quizmomatch');
	//world_current = worlds['quizmomatch'];
	world_current = worlds[pagenames[currentPage]];
	
	ticker_world = (function(){
		tick_quizmomatch();
	});
	end_world = (function(){
		end_quizmomatch();
	});
	narrDone = (function(){
		narrDone_quizmomatch();
	});
	quizQ_fadesDone = (function(){
		fadesDone_quizmomatch();
	});

	_quizActive = false;
	isCorrect=false;

    match_init();
	
	//play and stop sound since sound may not have been played yet (no cover page)
	playSound('empty');
	stopSound();

	// passing optional callback function to be called once this world_current is fully transitioned in
	initTransitionAndLoad(transition, begin_quizmomatch);
}


function match_init() {
    cards = [];
    currentLabel = -1;
    matchImages = [];
    firstCard = null;
    score = 0;
    flipCount = 0;
    right = 0;
    var quizSrcImgs = quiz_content[qWord][1];
    for (var idx = 0; idx < quizSrcImgs.length; idx++) {
        var quizSrcImg = quizSrcImgs[idx];
        var faceImages = quizSrcImg.slice(0, 2);
        var label = parseInt(quizSrcImg[2]);
        var card = new Card(world_current, faceImages, label, createjs.proxy(flipCard, this));
        //card.on("click", flipCard);
        cards.push(card);
    }
    row = parseInt(quiz_content[qWord][2][0]);
    column = parseInt(quiz_content[qWord][2][1]);
    cards = shuffle(cards);
    positionCards(cards);

	//move it where desired for particular quiz question
	btnNarration.x = canvas.width - 100; 
	btnNarration.y = 100; 
	btnNarrationOver.x = btnNarration.x;
	btnNarrationOver.y = btnNarration.y;

    //init_dodo_celebration();
    //init_dodo_punish();
}

function flipCard(evt) {
    var currentCard = evt.currentTarget;
    currentCard.flip(function() {
        if( firstCard != null) {
            if (firstCard.label != currentCard.label) {
                firstCard.flip();
                currentCard.flip();
                firstCard = null;
            } else {
                firstCard.kill();
                currentCard.kill();
                score++;
                if (score == ~~(cards.length / 2)) {
                    isCorrect = true;
                    quiz_effect();
                }
            }
        } else {
            firstCard = currentCard;
        }
    });
    flipCount++;
}

function positionCards(cards) {
    for (var rowIdx = 0; rowIdx < row; rowIdx++) {
        for (var columnIdx = 0; columnIdx < column; columnIdx++) {
            var idx = rowIdx * column + columnIdx;
            cards[idx].x =  100 + columnIdx * 800 / column;
            cards[idx].y = 100 + rowIdx * 800 / column;
        }
    }

}

//level specific functions:

//called once this level is fully slid into place
function begin_quizmomatch(){
	//**//**console.log("BEGIN-- cake & skits");
	_quizActive = true;

	playSound('q_'+ qWord);
}

function narrDone_quizmomatch(){
	//**//**console.log("question has been read for quizmomatch");

	btnNarration.visible = false;
	//quizQ_fadein_left(true);
}

//function set to quizQ_fadesDone, called once all question items finish fading in.
function fadesDone_quizmomatch(){
	if(snd_active) btnNarration.visible = true;

}

function displayCorrectmatch(){
	
}

function tick_quizmomatch(){
	stage.update();
}

function end_quizmomatch(){
	//**//**console.log('end_quizmomatch');	
	createjs.Ticker.removeEventListener(ticker_world);
}

