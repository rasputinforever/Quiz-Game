//quiz questions and answers
var quizQuestions = [
    {
        question: "Welcome to the QUIZ SHOW! You will have 60 seconds to answer each question! Click HERE to start!",
        choices: ["", "", "", ""],
        answer: 1,
    },
    {
        question: "Please click the first answer.",
        choices: ["Banana", "Apple", "Persimon", "Turkey"],
        answer: 1
    },
    {
        question: "Please click the second answer.",
        choices: ["Dogs", "Cats", "Mice", "Peaches"],
        answer: 2
    },
    {
        question: "Please click the third answer.",
        choices: ["one", "two", "three", "four"],
        answer: 3
    },
    {
        question: "Please click the fourth answer.",
        choices: ["one", "two", "three", "four"],
        answer: 4
    },
    {
        question: "Please click the last answer.",
        choices: ["one", "two", "three", "four"],
        answer: 4
    }
];

//status keeper for QUIZ game
var quizStatus = {
    questionNum: 1,
    questionAsked: false,
    correctAnswer: 0,
    gameLength: 60
};


//set up page

//set up play area
var quizCanvas = document.createElement("main");
quizCanvas.id = "quiz-area";
document.body.appendChild(quizCanvas);
//"start game" added to play-area, will be killed at start of game
quizCanvas.addEventListener("click", startTimer);

//timer / score
var timerCounter = document.createElement("h2");
timerCounter.id = "timer";
quizCanvas.appendChild(timerCounter);
timerCounter.textContent = quizStatus.gameLength;


//Questions are pasted here
var quizQuestion = document.createElement("p");
quizQuestion.id = "quiz-question";
quizCanvas.appendChild(quizQuestion);
//initial "intro" text
quizQuestion.textContent = quizQuestions[0].question;

//creates answer p-tags
for (var i = 0; i < quizQuestions[0].choices.length; i++) {
    var answerEl = document.createElement("p")
    answerEl.id = "answer-" + (i + 1);
    answerEl.className = "quiz-answer";
    quizCanvas.appendChild(answerEl);
    answerEl.textContent = quizQuestions[0].choices[i];

    //answer checker function
    answerEl.addEventListener('click', function (counter) {            
        
        if (parseInt(this.id.charAt(this.id.length - 1)) === quizStatus.correctAnswer) {
            answerResult.textContent = "correct!";
        } else {
            answerResult.textContent = "wrong!";
            timerCounter.textContent = timerCounter.textContent - 10;        
        }

        
        //set to false, this triggers the next question to be asked
        quizStatus.questionAsked = false;
        //update to next question
        quizStatus.questionNum++;
        quizStatus.correctAnswer = quizQuestions[quizStatus.questionNum].answer;

        //quiz over condition

    });    
}

//creates status area
var answerResult = document.createElement("p");
answerResult.id = "answer-result";
quizCanvas.appendChild(answerResult);


//quiz-game starter
function startTimer(){

    //kill "start game"
    quizCanvas.removeEventListener("click", startTimer);

    var counter = timerCounter.textContent;

    document.getElementById("timer").style = "color: black;"

    setInterval(function() {
        
        //counter is both the time-left and eventual score.
        counter = timerCounter.textContent;

       

        //checks if the question-answers need to be refreshed to the next
        if (!quizStatus.questionAsked) {

            //this loop updates the question, so first thing: set "asked" = true
            quizStatus.questionAsked = true;

            //update question
            quizQuestion.textContent = quizQuestions[quizStatus.questionNum].question;



            //update answers, loop through array for each answer element
            for (var i = 0; i < 4; i++) {
                var answerEl = document.getElementById("answer-" + (i + 1));
                answerEl.textContent = quizQuestions[quizStatus.questionNum].choices[i];
            };

            //
            answerResult.textContent = "Answer Carefully...";
        }        
        
        //updates timer every tick
        counter--;
        timerCounter.textContent = counter;

        //time-up event
        
        }, 1000);
};


