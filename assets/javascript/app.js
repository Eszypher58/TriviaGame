$(document).ready(function(){

	var queryURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple"

	var questionObj;
	var maxChoice = 4;
	var correctChoice = 0;
	var allowedTime = 30;
	var resultTime = 30000; //3 seconds
	var numbCorrect = 0;
	var numbWrong = 0;
	var numbUnanswered = 0;
	var setIntervalId;

	var triviaGameHtmlContent = $("#firstContainer");
	var original = $('body').html(); //possible better way to do this...

	//hide start button before ajax is ready
	$("#start").hide();	

	//Use ajax to get 10 computer Trivia qustion from openTrivia DB
	$.ajax({

		url: queryURL,
		method: "GET"
	}).done(function(response) {

		//set questionObj to result of the response, which is the array of questions/answer
		questionObj = response.results;
		//show start button ocne the question are loaded
		$("#loading").hide();
		$("#start").show();

	});

	//define TriviaGame Object
	var TriviaGame = {

		timeGiven: allowedTime,
		currQuestion: 0,

		reset: function() {

			currQuestion = 0;
			timeGiven = allowedTime;
			$('body').html(original);
			$("#start").hide();	

		},

		start: function() {

			//at start, clear previous content and create proper HTML structure
			triviaGameHtmlContent.html("");
			initStructure(triviaGameHtmlContent);
	        
			//set countdown to update every 1 second
	        setIntervalId = setInterval(TriviaGame.count, 1000);

			//update time to reflect the allowedTime	        
	        $("#time").html(TriviaGame.timeGiven);

	        //display Question and Answer
	        TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);

	        //attach eventlistener to 4 answers, event listener gets destroyed as html gets updated dynamically. so binding has to happen as often as dynamic html update.
	        bindEvent();

    	},

    	stop: function() {

    		//stop countdown by clearing setIntervalId
    		clearInterval(setIntervalId);

    	},

    	//count does three things
    	//	1.catch an edge case where if user let time elapse without answering the last question
    	//	2.if the allowed time elapsed, numUnanswered needs to go up by one; allowed time resets; nextQuestion is called
    	//	3. update time 
    	count: function() {

    		if (TriviaGame.timeGiven <= 0 && TriviaGame.currQuestion >= 9){
    			//case 1
    			numbUnanswered++;
    			TriviaGame.nextQuestion();

    		} else { 

    			if (TriviaGame.timeGiven <= 0) {
    				//case 2
	    			numbUnanswered++;
	    			TriviaGame.showTimeOver();
				
					setTimeout(function() {
					
						TriviaGame.nextQuestion();

					}, resultTime);

				} else {
    				//case3
    				TriviaGame.timeGiven--;
    				$("#time").html(TriviaGame.timeGiven);

    			}
			}
    	},

    	//disuplay question and answer to the screen
    	updateQuestionAnswer: function(number) {

			$("#question").html("Q" + (TriviaGame.currQuestion + 1) + ": " + questionObj[number].question);
			TriviaGame.updateAnswer(number);


		},

		//display answer to the screen while randomizing correct answer placement to one of 4 possible location
		updateAnswer: function(number) {
			

			correctChoice = Math.floor(1 + (Math.random() * 4));
			
			//index to select incorrect answer from incorrect_answers array in questionObj
			var index = 0;
			
			//randomly choose where correct answer is placed
			$("#" + correctChoice).html(questionObj[number].correct_answer);
			
			//place all the wrong answers in other slots
			for (var i = 1; i <= maxChoice; i++) {

				if (i !== correctChoice) {

					$("#" + i).html(questionObj[number].incorrect_answers[index]);
					index++;

				}


			}
		},

		//when called, display the next question.
		nextQuestion: function() {

			//we have reached the last question
			if (TriviaGame.currQuestion >= 9) {

				//stop the game
				TriviaGame.stop();

				//show result...
				TriviaGame.showResult();

			} else {

				//reset allowed time
				TriviaGame.timeGiven = allowedTime;
				$("#time").html(TriviaGame.timeGiven);
				//go to next question
				TriviaGame.currQuestion++;
				//stop the previous setinterval
				TriviaGame.stop();
				//start new setinterval
				TriviaGame.start();


			}

		},

		//dynamicall generate the results page
		showResult: function() {

			//clear previous content
			var content = triviaGameHtmlContent;
			content.html("");

			//add new contents
			appendRowAndCol(content, 12, 'h1', "Trivia Game", "", "");
			appendRowAndCol(content, 12, 'h2', "~Your Report Card~", "", "");
			appendRowAndCol(content, 12, 'h3', "Number of Correct: " + numbCorrect, "", "");
			appendRowAndCol(content, 12, 'h3', "Number of Incorrect: " + numbWrong, "", "");
			appendRowAndCol(content, 12, 'h3', "Number of Unanswered: " + numbUnanswered, "", "");
			appendRowAndCol(content, 12, 'h1', "Restart?", "", "");
			appendRowAndCol(content, 12, 'button', "YES!", "reset", "btn btn-lg btn-default");

			//attach eventlistener to reset button. When clicked, resets the game
			$("#reset").on("click", function() {

				//resets game
				TriviaGame.reset();

			})

		},

		//When user answers a Question correctly, this is called to update page to show a correct screen
		showCorrect: function() {

			TriviaGame.stop();

			var content = triviaGameHtmlContent;
			content.html("");

			appendRowAndCol(content, 12, 'h1', "Trivia Game", "", "");
			appendRowAndCol(content, 12, 'h2', "Congratulation! You are RIGHT!", "", "");
			appendRowAndCol(content, 12, 'img', "", "correctImg", "");
			$("#correctImg").attr("class", "img-responsive center-block");
			$("#correctImg").attr("src", "http://i0.kym-cdn.com/photos/images/original/000/909/991/48c.jpg");

			appendRowAndCol(content, 12, 'h3', "Correct Answer is: " + questionObj[TriviaGame.currQuestion].correct_answer, "", "");


		},

		//When user answers a Question correctly, this is called to update page to show a correct screen
		showWrong: function() {

			TriviaGame.stop();	

			var content = triviaGameHtmlContent;
			content.html("");

			appendRowAndCol(content, 12, 'h1', "Trivia Game", "", "");
			appendRowAndCol(content, 12, 'h2', "Sorry! You are Wrong!", "", "");
			appendRowAndCol(content, 12, 'img', "", "incorrectImg", "");
			$("#correctImg").attr("class", "img-responsive center-block");
			$("#incorrectImg").attr("src", "http://weknowmemes.com/wp-content/uploads/2012/09/if-i-agreed-with-you-we-would-both-be-wrong-bill-nye.jpg");
			appendRowAndCol(content, 12, 'h3', "Correct Answer is: " + questionObj[TriviaGame.currQuestion].correct_answer, "", "");

		},

		//When user didnt answer a question within alllowedTime, this is called to update page to show a out of time screen
		showTimeOver: function() {

			TriviaGame.stop();

			var content = triviaGameHtmlContent;
			content.html("");

			appendRowAndCol(content, 12, 'h1', "Trivia Game", "", "");
			appendRowAndCol(content, 12, 'h2', "Ooops! You are Out of TIME!", "", "");
			appendRowAndCol(content, 12, 'img', "", "correctImg", "");
			$("#correctImg").attr("class", "img-responsive");
			$("#correctImg").attr("src", "https://exgirlfriendrecovery.com/wp-content/uploads/2014/12/no-time.jpg");
			appendRowAndCol(content, 12, 'h3', "Correct Answer is: " + questionObj[TriviaGame.currQuestion].correct_answer, "", "");

		},

	}

	//At the start screen, when user click on start, start the Game
	$("#start").on("click", function(){

		TriviaGame.start();
		$("#firstContainer").css("border", "3px solid white");
		$("#firstContainer").css("border-radius", "10px");
		$("#firstContainer").css("background-color", "rgba(255,255,255, 0.7)");

	})

	//bind eventListner to all choice answers.
	//if user clicked on right answer, log that into numbCorrect, and show the correct screen
	//wait for resultTime before moving to nextQuestion();
	//if user clicked on wrong answer, log that into numbWrong, and show the wrong screen
	//wait for resultTime before moving to nextQuestion();
	function bindEvent() {

		$(".answers").on("click", function(){

			if ($(this).attr("id") === correctChoice.toString()) {

				numbCorrect++;
				TriviaGame.showCorrect();
				
				setTimeout(function() {
				
					TriviaGame.nextQuestion();

				}, resultTime);

			} else {

				numbWrong++;
				TriviaGame.showWrong();
				
				setTimeout(function() {
					
					TriviaGame.nextQuestion();

				}, resultTime);

			}

		})

	};

	//helper function to setup bootstrap row & column
	function appendRowAndCol(element, colSize, tag, content, id, tagClass) {

		var row = $("<div>");
		row.attr("class", "row text-center");
		var col = $("<div>");
		col.attr("class", "col-md-" + colSize);
		var data = $("<" + tag + ">");
		data.attr("id", id);
		data.attr("class", tagClass);
		data.html(content);
		col.append(data);
		row.append(col);
		element.append(row);

	};

	//heler function to setup structure
	function initStructure(element) {

		appendRowAndCol(element, 12, 'h1', "Trivia Game", "", "");
		appendRowAndCol(element, 12, 'h2', "Time Remaining: <span id='time'></span>", "", "");
		appendRowAndCol(element, 12, 'h3', "Question Here", "question", "");
		appendRowAndCol(element, 12, 'h4', "Answer 1", "1", "answers");
		appendRowAndCol(element, 12, 'h4', "Answer 2", "2", "answers");
		appendRowAndCol(element, 12, 'h4', "Answer 3", "3", "answers");
		appendRowAndCol(element, 12, 'h4', "Answer 4", "4", "answers");

	};



});