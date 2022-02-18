
let quizzesArray=[];
let quizzObj = [];


let getQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
getQuizzes.then(renderQuizzesList);
getQuizzes.catch(quizzesListError);

// quizzId="${element.id}" style="background-image: url(${element.image});"

function renderQuizzesList(response) {
    let quizzesObj = response.data;
    quizzesObj.forEach(element => {
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
        }


    });

    quizzesClickEvent();
};

function quizzesListError(error) {
    console.log(error);
};

function isValidUrl(url){
    const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return(matchPattern.test(url));
};

function quizzesClickEvent() {
    quizzesArray = Array.from(document.querySelectorAll('.all-quizzes-container .api-quizzes .quizz-container'));
    quizzesArray.forEach(element => {
        element.addEventListener("click", ()=>{
            let quizzId = element.getAttribute("quizz-id");
            startQuizz(quizzId);
            
        })
    });
};

function startQuizz(quizzId) {
    let getQuizz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`);
    getQuizz.then(createQuizz);
};

function createQuizz(response) {
    quizzObj = response.data;

    console.log(quizzObj.image);

    document.querySelector('.quizz-screen').innerHTML = 
    `
    <div class="banner" style = "background-image: url(${quizzObj.image});">
        <div class="backdrop">
            <p>${quizzObj.title}</p>
        </div>
    </div>
    <div class="questions-area">
    </div>
    `;

    let questions = quizzObj.questions; 

    for(let i = 0; i < questions.length; i++) {
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
};

function comparador() { 
	return Math.random() - 0.5; 
}


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

    selectAnswer();
};

function selectAnswer() {
    for(let i = 0; i < quizzObj.questions.length; i++) {
        let allAnswersToSingleQuestion = Array.from(document.querySelectorAll(`.questions-area .question:nth-child(${i+1}) .options .option`));
    
        allAnswersToSingleQuestion.forEach(element=>{
            element.addEventListener("click", () =>{
                if(!(element.classList.contains('full-opacity') || element.classList.contains('mid-opacity'))){
                    element.classList.add('full-opacity');
                    goToNextQuestion(i);

                    allAnswersToSingleQuestion.forEach(item=>{
                        if(!(item.classList.contains('full-opacity'))) {
                            item.classList.add('mid-opacity');
                        };
                    });
                } else {
                    console.log('você já escolheu uma resposta');
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



function goToNextQuestion(i) {
    setTimeout(() => {
        document.querySelector(`.questions-area .question:nth-child(${i+2})`).scrollIntoView({block: "center", behavior: "smooth"});
    }, 2000);
}