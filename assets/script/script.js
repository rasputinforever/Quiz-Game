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
    gameLength: 60,
    timerPunishment: 10
};

//default values if no local storage exists
var scoreHistory = [
    ['Erik', 50],
    ['Justin', 45],
    ['Mishka', 40],
    ['Rasputin' , 35],
    ['Dummy', 0]
];

//get item then check if null
var localHistory = localStorage.getItem('scoreHistory');

//JSON Stringify to store un-set item, then get the item and un-stringify
if (localHistory === null) {
    localHistory = JSON.stringify(scoreHistory);
    localStorage.setItem('localHistory', localHistory);
} else {
    localHistory = localStorage.getItem('localHistory');    
}

localHistory = JSON.parse(localHistory);
scoreHistory = localHistory;



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
                timerCounter.textContent = timerCounter.textContent - quizStatus.timerPunishment;        
            }            
            //set game status to false, this triggers the next question to be asked on next timer iteration
            quizStatus.questionAsked = false;
            //update to next question for next question
            quizStatus.questionNum++;
            quizStatus.correctAnswer = quizQuestions[quizStatus.questionNum].answer;
            
            


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
                answerEl = document.getElementById("answer-" + (i + 1));
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

        //quiz over condition: if all questions answered, trigger "success" endgame. counter must be > 0 to "win". 
        if (quizStatus.questionNum > 1) {
            //stops timer
            clearInterval(timerGame);

            //update status
            quizQuestion.textContent = quizQuestions[6].question;
            answerResult.textContent = "The game is over! Click HERE to try again!";

            //ask for player name, store that with score in local storage
            var playerName = prompt("Please enter your Name!")

            //update play area to display high-scores plus new high score if applicable            
            var newRecord = 0;
            //update answers to high scores
            for (var i = 0; i < 4; i++) {                

                //check if new record
                if (counter > scoreHistory[i][1] && newRecord < 1) {
                    answerResult.textContent = "You got a new record! Click HERE to play again!";   
                    answerEl = document.getElementById("answer-" + (i + 1));                 
                    answerEl.textContent = quizQuestions[6].choices[i] + playerName + " " + counter;
                    newRecord++;
                } else {
                    answerEl = document.getElementById("answer-" + (i + 1));
                    console.log(i - newRecord);
                    answerEl.textContent = quizQuestions[6].choices[i] + scoreHistory[i - newRecord][0] + " " + scoreHistory[i - newRecord][1];
                }

            }
            //re-assign StartTimer to canvas
            quizCanvas.addEventListener("click", startTimer);
            timerCounter.textContent = quizStatus.gameLength;
        };


        
        


        }, 1000);
};


