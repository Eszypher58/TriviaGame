$(document).ready(function(){

	var queryURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple"

	var questionObj;
	var correctChoice = 0;
	//var timeGiven = 30000;
	var maxChoice = 4;
	var numbCorrect = 0;
	var numbWrong = 0;
	//var currQuestion = 0;
	var setIntervalId;

	//hide start button before ajax is ready
	$("#start").hide();	

	$.ajax({

		url: queryURL,
		method: "GET"
	}).done(function(response) {

		questionObj = response.results;
		console.log(questionObj);
		//show start button ocne the question are loaded
		$("#start").show();

	});

	//define TriviaGame Object
	var TriviaGame = {

		timeGiven: 5, //30 seconds
		currQuestion: 0,

		resetTime: function() {

			TriviaGame.timeGiven = 30;

		},

		resetQuestion: function() {

			TriviaGame.currQuestion = 0;

		},

		start: function() {

	        setIntervalId = setInterval(TriviaGame.count, 1000);
	        console.log("start clicked");
	        $("#time").html(TriviaGame.timeGiven);
	        TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);
	        //TriviaGame.updateAnswer(TriviaGame.currQuestion);
	        //console.log(intervalId);
	        //clockRunning = true;

    	},

    	stop: function() {

    		clearInterval(setIntervalId);

    	},

    	count: function() {

    		if (TriviaGame.timeGiven <= 0) {

    			TriviaGame.currQuestion++;
    			console.log(TriviaGame.currQuestion);
    			TriviaGame.timeGiven = 5;
    			$("#time").html(TriviaGame.timeGiven);
    			TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);
    			//TriviaGame.updateAnswer(TriviaGame.currQuestion);

    		} else {
    			
    			TriviaGame.timeGiven--;
    			$("#time").html(TriviaGame.timeGiven);

    		}

    	},

    	updateQuestionAnswer: function(number) {

			if (TriviaGame.currQuestion >= 10) {

				//show score
				TriviaGame.currQuestion = 0;
				TriviaGame.stop();

			} else {

				$("#question").html(questionObj[number].question);
				console.log(questionObj[number].question);
				TriviaGame.updateAnswer(number);

			}

		},

		updateAnswer: function(number) {
		
			correctChoice = Math.floor(1 + (Math.random() * 4));
			var j = 0;
			
			console.log(questionObj[number].correct_answers);
			
			$("#" + correctChoice).html(questionObj[number].correct_answer);
			
			for (var i = 1; i <= maxChoice; i++) {

				if (i !== correctChoice) {

					$("#" + i).html(questionObj[number].incorrect_answers[j]);
					j++;

				}


			}
		},

		nextQuestion: function() {

			if (TriviaGame.currQuestion >= 10) {

				TriviaGame.stop();

				//show result...


			} else {


				TriviaGame.timeGiven = 5;
				TriviaGame.currQuestion++;
				TriviaGame.stop();
				TriviaGame.start();
				//TriviaGame.updateQuestionAnswer(TriviaGame.currQuestion);


			}



		},

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
		var triviaGameHtmlContent = $("#firstContainer");
		triviaGameHtmlContent.html("");
		initStructure(triviaGameHtmlContent);

		//updateQuestion(0);
		//updateAnswer(0);

		TriviaGame.start();

		//wait(timeGiven);

		$(".answers").on("click", function(){

		//updateAnswer();
			console.log("clicked " + $(this).attr("id"));

			if ($(this).attr("id") === correctChoice.toString()) {

				console.log("Correct");
				TriviaGame.nextQuestion();

			} else {

				console.log("Wrong");
				TriviaGame.nextQuestion();

			}


		})

	})

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