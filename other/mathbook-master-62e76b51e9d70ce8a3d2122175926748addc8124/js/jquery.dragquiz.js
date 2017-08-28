/**
 * jquery.dragquiz.js v1.0.0
 *
 * Licensed under the MIT license.
 * 
 * Copyright 2017, @leio 
 * http://www.dodobaike.com
 */
;( function( $, window, undefined ) {
    
    'use strict';

    var Quiz = function( quiz, type, params ) {
       this.container = $("<div class='drag-quiz'> </div>");
       this.container.attr('style',  "position: absolute;left:0; top: 0; z-index: 999"); 
       this.sourceElm = $("<div class='source'> </div>");
       this.container.append(this.sourceElm);
       for (var key in params) {
           this.container.css(key, params[key]);
       }
       this.time = quiz.time;
       if (quiz.question) {
           this.question = new Question(quiz.question);
           this.container.append(this.question.element);
       }
       this.sources = [];
       this.destinations = [];
       for (var sourceIdx in quiz.sources) {
           var source = new Source(sourceIdx, type, quiz.sources[sourceIdx]); 
           this.sources.push(source); 
           this.sourceElm.append(source.element);
       }
       for (var destIdx in quiz.destinations) {
           var destination = new Destination(destIdx, type, quiz.destinations[destIdx]); 
           this.destinations.push(destination); 
           this.container.append(destination.element);
       }
       this.solved = false;
       if (quiz.time)
           this.container.hide();
       return this;
    } 
    
    var p = Quiz.prototype;
    
    p.show = function() {

    }

    p.hide = function() {

    }

    var Question = function(question) {
        this.id = question.id;
        this.text = question.text;
        this.img = question.img;
        this.snd = question.snd;
        this.element = $("<span></span>");
        if (this.id)
            this.element.id = this.id;
        this.element.html(this.text);
    }

    var Source = function(id, type, source) {
        this.id = id;
        this.text = source.text;
        this.img = source.img;
        this.snd = source.snd;
        this.element = $("<div> </div>");
        this.element.attr("key", source.key);
        this.element.addClass("item");
        if (source.className)
            this.element.addClass(source.className);
        this.element.html("<span>" + source.txt + "</span>");
    }

    var Destination = function(id, type, destination) {
        this.id = id;
        this.text = destination.text;
        this.img = destination.img;
        this.snd = destination.snd;
        this.element = $("<div> </div>");
        this.element.attr("key", destination.key);
        this.element.addClass( "dropzone" );
        this.element.addClass( "source" );
        if (destination.className)
            this.element.addClass( destination.className );
        this.element.html("<p>" + destination.txt + "</p>");
        //this.element.append("<span> </span>");
    }

    $.fn.dragQuiz = function(quiz, type, params ) {
        var instance = new Quiz( quiz, type, params );
        return instance;
    };
    
} )( jQuery, window );
