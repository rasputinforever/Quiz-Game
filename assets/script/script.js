//quiz questions and answers
var quizQuestions = [
    {
        question: "Welcome to the QUIZ SHOW! You will have 60 seconds to answer each question!",
        choices: ["Click here to begin!", "", "", ""],
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

//set up initial page
var quizCanvas = document.getElementById("quiz-area");
var quizQuestion = document.getElementById("quiz-question");

quizQuestion.textContent = quizQuestions[0].question;

for (var i = 0; i < quizQuestions[0].choices.length; i++) {
    var answerEl = document.createElement("p")
    answerEl.id = "answer-" + (i + 1);
    answerEl.className = "quiz-answer";
    quizCanvas.appendChild(answerEl);
    answerEl.textContent = quizQuestions[0].choices[i];    
}

var quizStatus = {
    questionNum: 1,
    questionAsked: false
};


document.getElementById("answer-1").addEventListener("click", startTimer);



//quiz-game timer
function startTimer(){
    document.getElementById("answer-1").removeEventListener("click", startTimer);
    var counter = document.getElementById("timer").textContent;
    
    

    document.getElementById("timer").style = "color: black;"

    setInterval(function() {
            
        counter--;
        if (!quizStatus.questionAsked) {
            quizStatus.questionAsked = true;
            console.log("newQuestion Activated")
            document.getElementById("quiz-question").textContent = quizQuestions[quizStatus.questionNum].question;
            for (var i = 0; i < 4; i++) {
                var answerEl = document.getElementById("answer-" + (i + 1));
                answerEl.textContent = quizQuestions[quizStatus.questionNum].choices[i];
                
                if ((i + 1) === quizQuestions[quizStatus.questionNum].answer) {
                    answerEl.addEventListener('click', function() {
                    console.log("Right!")
                    quizStatus.questionNum++;
                    quizStatus.questionAsked = false;
                });
                } else {
                    answerEl.addEventListener('click', function() {
                    console.log("Wrong!")
                    quizStatus.questionNum++;
                    quizStatus.questionAsked = false;
                    });
                }  
                };
        }
        if (counter >= 0) {
            span = document.getElementById("timer");
            span.innerHTML = counter;
        } else if (counter === 0) {
            document.getElementById("timer").textContent = 'Game Over!';
            clearInterval(counter);
        } 
        
        
        
        }, 1000);



};

//question asker-er
function newQuestion(quizStatus) {
    console.log("newQuestion Activated")
    
    document.getElementById("quiz-question").textContent = quizQuestions[quizStatus.questionNum].question;
    for (var i = 0; i < 4; i++) {
        var answerEl = document.getElementById("answer-" + (i + 1));
        answerEl.textContent = quizQuestions[quizStatus.questionNum].choices[i];
        if ((i + 1) === quizQuestions[quizStatus.questionNum].answer) {
            answerEl.addEventListener('click', function(quizStatus) {
                console.log("Right!")
                quizStatus.questionNum++;
                quizStatus.questionAsked = false;
                                
                return quizStatus;
            });
        } else {
            answerEl.addEventListener('click', function(quizStatus) {
                console.log("Wrong!")
                quizStatus.questionNum++;
                quizStatus.questionAsked = false;                
                return quizStatus;
        });
    }  
    };
    
};

//wrong answer
function wrongAnswer(quizStatus) {
    console.log("Wrong!")
    quizStatus.questionNum++;
    quizStatus.questionAsked = false;
    
    return quizStatus;
}

//correct answer
function correctAnswer(quizStatus) {
    console.log("Right!")
    quizStatus.questionNum++;
    quizStatus.questionAsked = false;
    
    return quizStatus;
}