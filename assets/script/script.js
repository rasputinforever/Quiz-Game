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

//status keeper and rules for QUIZ game (see functions list near bottom)
var quizStatus = {};
//this is used at end-of-game
resetQuizStatus();

//get local history, then check if null (null=never played)
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
//a copy used as reference when creating a new high-score table so it can write and refer to old scores simultaneously
var oldLocalhistory = JSON.parse(localStorage.getItem('localHistory'))

//on-load page element set-ups
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

    //creates answer p-tags where answers are shown
    for (var i = 0; i < quizQuestions[0].choices.length; i++) {
        var answerEl = document.createElement("p")
        answerEl.id = "answer-" + (i + 1);
        answerEl.className = "quiz-answer";
        quizCanvas.appendChild(answerEl);
        answerEl.textContent = quizQuestions[0].choices[i];
        //onclicks applied that check if answer is correct then itterates to next quizStatus
        answerEl.addEventListener('click', answerClick);    
    }    

    //creates status reproter area, just lets user know if the last question was correct or not
    var answerResult = document.createElement("p");
    answerResult.id = "answer-result";
    quizCanvas.appendChild(answerResult);
    answerResult.style.textAlign = "center";
    answerResult.style.fontSize = "40px";
    answerResult.textContent = "";
    var startGamebutton = document.createElement("button");

    //start-game button
    startGamebutton.id = "game-start-button";
    startGamebutton.innerText = "Begin Quiz";
    quizCanvas.appendChild(startGamebutton);
    startGamebutton.addEventListener("click", preGame);

    //userform for name entry
    var userNameform = document.createElement("FORM");
    userNameform.id = "user-name-form";
    quizCanvas.appendChild(userNameform);  
    var userNameenter = document.createElement("INPUT");
    userNameenter.id = "user-name-text";
    userNameenter.setAttribute("type", "text");
    userNameenter.setAttribute("value", quizStatus.enteredName);
    userNameform.appendChild(userNameenter);
    var userNamebutton = document.createElement("button");
    userNamebutton.id = "user-name-button";
    userNamebutton.innerText = "Submit"
    quizCanvas.appendChild(userNamebutton);
    //user only sees this if they "win" game.
    userNamebutton.addEventListener("click", gameWin);
//Page element set-up complete

//functions for game

//pre-game count-down that shows the game-rules/concept to user.
function preGame() {
    //hides game-starting button and sets it up for end-game style
    startGamebutton.style.visibility = "hidden";
    startGamebutton.id = "game-started-button";    
    startGamebutton.innerText = "Click HERE to try again!"
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
    //this is a var so that the interval can be stopped with clearInterval    
    var preGamegame = setInterval(function() {        
        quizStatus.preGametimer--;
        timerCounter.textContent = quizStatus.preGametimer;
        if (quizStatus.preGametimer === 1) {
            answerResult.textContent = "Now!";            
        }  else if (quizStatus.preGametimer < 1) {
            //game is about to start
            //stop pregame interval
            clearInterval(preGamegame);        
            //set answer result to in-game style
            answerResult.textContent = "";
            answerResult.style.textAlign = "right";
            answerResult.style.fontSize = "20px";
            answerResult.textContent = "";
            //set counter to start time main game
            timerCounter.textContent = quizStatus.gameLength;
            //set first question
            questionAsked()
            //start game
            mainGame(); 
        }
    }, 1000);
};

//main game of page
function mainGame () {
    //each inteval checks game status to refresh question or if game is over.
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
    quizStatus.enteredName = userNameenter.value;
    //update status to show previous high-scores in next steps
    quizQuestion.textContent = quizQuestions[6].question;
    //game status alert update
    answerResult.textContent = "The game is over!";
    //this variable helps maintain continuity between the old records and new records. It also prevents first "if" to fire more than once.
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
    //reset for next game
    resetQuizStatus();
    //reveals game-starting button
    startGamebutton.style.visibility = "visible";
};

//loops through and shows the current high scores
function showHighscores() {
    startGamebutton.id = "game-started-button";
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