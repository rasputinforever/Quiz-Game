//quiz questions and answers
var quizQuestions = [
    {
        question: "Welcome to the QUIZ SHOW! You will have 60 seconds to answer all the questions! Click on this text to begin!",
        choices: ["", "", "", ""],
        answer: 1
    },
    {
        question: "Which of the following is a pesticide?",
        choices: ["Piperonyl Butoxide", "Zinc", "Hexane", "Mitragynine"],
        answer: 1
    },
    {
        question: "Which of the following hydrocarbons contains seven carbon atoms?",
        choices: ["Propane", "n-Heptane", "Ethane", "Octane"],
        answer: 2
    },
    {
        question: "Which of the following is the object that spreads a mixture prior to detection?",
        choices: ["inlet", "column", "quadrapole", "pump"],
        answer: 2
    },
    {
        question: "What type of re=work would be used to re-analyze a result which exceeds the calibration curve?",
        choices: ["re-sampling", "re-injection", "re-extraction", "re-dilution"],
        answer: 4
    },
    {
        question: "Which of the following terms is a synonym of Gaussian distribution?",
        choices: ["precise", "random", "homogenous", "normal"],
        answer: 4
    },
    {
        question: "You finished the Game!",
        choices: ["High Score: ", "Second Place: ", "Third Place: ", "Fourth Place: "],
        answer: 0
    }
];

//status keeper and rules for QUIZ game
var quizStatus = {
    questionNum: 1,
    questionAsked: false,
    correctAnswer: 1,
    gameLength: 60,
    timerPunishment: 10
};


//get item then check if null
var localHistory = JSON.parse(localStorage.getItem('localHistory'))

//JSON Stringify to store un-set item, then get the item and un-stringify
if (localHistory === null) {
    //default values if no local storage exists
    var scoreHistory = [
        ['Erik', 50],
        ['Justin', 45],
        ['Mishka', 40],
        ['Rasputin' , 35],
        ['Dummy', 0]
    ];
    localStorage.setItem('localHistory', JSON.stringify(scoreHistory));    
} 

localHistory = JSON.parse(localStorage.getItem('localHistory'))


var oldLocalhistory = JSON.parse(localStorage.getItem('localHistory'))



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
        answerEl.addEventListener('click', function () {            
            
            if (parseInt(this.id.charAt(this.id.length - 1)) === quizStatus.correctAnswer) {
                
                answerResult.textContent = "Last Question: Correct!";
            } else {
                answerResult.textContent = "Last Question: Wrong!";
                timerCounter.textContent = timerCounter.textContent - quizStatus.timerPunishment;        
            }            
            //set game status to false, this triggers the next question to be asked on next timer iteration
            quizStatus.questionAsked = false;
            //update to next question for next question
            quizStatus.questionNum++;
            quizStatus.correctAnswer = quizQuestions[quizStatus.questionNum].answer;
        });    
    }

    //creates status reproter area
    var answerResult = document.createElement("p");
    answerResult.id = "answer-result";
    quizCanvas.appendChild(answerResult);


//quiz-game script
function startTimer(){
    


    //kill "start game" from canvas
    quizCanvas.removeEventListener("click", startTimer);
    //set counter
    timerCounter.textContent = quizStatus.gameLength;
    var counter = timerCounter.textContent;
    //reveal counter
    document.getElementById("timer").style = "color: black;"
    
    
    //this helps the game run and makes it able to STOP later... it had to be assigned to a function
    timerGame;
    //the actual game itself    
    var timerGame = setInterval(function() {

        //counter is both the time-left and eventual score. Each interval the timer passes to variable, then to DOM, then to variable so that the various interactions work with the game itself without having to pass around the variable.
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
            //status bar
            
        }        
        
        //updates timer every tick
        counter--;
        timerCounter.textContent = counter;
        //end-game checkers here.

        //time-up event. If time ends, trigger "game over" endgame.       
        if (counter < 1) {
            clearInterval(timerGame);

            //update play area
            quizQuestion.textContent = "You're out of time!"
            answerResult.textContent = "Click HERE to try again!";
            timerCounter.textContent = '';
            //load any stored data
            for (var i = 0; i < 4; i++) {                
                answerEl = document.getElementById("answer-" + (i + 1));
                answerEl.textContent = quizQuestions[6].choices[i] + localHistory[i][0] + " " + localHistory[i][1];
            }

            //set the game status back to default
            quizCanvas.addEventListener("click", startTimer);            
            quizStatus = {
                questionNum: 1,
                questionAsked: false,
                correctAnswer: 1,
                gameLength: 60,
                timerPunishment: 10
            };
        }

        //quiz over condition: if all questions answered, trigger "success" endgame. counter must be > 0 to "win". 
        if (quizStatus.questionNum > quizQuestions.length - 2) {
            //stops timer

        

            clearInterval(timerGame);

            timerCounter.textContent = "Final Score: " + timerCounter.textContent;

            //update status
            quizQuestion.textContent = quizQuestions[6].question;
            answerResult.textContent = "The game is over! Click HERE to try again!";

            //ask for player name, store that with score in local storage
            

            //update play area to display high-scores plus new high score if applicable            
            var newRecord = 0;
            
            //update answers to high scores
            for (var i = 0; i < 4; i++) {   
                           
                //check if new record
                if (counter > localHistory[i][1] && newRecord === 0) {
                    var playerName = prompt("You got a high score! Please enter your name:")
                    answerResult.textContent = "You got a new record! Click HERE to play again!";   
                    answerEl = document.getElementById("answer-" + (i + 1));                 
                    answerEl.textContent = quizQuestions[6].choices[i] + playerName + " " + counter;
                    newRecord++;

                    localHistory[i][0] = playerName;
                    localHistory[i][1] = counter;

                } else {
                    answerEl = document.getElementById("answer-" + (i + 1));
                    answerEl.textContent = quizQuestions[6].choices[i] + oldLocalhistory[i - newRecord][0] + " " + oldLocalhistory[i - newRecord][1];
                    localHistory[i][0] = oldLocalhistory[i - newRecord][0];
                    localHistory[i][1] = oldLocalhistory[i - newRecord][1];
                }

            }
            //save local storage high scores
            
            localStorage.setItem('localHistory', JSON.stringify(localHistory));





            //re-assign StartTimer to canvas, reset defaults
            quizCanvas.addEventListener("click", startTimer);
            quizStatus = {
                questionNum: 1,
                questionAsked: false,
                correctAnswer: 1,
                gameLength: 60,
                timerPunishment: 10
            };
        };
        }, 1000);
};


