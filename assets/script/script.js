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
    correctAnswer: 0
};

console.log(quizStatus);

//set up initial page
var quizCanvas = document.getElementById("quiz-area");
var quizQuestion = document.getElementById("quiz-question");
quizQuestion.addEventListener("click", startTimer);
quizQuestion.textContent = quizQuestions[0].question;



//creates answer divs
for (var i = 0; i < quizQuestions[0].choices.length; i++) {
    var answerEl = document.createElement("p")
    answerEl.id = "answer-" + (i + 1);
    answerEl.className = "quiz-answer";
    quizCanvas.appendChild(answerEl);
    answerEl.textContent = quizQuestions[0].choices[i];
    //answer checker
    answerEl.addEventListener('click', function () {    
        console.log("The correct answer was " + quizStatus.correctAnswer +"!")
        quizStatus.questionNum++;
        quizStatus.questionAsked = false;
    });    
}

console.log(quizStatus);

//quiz-game timer
function startTimer(){

    document.getElementById("quiz-question").removeEventListener("click", startTimer);

    var counter = document.getElementById("timer").textContent;
    document.getElementById("timer").style = "color: black;"

    setInterval(function() {
            
        counter--;
        console.log(quizStatus);


        //checks if the question-answers need to be refreshed to the next
        if (!quizStatus.questionAsked) {
            quizStatus.questionAsked = true;
            console.log("newQuestion Activated")
            var j = 0;
            quizQuestion.textContent = quizQuestions[quizStatus.questionNum].question;

            for (var i = 0; i < 4; i++) {
                var answerEl = document.getElementById("answer-" + (i + 1));
                answerEl.textContent = quizQuestions[quizStatus.questionNum].choices[i];
            };
        }        
        
        

        }, 1000);
};


