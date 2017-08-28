/**
 * jquery.selectquiz.js v1.0.0
 *
 * Licensed under the MIT license.
 * 
 * Copyright 2017, @leio 
 * http://www.dodobaike.com
 */
;( function( $, window, undefined ) {
    
    'use strict';

    var Quiz = function( quiz, type, params ) {
       this.element = $("<div class='select-quiz'> </div>");
       this.element.attr('style',  "position: absolute;left:0; top: 0; z-index: 999"); 
       for (var key in params) {
           this.element.css(key, params[key]);
       }
       this.time = quiz.time;
       this.question = new Question(quiz.question);
       this.element.append(this.question.element);
       this.choices = [];
       for (var choiceIdx in quiz.choices) {
           var choice = new Choice(choiceIdx, type, this.question.id, quiz.choices[choiceIdx]); 
           this.choices.push(choice); 
           this.element.append(choice.element);
           console.log(this.element);
       }
       this.solved = false;
       this.element.hide();
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

    var Choice = function(id, type, questionId, choice) {
        this.id = id;
        this.question = questionId;
        this.text = choice.text;
        this.img = choice.img;
        this.snd = choice.snd;
        this.isAnswer = (choice.isAnswer !== undefined) ? choice.isAnswer : false;
        this.element = $("<div> </div>");
        this.label = $("<label> </label>");
        this.input = $("<input type=" + type + "></input>");
        this.input.attr("id", id);
        this.input.attr("name", this.question);
        this.input.attr("isAnswer", this.isAnswer);
        var color = choice.color ? choice.color: "red";
        this.content1 = $("<span class='btn btn-" + color + "'></span>");
        this.content2 = $("<span></span>");
        this.content2.html(this.text);
        this.element.append(this.label);
        this.label.append(this.input);
        this.label.append(this.content1);
        this.label.append(this.content2);
    }

    $.fn.selectQuiz = function(quiz, type, params ) {
        var instance = new Quiz( quiz, type, params );
        return instance;
    };
    
} )( jQuery, window );
