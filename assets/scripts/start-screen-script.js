
let quizzesArray=[];


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
    let quizzObj = response.data;

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
        console.log(scrambledAnswers);
        for(let j = 0; j < questions[i].answers.length; j++) {
            document.querySelector(`.questions-area .question:nth-child(${i+1}) .options`).innerHTML += 
            `
            <figure class="option" is-correct = "${questions[i].answers[j].isCorrectAnswer}">
                <img src="${questions[i].answers[j].image}" alt="">
                <figcaption>${questions[i].answers[j].text}</figcaption>
            </figure>
            `;
        }
    }

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
    }, 600);
};



