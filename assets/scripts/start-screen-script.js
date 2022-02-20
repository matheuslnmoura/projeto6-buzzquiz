
let quizzesArray=[];
let userQuizzesArray=[];
let quizzObj = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let quizzIdentification = null;
let userQuizzesID = [];
let allQuizzesIdArray = [];


let getQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
getQuizzes.then(renderQuizzesList, checkAPIForUserQuizzes);
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
    allQuizzesClickEvent();
    checkAPIForUserQuizzes(response);
};

function checkAPIForUserQuizzes(response) {
    let quizzesObj = response.data;
    quizzesObj.forEach(element =>{
        allQuizzesIdArray.push(element.id);
    });
    userQuizzesID = JSON.parse(localStorage.getItem("QuizzIDs"));
    userQuizzesID.forEach(item => {
        if (allQuizzesIdArray.indexOf(item) === -1) {
        } else{
            renderUserQuizzesList(quizzesObj);
        };
    });
} 

function renderUserQuizzesList(quizzesObj) {
    if(localStorage.getItem("QuizzIDs") != null) {
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
        
        userQuizzesClickEvent();
    };
};

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

function startQuizzCreated(quizzId) {
    let getQuizz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`);
    getQuizz.then(createQuizz);
    document.querySelector(".site-container").classList.remove("hidden");
    document.querySelector(".quizz-creation").classList.add("hidden");
    document.querySelector(".basic-info").classList.remove("hidden");
    document.querySelector(".creation-success").classList.add("hidden");
};








