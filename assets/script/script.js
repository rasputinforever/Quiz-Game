//quiz questions and answers
var quizQuestions = [
    {
        question: "Welcome to the QUIZ SHOW! You will have 60 seconds to answer each question!",
        choices: ["Click here to begin!", "", "", ""],
        answer: 1,
    },
    {
        question: "Please click the second answer.",
        choices: ["Banana", "Apple", "Persimon", "Turkey"],
        answer: 2
    },
    {
        question: "Please click the fourth answer.",
        choices: ["one", "two", "three", "four"],
        answer: 4
    },
    {
        question: "Please click the fourth answer.",
        choices: ["one", "two", "three", "four"],
        answer: 4
    },
    {
        question: "Please click the second answer.",
        choices: ["one", "two", "three", "four"],
        answer: 2
    },
    {
        question: "Please click the first answer.",
        choices: ["one", "two", "three", "four"],
        answer: 1
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


document.getElementById("answer-1").addEventListener("click", startTimer);
var questionNum = 1;

//quiz-game timer
function startTimer(){
    var counter = document.getElementById("timer").textContent;
    newQuestion(questionNum);
    
    document.getElementById("timer").style = "color: black;"

    setInterval(function() {
        
      counter--;
      if (counter >= 0) {
        span = document.getElementById("timer");
        span.innerHTML = counter;
      }
      if (counter === 0) {
        document.getElementById("timer").textContent = 'Game Over!';
          clearInterval(counter);
      }
      
    }, 1000);
  };

  //question asker-er
function newQuestion(questionNum) {
    document.getElementById("quiz-question").textContent = quizQuestions[questionNum].question;
    for (var i = 0; i < 4; i++) {
        var answerEl = document.getElementById("answer-" + (i + 1));
        answerEl.textContent = quizQuestions[questionNum].choices[i];
        if ((i + 1) === quizQuestions[questionNum].answer) {
            answerEl.addEventListener('click', correctAnswer);
        } else {
            answerEl.addEventListener('click', wrongAnswer);
        }        
    };
    questionNum++;
    return questionNum;
}

//wrong answer
function wrongAnswer() {
    console.log("Wrong!")
}


//correct answer
function correctAnswer() {
    console.log("Correct!")
}