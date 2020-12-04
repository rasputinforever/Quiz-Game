//quiz questions and answers
var quizQuestions = [
    {
        question: "Welcome to the QUIZ GAME!",
        choices: ["", "", "", ""],
        answer: 1
    },
    {
        question: "Which of the following compounds would be classified as a pesticide?",
        choices: ["Piperonyl Butoxide", "Zinc", "Hexane", "Mitragynine"],
        answer: 1
    },
    {
        question: "Which of the following hydrocarbons contains seven carbon atoms?",
        choices: ["Propane", "n-Heptane", "Ethane", "Octane"],
        answer: 2
    },
    {
        question: "Which of the following instrumentation elements creates spread in chromatography?",
        choices: ["Needle", "Column", "Quadrapole", "Pump"],
        answer: 2
    },
    {
        question: "What type of re-work would be used to re-analyze a result which exceeds the calibration curve?",
        choices: ["re-Sampling", "re-Injection", "re-Extraction", "re-Dilution"],
        answer: 4
    },
    {
        question: "Which of the following terms is a synonym of \"Gaussian\" in \"Gaussian Distribution\"?",
        choices: ["Precise", "Random", "Homogenous", "Normal"],
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
    timerPunishment: 10,
    preGametimer: 5
};


//get item then check if null
var localHistory = JSON.parse(localStorage.getItem('localHistory'))

//JSON Stringify to store un-set item, then get the item and un-stringify
if (localHistory === null) {
    //default values if no local storage exists
    localHistory = [
        ['Erik', 50],
        ['Justin', 45],
        ['Mishka', 40],
        ['Rasputin' , 35],
        ['Dummy', 0]
    ];
    localStorage.setItem('localHistory', JSON.stringify(localHistory));    
} 

localHistory = JSON.parse(localStorage.getItem('localHistory'))

//a copy used as reference when creating a new high-score table
var oldLocalhistory = JSON.parse(localStorage.getItem('localHistory'))



//on-load page set-up
    //show-last-score button
    var showLastscores = document.createElement("section")
    showLastscores.id = "last-score-button";
    document.body.appendChild(showLastscores);
    showLastscores.innerText = "Click here to show High Scores"
    showLastscores.addEventListener("click", showHighscores);

    //set up canvas where game is played
    var quizCanvas = document.createElement("main");
    quizCanvas.id = "quiz-area";
    document.body.appendChild(quizCanvas);
    //"start game" added to play-area, will be killed at start of game, re-applied at end of game
    quizCanvas.addEventListener("click", preGame);

    //timer / score
    var timerCounter = document.createElement("h2");
    timerCounter.id = "timer";
    quizCanvas.appendChild(timerCounter);


    //Questions are posted here
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
        //answer checker function applied here, checks relative based on ID of clicked p-tag, then references game-status for if answer is correct
        answerEl.addEventListener('click', answerClick);    
    }    

    //creates status reproter area, just lets user know if the last question was correct or not
    var answerResult = document.createElement("p");
    answerResult.id = "answer-result";
    quizCanvas.appendChild(answerResult);
    answerResult.style.textAlign = "center";
    answerResult.style.fontSize = "40px";
    answerResult.textContent = "Click HERE to start!";
//Page set-up complete

//pre-game count-down that shows the game-rules/concept to user.
function preGame() {
    //removes event listener to avoid errors if user clicks again for some reason
    quizCanvas.removeEventListener("click", preGame);
    //shows user the game rules and sets the pre-game timer        
    answerResult.textContent = "You will have 60 seconds to answer all the questions in the quiz. The game will begin...";
    timerCounter.textContent = quizStatus.preGametimer;
    //this triggers for the sake of a re-initiation of the game on the same page-load
    for (var i = 0; i < 4; i++) {                
        answerEl = document.getElementById("answer-" + (i + 1));
        answerEl.textContent = "";
    }
    //reveal counter
    document.getElementById("timer").style = "color: black;"    
    var preGamegame = setInterval(function() {        
        quizStatus.preGametimer--;
        timerCounter.textContent = quizStatus.preGametimer;
        if (quizStatus.preGametimer === 1) {
            answerResult.textContent = "Now!";            
        }  else if (quizStatus.preGametimer < 1) {
            clearInterval(preGamegame);        
            //styling for alert
            answerResult.textContent = "";
            answerResult.style.textAlign = "right";
            answerResult.style.fontSize = "20px";
            answerResult.textContent = "";
        

            //this helps the game run and makes it able to STOP later... it had to be assigned to a function to do that. Hey, I don't ask questions, just trust me on this one.
            
            //set counter to start time main game
            timerCounter.textContent = quizStatus.gameLength;
            questionAsked()
            mainGame(); 
        }
    }, 1000);
};

function mainGame () {
    timerGame;

    //the active game is an interval, at each tick it checks game status to update itself or if the game is over. 
    var timerGame = setInterval(function() {
         
        questionAsked();
              
        
        //updates timer every tick
        timerCounter.textContent--;

        //end-game checkers here.

            //time-up event. If time ends (<1), trigger "game over" endgame.
            if (timerCounter.textContent < 1) {
                clearInterval(timerGame);

                //update play area to show high scores and sad alerts
                quizQuestion.textContent = "You're out of time!"
                answerResult.style.textAlign = "center";
                answerResult.style.fontSize = "40px";
                answerResult.textContent = "Click HERE to try again!";
                timerCounter.textContent = '';
                //load any stored data
                for (var i = 0; i < 4; i++) {                
                    answerEl = document.getElementById("answer-" + (i + 1));
                    answerEl.textContent = quizQuestions[6].choices[i] + localHistory[i][0] + " " + localHistory[i][1];
                }

                //set the game status back to default for next play
                quizCanvas.addEventListener("click", preGame);            
                quizStatus = {
                    questionNum: 1,
                    questionAsked: false,
                    correctAnswer: 1,
                    gameLength: 60,
                    timerPunishment: 10,
                    preGametimer: 3
                };
            }

            //quiz over condition: if all questions answered, trigger "success" endgame. counter must be > 0 to "win". 
            if (quizStatus.questionNum > quizQuestions.length - 2) {
                //stops timer
                clearInterval(timerGame);
                //show user their score
                timerCounter.textContent = "Final Score: " + timerCounter.textContent;
                //update status to show previous high-scores in next steps
                quizQuestion.textContent = quizQuestions[6].question;
                //game status alert update
                answerResult.style.textAlign = "center";
                answerResult.style.fontSize = "40px";
                answerResult.textContent = "The game is over! Click HERE to try again!";
                //this function is a little helper that allows the loop to account for a new high score. By referencing the localHistory and oldLocalhistory it can display the new records and log those records without deleting a record... if that makes sense. It also prevents the loop from creating duplicates of the high-record as a record > 3rd place would also be greater than 4th place, etc.
                var newRecord = 0;                
                //update answers to high scores and create new local history
                for (var i = 0; i < 4; i++) {                               
                    //check if new record
                    if (timerCounter.textContent > localHistory[i][1] && newRecord === 0) {
                        //only prompts when a high score happens. Nice work!
                        var playerName = prompt("You got a high score! Please enter your name:")
                        answerResult.textContent = "You got a new record! Click HERE to play again!";   
                        answerEl = document.getElementById("answer-" + (i + 1));                 
                        answerEl.textContent = quizQuestions[6].choices[i] + playerName + " " + timerCounter.textContent;
                        //here's that checker to stop this path from happening twice
                        newRecord++;
                        //logging new record into localHistory
                        localHistory[i][0] = playerName;
                        localHistory[i][1] = timerCounter.textContent;
                        answerEl.className = "quiz-answer quiz-answer-highscore";

                    } else {
                        //oldLocalhistory used as "memory" as localHistory gets overwritten in if script
                        answerEl = document.getElementById("answer-" + (i + 1));
                        answerEl.textContent = quizQuestions[6].choices[i] + oldLocalhistory[i - newRecord][0] + " " + oldLocalhistory[i - newRecord][1];
                        localHistory[i][0] = oldLocalhistory[i - newRecord][0];
                        localHistory[i][1] = oldLocalhistory[i - newRecord][1];
                    }

                }
                //save to local storage high scores                
                localStorage.setItem('localHistory', JSON.stringify(localHistory));

                //re-assign StartTimer to canvas, reset defaults for next play
                quizCanvas.addEventListener("click", preGame);
                quizStatus = {
                    questionNum: 1,
                    questionAsked: false,
                    correctAnswer: 1,
                    gameLength: 60,
                    timerPunishment: 10,
                    preGametimer: 3
                };
            };
    }, 1000);
}

function questionAsked() {
     //this updates the question if the game-status is set to False (which occurs after user selects an answer)
     if (!quizStatus.questionAsked) {
        //this loop updates the question, so first thing: set "asked" = true, it's set to false when user clicks on answer
        quizStatus.questionAsked = true;
        //update question
        quizQuestion.textContent = quizQuestions[quizStatus.questionNum].question;
        //update answers, loop through array for each answer element. It's locked at 4 so this is not dynamic.
        for (var i = 0; i < 4; i++) {
            answerEl = document.getElementById("answer-" + (i + 1));
            answerEl.textContent = quizQuestions[quizStatus.questionNum].choices[i];
            answerEl.className = "quiz-answer";
        };
    } 
}

//loops through and shows the current high scores
function showHighscores() {
    for (var i = 0; i < 4; i++) {                
        answerEl = document.getElementById("answer-" + (i + 1));
        answerEl.textContent = quizQuestions[6].choices[i] + localHistory[i][0] + " " + localHistory[i][1];
    }
}

function answerClick () {
    if (parseInt(this.id.charAt(this.id.length - 1)) === quizStatus.correctAnswer) {
        this.className = "quiz-answer quiz-answer-correct";
        answerResult.textContent = "Last Question: Correct!";
    } else {
        this.className = "quiz-answer quiz-answer-wrong";
        answerResult.textContent = "Last Question: Wrong!";
        timerCounter.textContent = timerCounter.textContent - quizStatus.timerPunishment;        
    }            
    //set game status to false, this triggers the next question to be asked on next timer iteration
    quizStatus.questionAsked = false;
    //update game status to next question for next iteration
    quizStatus.questionNum++;
    quizStatus.correctAnswer = quizQuestions[quizStatus.questionNum].answer;
}