
let quizzesArray=[];
let userQuizzesArray=[];
let quizzObj = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let quizzIdentification = null;
let userQuizzesID = [];
let userQuizzesObjects = [];
let newUserQuizzesObjects = [];
let quizzToBeEditedId = null;


let getQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
getQuizzes.then(renderQuizzesList);
getQuizzes.catch(quizzesListError);


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
        };
        
    });
    allQuizzesClickEvent();
    renderUserQuizzesList();
};



function renderUserQuizzesList() {

    userQuizzesObjects = JSON.parse(localStorage.getItem("userQuizz"));
    console.log(userQuizzesObjects);
    if(userQuizzesObjects.length > 0){
        userQuizzesObjects.forEach(element => {
            if(isValidUrl(element.image)) {
                document.querySelector('.user-quizzes .api-quizzes').innerHTML += 
                `
                    <div class="quizz-container" quizz-id="${element.id}" style="background-image: url(${element.image});">
                        <div class="backdrop">
                            <p>${element.title}</p>
                        </div>
                        <div class="controls ">
                            <ion-icon name="create-outline" class="edit-button" onclick="editQuizzBasicInfo(this)"></ion-icon>
                            <ion-icon name="trash-outline" class="delete-button" onclick="deleteQuizz(this)"></ion-icon>
                        </div>
                    </div>
                `;
            } else {
                document.querySelector('.user-quizzes .api-quizzes').innerHTML += 
                `
                <div class="quizz-container" quizz-id="${element.id}" style="background-image: url(https://http.cat/404.jpg);">
                    <div class="backdrop">
                        <p>${element.title}</p>
                    </div>
                </div>
                `;
            };
                
        
        });

        document.querySelector('.create-quizz-container').classList.add('hidden');
        document.querySelector('.user-quizzes').classList.remove('no-opacity');
        document.querySelector('.user-quizzes').classList.add('full-opacity');
        document.querySelector('.user-quizzes').classList.remove('hidden');

        userQuizzesClickEvent();
    }
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
        element.querySelector('.backdrop').addEventListener("click", ()=>{
            let quizzId = element.getAttribute("quizz-id");
            startQuizz(quizzId);
        })
    });
};

function startQuizz(quizzId) {
    let getQuizz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`);
    getQuizz.then(createQuizz);
    quizzIdentification = quizzId;
};

function startQuizzCreated(quizzId) {
    let getQuizz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`);
    getQuizz.then(createQuizz);
    document.querySelector(".site-container").classList.remove("hidden");
    document.querySelector(".quizz-creation").classList.add("hidden");
    document.querySelector(".basic-info").classList.remove("hidden");
    document.querySelector(".creation-success").classList.add("hidden");
};


function deleteQuizz(el) {
    let quizzToBeDeletedKey = null;
    let quizzToBeDeletedName = null;
    let quizzToBeDeletedId = parseInt(el.parentNode.parentNode.getAttribute('quizz-id'));
    userQuizzesObjects.forEach(element=>{
        if(quizzToBeDeletedId === element.id) {
            quizzToBeDeletedKey = element.key;
            quizzToBeDeletedName = element.title;
            console.log(quizzToBeDeletedKey);
        }
    });

    console.log(quizzToBeDeletedId);
    console.log (typeof(quizzToBeDeletedKey));
    let confirmation = confirm(`Você quer mesmo deletar o quizz ${quizzToBeDeletedName}?`);

    
    if (confirmation){
        console.log ('entrou no if');

        let promisseDelete = axios.delete(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzToBeDeletedId}`, {headers:{'Secret-Key': `${quizzToBeDeletedKey}`}});
        
        userQuizzesObjects.forEach(element=>{
            if(quizzToBeDeletedId === element.id) {
                newUserQuizzesObjects = userQuizzesObjects;
                let quizzToBeDeletedIndex = userQuizzesObjects.indexOf(element);
                newUserQuizzesObjects.splice(quizzToBeDeletedIndex, 1);
            }
        });
        promisseDelete.then(updateLocalStorage);
    }
};

function editQuizzBasicInfo(el) {
    quizzToBeEditedId = parseInt(el.parentNode.parentNode.getAttribute('quizz-id'));

    userQuizzesObjects.forEach(element=>{
        if(quizzToBeEditedId === element.id) {
            document.querySelector(".quizz-nlevels").value = element.levels.length;
            document.querySelector(".quizz-nquestions").value = element.questions.length;
            document.querySelector(".quizz-title").value = element.title;
            document.querySelector(".quizz-img-url").value = element.image;            
        }
    });
    // document.querySelector('.creation-button').classList.add('hidden');
    // document.querySelector('.creation-button.update-button').classList.remove('hidden');

    document.querySelector('.creation-button').addEventListener("click", ()=>{
        editQuizzQuestions(el);
    });
    changeScreen(".start-screen", ".quizz-creation");
};

function editQuizzQuestions(el) {
    userQuizzesObjects.forEach(object=>{
        if(quizzToBeEditedId === object.id) {
            object.questions.forEach((question, i) =>{
                document.querySelector(`.question-text${i+1}`).value = question.title;
                document.querySelector(`.question-color-bg${i+1}`).value = question.color;

                openQuestion((i+2), document.querySelector(`.creation-content-layout:nth-child(${i+3}) .inputs-box .open-box-icon`));
            });

            object.questions.forEach((question, i) =>{
                question.answers.forEach((answer, j) => {
                    if (answer.isCorrectAnswer === true) {
                        document.querySelector(`.question-correct-answer${i+1}`).value = answer.text;
                        document.querySelector(`.question-img-url${i+1}`).value = answer.image;
                    } else {
                        document.querySelector(`.question-incorrect-answer${i+1}.incorrect${j}`).value = answer.text;
                        document.querySelector(`.question-img-url${i+1}.incorrect${j}`).value = answer.image;
                    }
                });
            });
        };
    });
    document.querySelector('.questions-info .creation-button').addEventListener("click", ()=>{
        changeToNewLevelsScreen();
    });
};



function changeToNewLevelsScreen() {
    let levelsInputBoxes = [];
    userQuizzesObjects.forEach(object=>{
        if(quizzToBeEditedId === object.id) {
            object.levels.forEach((level, i) =>{
                openLevel((i+2), document.querySelector(`.levels-info .creation-content-layout:nth-child(${i+3}) .inputs-box .open-box-icon`));
            });

            levelsInputBoxes = Array.from(document.querySelectorAll(`.levels-info .inputs-box`));
            console.log(levelsInputBoxes);

            levelsInputBoxes.forEach((singleLevel, j)=>{
                singleLevel.querySelector('h3').classList.add(`iteration${j}`);
                singleLevel.querySelector('ul').classList.add(`iteration${j}`);
            })

            object.levels.forEach((level, i) =>{
                document.querySelector(`.levels-info h3.iteration${i}`).innerHTML = `Nível ${i+1}`;
                console.log(i)
                document.querySelector(`.levels-info ul.iteration${i} li:nth-child(1) input`).value = level.title;
                document.querySelector(`.levels-info ul.iteration${i} li:nth-child(2) input`).value = level.minValue;
                document.querySelector(`.levels-info ul.iteration${i} li:nth-child(3) input`).value = level.image;
                document.querySelector(`.levels-info ul.iteration${i} li:nth-child(4) textarea`).value = level.text;
            });
        };
    });
    document.querySelector('.levels-info .creation-button').addEventListener('click', validateNewLevels);
};

function validateNewLevels(){
    isValidLevel = true;
    hasValidLevelMin = false;

    levels.forEach((element) => {
        if(element.title == null){
            isValidLevel = false;
            console.log("Invalid level title");
        }
        else if(element.title.length < 10){
            isValidLevel = false;
            console.log("Invalid level title");
        }
        if(element.minValue == null){
            isValidLevel = false;
            console.log("Invalid min value");
        }
        else if(element.minValue < 0 || element.minValue > 100){
            isValidLevel = false;
            console.log("Invalid min value");
        }
        else{
            if(element.minValue === 0){
                hasValidLevelMin = true;
                console.log("Has min value = 0");
            }
        }
        
        if(element.image == null){
            isValidLevel = false;
            console.log("Invalid url");
        }
        else if(!isValidUrl(element.image)){
            isValidLevel = false;
            console.log("Invalid url");
        }
        if(element.text ==null){
            isValidLevel = false;
            console.log("Invalid description");
        }
        else if(element.text.length<30){
            isValidLevel = false;
            console.log("Invalid description");
        }        
    });

    if(!isValidLevel || !hasValidLevelMin){
        alert("Preencha os dados corretamente");
        console.log("Invalid levels");
        levels = [];
    }
    else{
        quizz.levels = levels;
        updateQuizzOnServerAPI();
    };
};

function updateQuizzOnServerAPI(){
    console.log(quizz);
    const requisition = axios.put("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizz);
    requisition.then(finalizeQuizzCreation);
    requisition.catch( (error) => {  
        console.log("Falha em enviar quizz pro servidor\n" + error.data);
    })
}

function updateLocalStorage() {
    localStorage.clear();
    let string = JSON.stringify(newUserQuizzesObjects);
    localStorage.setItem("userQuizz", string);
    document.location.reload();
};





