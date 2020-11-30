//quiz questions and answers
var quizQuestions = [
    {
        question: "Welcome to the QUIZ SHOW! You will have 60 seconds to answer all the questions! Click on this text to begin!",
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
    },
    {
        question: "You finished the Game!",
        choices: ["1st Place: ", "Second Place: ", "Third Place: ", "Fourth Place: "],
        answer: 0
    }
];

//status keeper and rules for QUIZ game
var quizStatus = {
    questionNum: 1,
    questionAsked: false,
    correctAnswer: 0,
    gameLength: 1,
    timerPunishment: 10
};

//default values if no local storage exists
var scoreHistory = {
    placeFirst: ['Erik', 50],
    placeSecond: ['Justin', 45],
    placeThird: ['Mishka', 40],
    placeFourth: ['Rasputin' , 35],
    lastPlay: ['Dummy', 0]
};

var localHistory = localStorage.getItem('scoreHistory');
console.log(localHistory);

if (localHistory === null) {
    console.log("no history!")
}

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
                timerCounter.textContent = timerCounter.textContent - timerCounter.timerPunishment;        
            }            
            //set game status to false, this triggers the next question to be asked on next timer iteration
            quizStatus.questionAsked = false;
            //update to next question for next question
            quizStatus.questionNum++;
            quizStatus.correctAnswer = quizQuestions[quizStatus.questionNum].answer;
            
            //quiz over condition: if all questions answered, trigger "success" endgame. 
            
            //clearInterval(timerGame); << this is the function to stop the game

            //ask for player name, store that with score in local storage
            
            //update play area to display high-scores
                //interject player's high score if it falls within the top 5

            //

            //Say "You finished! Your Score is ___. Click HERE to play again!"

            //re-assign StartTimer to canvas




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
    
    timerGame;
    
    var timerGame = setInterval(function() {
        
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

        //time-up event. If time ends, trigger "game over"
        
        if (counter <= 0) {
            console.log("game over!")
            clearInterval(timerGame);

            //update play area

            //load any stored data

            //say "sorry, try again"

            //set the game status back to default

            //re-add on the event listener to canvas




        }


        }, 1000);
};


