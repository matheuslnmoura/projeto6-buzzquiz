
let quizzesArray=[];
let userQuizzesArray=[];
let quizzObj = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let quizzIdentification = null;
let userQuizzesID = [];


let getQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
getQuizzes.then(renderQuizzesList, renderUserQuizzesList);
getQuizzes.catch(quizzesListError);


function renderQuizzesList(response) {
    let quizzesObj = response.data;
    quizzesObj.forEach(element => {
        if (element.id !== userQuizzesID){
            if(isValidUrl(element.image)) {
                document.querySelector('.all-quizzes-container .api-quizzes').innerHTML += 
                `
                    <div class="quizz-container" quizz-id="${element.id}" style="background-image: url(${element.image});">
                        <div class="backdrop">
                            <p>${element.title}</p>
                        </div>
                    </div>
                `;
            } else {
                document.querySelector('.all-quizzes-container .api-quizzes').innerHTML += 
                `
                <div class="quizz-container" quizz-id="${element.id}" style="background-image: url(https://http.cat/404.jpg);">
                    <div class="backdrop">
                        <p>${element.title}</p>
                    </div>
                </div>
                `;
            };
        } 
    });
    renderUserQuizzesList(response);
    allQuizzesClickEvent();
};

function renderUserQuizzesList(response) {
    let quizzesObj = response.data;
    if(localStorage.getItem("QuizzIDs") != null) {
        userQuizzesID = JSON.parse(localStorage.getItem("QuizzIDs"));
        userQuizzesID.forEach(element => {
            quizzesObj.forEach(item => {
                if(element === item.id) {
                    if(isValidUrl(item.image)) {
                        document.querySelector('.user-quizzes .api-quizzes').innerHTML += 
                        `
                            <div class="quizz-container" quizz-id="${item.id}" style="background-image: url(${item.image});">
                                <div class="backdrop">
                                    <p>${item.title}</p>
                                </div>
                            </div>
                        `;
                    } else {
                        document.querySelector('.user-quizzes .api-quizzes').innerHTML += 
                        `
                        <div class="quizz-container" quizz-id="${item.id}" style="background-image: url(https://http.cat/404.jpg);">
                            <div class="backdrop">
                                <p>${item.title}</p>
                            </div>
                        </div>
                        `;
                    };
                };
            });
        });

        document.querySelector('.create-quizz-container').classList.add('hidden');
        document.querySelector('.user-quizzes').classList.remove('no-opacity');
        document.querySelector('.user-quizzes').classList.add('full-opacity');
        document.querySelector('.user-quizzes').classList.remove('hidden');
    }; 
    userQuizzesClickEvent();
}

function quizzesListError(error) {
    console.log(error);
};

function isValidUrl(url){
    const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return(matchPattern.test(url));
};

function allQuizzesClickEvent() {
    quizzesArray = Array.from(document.querySelectorAll('.all-quizzes-container .api-quizzes .quizz-container'));
    quizzesArray.forEach(element => {
        element.addEventListener("click", ()=>{
            let quizzId = element.getAttribute("quizz-id");
            startQuizz(quizzId);
        })
    });
};

function userQuizzesClickEvent() {
    userQuizzesArray = Array.from(document.querySelectorAll('.user-quizzes .api-quizzes .quizz-container'));
    userQuizzesArray.forEach(element => {
        element.addEventListener("click", ()=>{
            let quizzId = element.getAttribute("quizz-id");
            startQuizz(quizzId);
        })
    });
};

function startQuizz(quizzId) {
    let getQuizz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`);
    getQuizz.then(createQuizz);
    quizzIdentification = quizzId
};

function createQuizz(response) {
    quizzObj = response.data;

    document.querySelector('.quizz-screen').innerHTML = 
    `
    <div class="banner" style = "background-image: url(${quizzObj.image});">
        <div class="backdrop">
            <p>${quizzObj.title}</p>
        </div>
    </div>
    <div class="questions-area">
    </div>

    <div class="level-area">
    </div>

    `;

    getQuestions();
};

function getQuestions() {
    let questions = quizzObj.questions; 
    let i;
    for(i = 0; i < questions.length; i++) {
        document.querySelector('.questions-area').innerHTML += 
        `
        <div class="question">
            <div class="header" style = "background-color: ${questions[i].color}">
                ${questions[i].title}
            </div>

            <div class="options">

            </div>
        </div>
        `;

        let scrambledAnswers = questions[i].answers.sort(comparador);
        for(let j = 0; j < scrambledAnswers.length; j++) {
            document.querySelector(`.questions-area .question:nth-child(${i+1}) .options`).innerHTML += 
            `
            <figure class="option" is-correct = "${scrambledAnswers[j].isCorrectAnswer}">
                <img src="${scrambledAnswers[j].image}" alt="">
                <figcaption>${scrambledAnswers[j].text}</figcaption>
            </figure>
            `;
        };
    };
    changeScreen(".start-screen", ".quizz-screen");
    selectAnswer();
};

function comparador() { 
	return Math.random() - 0.5; 
};

function changeScreen(hide, show) {
    document.querySelector(hide).classList.remove('full-opacity');
    document.querySelector(hide).classList.add('no-opacity');
    setTimeout(()=>{
        document.querySelector(hide).classList.add('hidden');

        document.querySelector(show).classList.remove('hidden');
        setTimeout(()=>{
            document.querySelector(show).classList.remove('no-opacity');
        }, 100);
        window.scrollTo(0, 0);
    }, 600);
};

function selectAnswer() {
    for(let i = 0; i < quizzObj.questions.length; i++) {
        let allAnswersToSingleQuestion = Array.from(document.querySelectorAll(`.questions-area .question:nth-child(${i+1}) .options .option`));
    
        allAnswersToSingleQuestion.forEach(element=>{
            element.addEventListener("click", () =>{
                if(element.getAttribute("is-correct") === 'true'){
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                }

                if(!(element.classList.contains('full-opacity') || element.classList.contains('mid-opacity'))){
                    element.classList.add('full-opacity');
                    goToNext(i);

                    allAnswersToSingleQuestion.forEach(item=>{
                        if(!(item.classList.contains('full-opacity'))) {
                            item.classList.add('mid-opacity');
                        };
                    });
                } else {
                };

                allAnswersToSingleQuestion.forEach(checkAnswer =>{
                    if(checkAnswer.getAttribute("is-correct") === 'true'){
                        checkAnswer.classList.add('right-answer');
                    } else {
                        checkAnswer.classList.add('wrong-answer');
                    };
                });
            });
        });
    };
};

function goToNext(i) {
    if(correctAnswers + wrongAnswers === quizzObj.questions.length) {
        getLevels();
        setTimeout(() => {
            document.querySelector(`.level`).scrollIntoView({block: "center", behavior: "smooth"});
        }, 2000);
    } else if(document.querySelector(`.questions-area .question:nth-child(${i+2})`) !== null){
        // document.querySelector(`.questions-area .question:nth-child(${i+2})`).classList.toggle('hidden');
        setTimeout(() => {
            document.querySelector(`.questions-area .question:nth-child(${i+2})`).scrollIntoView({block: "center", behavior: "smooth"});
        }, 2000);
    } else {
        setTimeout(() => {
            alert('Responda todas as perguntas para finalizar o teste');
        }, 2000);
    };
};

function getLevels() {
    let quizzLevels = quizzObj.levels;
    let correctAnswersPercentage = (correctAnswers / quizzObj.questions.length)*100;
    let roundedCorrectAnswersPercentage = Math.round(correctAnswersPercentage);
    
    for(let i = 0; i < quizzLevels.length; i++) {
        if(correctAnswersPercentage >= quizzLevels[i].minValue) {
            document.querySelector('.level-area').innerHTML = 
            `
            <div class="level">
                <div class="header">
                    ${roundedCorrectAnswersPercentage}% de acerto: ${quizzLevels[i].title}
                </div>
    
                <div class="options">
                    <div class="level-container" style="background-image: url(${quizzLevels[i].image});">
                    </div>
                    <p>${quizzLevels[i].text}</p>
                </div>
            </div>
            <div class="quizz-finalization">
                <button class="restart-quizz">Reiniciar Quizz</button>
                <button class="go-to-home">Voltar pra home</button>
            </div>
            `;
        }
    };
    document.querySelector('.quizz-finalization .restart-quizz').addEventListener('click', restartQuizz)
    document.querySelector('.quizz-finalization .go-to-home').addEventListener('click', goToHome)

};

function restartQuizz() {
    correctAnswers = 0;
    wrongAnswers = 0;
    document.querySelector('.questions-area').innerHTML = "";
    getQuestions();
    window.scrollTo({top: -100, behavior: "smooth"});
    document.querySelector('.level-area').innerHTML ="";
};

function goToHome() {
    changeScreen(".quizz-screen", ".start-screen");
    setTimeout(()=>{
        quizzesArray=[];
        quizzObj = [];
        quizzIdentification = null;
        correctAnswers = 0;
        wrongAnswers = 0;
        document.querySelector('.questions-area').innerHTML = "";
        document.querySelector('.level-area').innerHTML ="";
    }, 1000);
}






