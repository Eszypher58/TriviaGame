$(document).ready(function(){

	var queryURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple"

	var questionObj;
	var correctChoice = 0;
	var allowedTime = 3;
	var maxChoice = 4;
	var numbCorrect = 0;
	var numbWrong = 0;
	var numbUnanswered = 0;
	//var currQuestion = 0;
	var setIntervalId;

	var triviaGameHtmlContent = $("#firstContainer");
	var original = $('body').html();

	//hide start button before ajax is ready
	$("#start").hide();	

	$.ajax({

		url: queryURL,
		method: "GET"
	}).done(function(response) {

		questionObj = response.results;
		//console.log(questionObj);
		//show start button ocne the question are loaded
		$("#start").show();

	});

	//define TriviaGame Object
	var TriviaGame = {

		timeGiven: allowedTime, //30 seconds
		currQuestion: 0,

		reset: function() {

			currQuestion = 0;
			timeGiven = allowedTime;
			$('body').html(original);
			//$('#start').on("click", function() {

			//	TriviaGame.start();


			//});

		},

		start: function() {

			triviaGameHtmlContent.html("");
			initStructure(triviaGameHtmlContent);
	        setIntervalId = setInterval(TriviaGame.count, 1000);
	        console.log("at start, currQuestion is " + TriviaGame.currQuestion);
	        
	        $("#time").html(TriviaGame.timeGiven);
	        TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);
	        bindEvent();
	        //TriviaGame.updateAnswer(TriviaGame.currQuestion);
	        //console.log(intervalId);
	        //clockRunning = true;

    	},

    	stop: function() {

    		clearInterval(setIntervalId);

    	},

    	count: function() {

    		if (TriviaGame.timeGiven <= 0 && TriviaGame.currQuestion >= 9){

    			numbUnanswered++;
    			TriviaGame.nextQuestion();

    		} else { 

    			if (TriviaGame.timeGiven <= 0) {

	    			TriviaGame.currQuestion++;
	    			numbUnanswered++;
	    			console.log("In count, currQuestion is " +TriviaGame.currQuestion);
	    			TriviaGame.timeGiven = allowedTime;
	    			$("#time").html(TriviaGame.timeGiven);
	    			TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);
	    			//TriviaGame.updateAnswer(TriviaGame.currQuestion);

				} else {
    			
    				TriviaGame.timeGiven--;
    				$("#time").html(TriviaGame.timeGiven);

    			}
			}
    	},

    	updateQuestionAnswer: function(number) {

		//	if (TriviaGame.currQuestion >= 10) {

				//show score
		//		TriviaGame.currQuestion = 0;
		//		TriviaGame.stop();

		//	} else {

				$("#question").html("Q" + (TriviaGame.currQuestion + 1) + ": " + questionObj[number].question);
				//console.log(questionObj[number].question);
				TriviaGame.updateAnswer(number);

		//	}

		},

		updateAnswer: function(number) {
		
			correctChoice = Math.floor(1 + (Math.random() * 4));
			var j = 0;
			
			//console.log(questionObj[number].correct_answers);
			
			$("#" + correctChoice).html(questionObj[number].correct_answer);
			
			for (var i = 1; i <= maxChoice; i++) {

				if (i !== correctChoice) {

					$("#" + i).html(questionObj[number].incorrect_answers[j]);
					j++;

				}


			}
		},

		nextQuestion: function() {

			
			if (TriviaGame.currQuestion >= 9) {

				TriviaGame.stop();

				//show result...
				TriviaGame.showResult();

			} else {

				bindEvent();
				TriviaGame.timeGiven = allowedTime;
				TriviaGame.currQuestion++;
				TriviaGame.stop();
				//triviaGameHtmlContent.html("");
				//initStructure(triviaGameHtmlContent);
				TriviaGame.start();
				//TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);


			}

			

			/*
			TriviaGame.timeGiven = 5;
			TriviaGame.currQuestion++;
			TriviaGame.stop();
			TriviaGame.start();
			//TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);
			*/
		},


		showResult: function() {

	
				


			var content = triviaGameHtmlContent;
			content.html("");
			appendRowAndCol(content, 12, 'h1', "Trivia Game", "", "");
			appendRowAndCol(content, 12, 'h2', "~Your Report Card~", "", "");
			appendRowAndCol(content, 12, 'h3', "Number of Correct: " + numbCorrect, "", "");
			appendRowAndCol(content, 12, 'h3', "Number of Incorrect: " + numbWrong, "", "");
			appendRowAndCol(content, 12, 'h3', "Number of Unanswered: " + numbUnanswered, "", "");
			appendRowAndCol(content, 12, 'h1', "Restart?", "", "");
			appendRowAndCol(content, 12, 'button', "YES!", "reset", "btn btn-lg btn-default");

			$("#reset").on("click", function() {

				TriviaGame.reset();


			})

		},

		showCorrect: function() {

			TriviaGame.stop();

			console.log("showCorrect");

			var content = triviaGameHtmlContent;
			content.html("");
			appendRowAndCol(content, 12, 'h1', "Trivia Game", "", "");
			appendRowAndCol(content, 12, 'h2', "Congratulation! You are RIGHT!", "", "");
			//appendRowAndCol(content, 12, 'h3', "Correct Answer is" + numbCorrect, "", "");
			//appendRowAndCol(content, 12, 'h3', "Number of Incorrect: " + numbWrong, "", "");

			//setTimeout(TriviaGame.nextQuestion, 3000);

		},

		showWrong: function() {

					TriviaGame.stop();

				console.log("showWrong");	

			var content = triviaGameHtmlContent;
			content.html("");
			appendRowAndCol(content, 12, 'h1', "Trivia Game", "", "");
			appendRowAndCol(content, 12, 'h2', "Sorry! You are Wrong!", "", "");
			appendRowAndCol(content, 12, 'h3', "Correct Answer is" + questionObj[TriviaGame.currQuestion].correct_answer, "", "");
			//appendRowAndCol(content, 12, 'h3', "Number of Incorrect: " + numbWrong, "", "");
			//initStructure(content);
						//setTimeout(TriviaGame.nextQuestion, 3000);

		}

	}





/*
	function updateQuestion(number) {

		if (currQuestion >= 10) {

			//show score

		} else {

			$("#question").html(questionObj[number].question);

		}

	}
*/

/*
	function updateAnswer(number) {
		correctChoice = Math.floor(1 + (Math.random() * 4));
		var j = 0;
		console.log(questionObj[number].correct_answers);
		$("#a" + correctChoice).html(questionObj[number].correct_answer);
		for (var i = 1; i <= maxChoice; i++) {

			if (i !== correctChoice) {

				$("#a" + i).html(questionObj[number].incorrect_answers[j]);
				j++;

			}


		}
	}
*/	

	//updateAnswer();



	$("#start").on("click", function(){

		//console.log("click on start");

		//create trivia game structure
		
		//triviaGameHtmlContent.html("");
		//initStructure(triviaGameHtmlContent);

		//updateQuestion(0);
		//updateAnswer(0);

		TriviaGame.start();

		//wait(timeGiven);

/*
		$(".answers").on("click", function(){

		//updateAnswer();
			//console.log("clicked " + $(this).attr("id"));
			console.log("currQuestion is: " + TriviaGame.currQuestion);
			console.log("clickon: " + $(this).attr("id"));

				if ($(this).attr("id") === correctChoice.toString()) {

					numbCorrect++;
					console.log("# of Correct: " + numbCorrect);
					TriviaGame.showCorrect();
					setTimeout(function() {

						triviaGameHtmlContent.html("");
						initStructure(triviaGameHtmlContent)
						TriviaGame.nextQuestion();

					}, 3000);
					//triviaGameHtmlContent.html("");
					//initStructure(triviaGameHtmlContent);
					TriviaGame.nextQuestion();

				} else {

					numbWrong++;
					console.log("# of Wrong: " + numbWrong);
					TriviaGame.showWrong();
					setTimeout(function() {

						triviaGameHtmlContent.html("");
						initStructure(triviaGameHtmlContent);
						TriviaGame.nextQuestion();

					}, 3000);
					//triviaGameHtmlContent.html("");
					//initStructure(triviaGameHtmlContent);
					//TriviaGame.nextQuestion();

				}



		})
*/
	})

	function bindEvent() {

		$(".answers").on("click", function(){

		//updateAnswer();
			//console.log("clicked " + $(this).attr("id"));
			console.log("currQuestion is: " + TriviaGame.currQuestion);
			console.log("clickon: " + $(this).attr("id"));
/*
			if (TriviaGame.currQuestion > 9) {

				TriviaGame.stop();
				TriviaGame.showResult();


			} else {
*/
				if ($(this).attr("id") === correctChoice.toString()) {

					numbCorrect++;
					console.log("# of Correct: " + numbCorrect);
					TriviaGame.showCorrect();
					setTimeout(function() {

						//triviaGameHtmlContent.html("");
						//initStructure(triviaGameHtmlContent)
						TriviaGame.nextQuestion();

					}, 3000);
					//triviaGameHtmlContent.html("");
					//initStructure(triviaGameHtmlContent);
					//TriviaGame.nextQuestion();

				} else {

					numbWrong++;
					console.log("# of Wrong: " + numbWrong);
					TriviaGame.showWrong();
					setTimeout(function() {

						//triviaGameHtmlContent.html("");
						//initStructure(triviaGameHtmlContent);
						TriviaGame.nextQuestion();

					}, 3000);
					//triviaGameHtmlContent.html("");
					//initStructure(triviaGameHtmlContent);
					//TriviaGame.nextQuestion();

				}

			//}

		})



	}

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

	}

	function initStructure(element) {

		appendRowAndCol(element, 12, 'h1', "Trivia Game", "", "");
		appendRowAndCol(element, 12, 'h2', "Time Remaining: <span id='time'></span>", "", "");
		appendRowAndCol(element, 12, 'h3', "Question Here", "question", "");
		appendRowAndCol(element, 12, 'h4', "Answer 1", "1", "answers");
		appendRowAndCol(element, 12, 'h4', "Answer 2", "2", "answers");
		appendRowAndCol(element, 12, 'h4', "Answer 3", "3", "answers");
		appendRowAndCol(element, 12, 'h4', "Answer 4", "4", "answers");

	}



})