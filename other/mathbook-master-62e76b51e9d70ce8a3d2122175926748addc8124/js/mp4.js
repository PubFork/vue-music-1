
$(document).ready(function() {
    // declare object for video. reference mediaelementplayer using var player
    var quizArray = [];
    var player = new MediaElementPlayer('#player1', {
        startLanguage:'none',
        // disable the dropdown list of languages
        translationSelector: false,
    
        // Hide controls when playing and mouse is not over the video
        alwaysShowControls: true,
        enableAutosize: true,
    
        // the order of controls you want on the control bar (and other plugins below)
        features: ['playpause','restart','progress','volume','tracks', 'fullscreen'],
    
        success: function(player, node) {
            //$('#' + node.id + '-mode').html('mode: ' + player.pluginType);
            //**console.log('mode: ' + player.pluginType);
            ////**console.log(player);
            player.addEventListener('timeupdate', function() {
              for (var quizIdx in quizArray) {
                  if (!quizArray[quizIdx].solved && player.currentTime > quizArray[quizIdx].time) {
                     player.pause(); 
                     quizArray[quizIdx].element.show();
                  }
              }
            }, false);
    
        }
    
    
    });

    do_resize();
    var mejsContainer = $(".mejs-container");
    var videoElm = document.getElementById("player1");
    videoElm.width = options && (options.videoWidth !== undefined) ? options.videoWidth: "650";
    videoElm.height = options && (options.videoHeight !== undefined) ? options.videoHeight : "400";


    var options = {
        quizes: [    
                {time: 10, question: {id: 1, text: "我是一个问题" }, choices: [ { text: "答案1", color: "red"  }, { text: "答案2", color: "green", isanswer: true }, { text: "答案3", color: "blue", isanswer: true }   ]},
                ]
        
    };

    for (var quizIdx in options.quizes) {
        var quiz = options.quizes[quizIdx];
        var quizObj = mejsContainer.selectQuiz(quiz, "checkbox", {width: videoElm.width + "px", height: videoElm.height + "px"});
        mejsContainer.append(quizObj.element[0]);
        quizArray.push(quizObj);
    }                
    

    //**console.log("always show controls?: " + player.options.alwaysShowControls);

});

//getting window size values on resize
$(window).resize(function() {
    do_resize();
});

function do_resize(){
    //**console.log('resize!');

    ////**console.log($(window).width());

    //EVERYTHING- ENTIRE video player:
    $('#video-parent').css('margin-left', ($(window).width() - $('#player1').width()) /2 - 24);
    $('#video-parent').css('margin-top', ($(window).height() - $('#player1').height()) /2 );


    //$('#video-wrapper').css('margin-left', $('#player1').position().left - 60);
    //$('#video-wrapper').css('margin-top', $('#player1').height()/-2 +100);
    $('#video-wrapper').css('margin-left', $('#player1').position().left - 93);
    $('#video-wrapper').css('margin-top', $('#player1').height()/-2 + 63);


    $('#videoFrameTopLeft').css('margin-left', $('#player1').position().left - 88);
    $('#videoFrameTopLeft').css('margin-top', $('#player1').height()/-2 + 75);

    $('#videoFrameTopRight').css('margin-left', $('#player1').position().left + 690);
    $('#videoFrameTopRight').css('margin-top', $('#player1').height()/-2 + 70);


    $('#video-frame').css('margin-left', $('#player1').position().left - 93);
    $('#video-frame').css('margin-top', $('#player1').height()/-2 + 63);

    $('#video-pbsbtn').css('margin-left', $('#player1').position().left - 76 );
    $('#video-pbsbtn').css('margin-top', -100);

    $('#video-homebtn').css('margin-left', $('#player1').position().left + 707 );
    $('#video-homebtn').css('margin-top', - 100);

    //$('#video-gamebtn').css('margin-left', $('#player1').position().left + 664 );
    //$('#video-gamebtn').css('margin-top', $('#player1').position().top + 28 );

}

/*
MediaElement('player1', {success: function(me) {
	//**console.log("SUCCESS: " );



	//me.play();
    me.addEventListener('ended', function(){
      //**console.log('video has ended');
      player.exitFullScreen();
    }, false);

}});
*/
