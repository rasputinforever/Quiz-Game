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

var quizStatus = {};

resetQuizStatus();



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

    //userform for name entry
    var userNameform = document.createElement("FORM");
    userNameform.id = "user-name-form";
    quizCanvas.appendChild(userNameform);  
    var userNameenter = document.createElement("INPUT");
    userNameenter.setAttribute("type", "text");
    userNameenter.setAttribute("value", quizStatus.enteredName);
    userNameform.appendChild(userNameenter);

    var userNamebutton = document.createElement("button");
    userNamebutton.id = "user-name-button";
    userNamebutton.innerText = "Submit"
    quizCanvas.appendChild(userNamebutton);
    userNamebutton.addEventListener("click", gameWin);

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
    //this variable makes it possible to use the clearInterval function
    timerGame;

    //the active game is an interval, at each tick it checks game status to update itself or if the game is over. 
    var timerGame = setInterval(function() {
        //quesiton updator
        questionAsked();              
        
        //updates timer every tick
        timerCounter.textContent--;

        //end-game checkers here.
            //time-up event. If time ends (<1), trigger "game over" endgame.
            if (timerCounter.textContent < 1) {
                gameLose(timerGame);
            } else if (quizStatus.questionNum > quizQuestions.length - 2) {
                getUsername(timerGame);
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

function gameLose(timerGame) {
    //stops game
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
    resetQuizStatus();
};

function getUsername(timerGame) {
    //stops game, gets name of User
    clearInterval(timerGame);
    for (var i = 0; i < 4; i++) {                
        answerEl = document.getElementById("answer-" + (i + 1));
        answerEl.style.visibility = "hidden";
    }
    quizQuestion.textContent = "You completed the quiz!"
    answerResult.style.textAlign = "center";
    answerResult.style.fontSize = "40px";
    answerResult.textContent = "Please enter your name below!"     
    userNameform.style.visibility = "visible";
    userNamebutton.style.visibility = "visible";
}

//game success
function gameWin() {
    //hides user-form
    userNameform.style.visibility = "hidden";
    userNamebutton.style.visibility = "hidden";
    console.log(userNameenter.value);
    quizStatus.enteredName = userNameenter.value;


    //update status to show previous high-scores in next steps
    quizQuestion.textContent = quizQuestions[6].question;
    //game status alert update

    answerResult.textContent = "The game is over! Click HERE to try again!";
    //this function is a little helper that allows the loop to account for a new high score. By referencing the localHistory and oldLocalhistory it can display the new records and log those records without deleting a record... if that makes sense. It also prevents the loop from creating duplicates of the high-record as a record > 3rd place would also be greater than 4th place, etc.
    var newRecord = 0;                
    //update answers to high scores and create new local history
    for (var i = 0; i < 4; i++) {  
        answerEl.style.visibility = "visible";                             
        //check if new record
        if (timerCounter.textContent > localHistory[i][1] && newRecord === 0) {
            //only prompts when a high score happens. Nice work!
            answerResult.textContent = "You got a new record!";   
            answerEl = document.getElementById("answer-" + (i + 1));                 
            answerEl.textContent = quizQuestions[6].choices[i] + quizStatus.enteredName + " " + timerCounter.textContent;
            //here's that checker to stop this path from happening twice
            newRecord++;
            //logging new record into localHistory
            localHistory[i][0] = quizStatus.enteredName;
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
        //show user their score
        timerCounter.textContent = quizStatus.enteredName + "'s Final Score: " + timerCounter.textContent;
    //save to local storage high scores                
    localStorage.setItem('localHistory', JSON.stringify(localHistory));

    resetQuizStatus();

    // //re-assign StartTimer to canvas, reset defaults for next play
     // quizCanvas.addEventListener("click", preGame);

};

//loops through and shows the current high scores
function showHighscores() {
    for (var i = 0; i < 4; i++) {                
        answerEl = document.getElementById("answer-" + (i + 1));
        answerEl.textContent = quizQuestions[6].choices[i] + localHistory[i][0] + " " + localHistory[i][1];
    }
}

//default settings reset
function resetQuizStatus() {
    quizStatus =  {
        questionNum: 1,
        questionAsked: false,
        correctAnswer: 1,
        gameLength: 60,
        timerPunishment: 10,
        preGametimer: 5,
        enteredName: 'your name here'
    }
};

//checks if clicked answer is correct then sets up mainGame for next question
function answerClick () {
    if (parseInt(this.id.charAt(this.id.length - 1)) === quizStatus.correctAnswer) {
        this.className = "quiz-answer quiz-answer-correct";
        answerResult.textContent = "Last Question: Correct!";
    } else {
        this.className = "quiz-answer quiz-answer-wrong";
        answerResult.textContent = "Last Question: Wrong!";
        timerCounter.textContent = timerCounter.textContent - quizStatus.timerPunishment;        
    }    
    //update game status to next question for next iteration
    quizStatus.questionAsked = false;
    quizStatus.questionNum++;
    quizStatus.correctAnswer = quizQuestions[quizStatus.questionNum].answer;
}