let numberOfQuestions = 1;
let questions = [];

let numberOfLevels = 2;
let levels = [];

let quizz = {
    title: "",
    image: "",
    questions: questions,
    levels: levels
};

let userQuizz;

let userQuizzesObj = [];
// let Ids = [];
// let keys = [];



function startQuizzCreation(){
    document.querySelector(".site-container").classList.add("hidden");
    document.querySelector(".quizz-creation").classList.remove("hidden");
    
}



// ------------------------- VALIDATIONS FUNCTIONS ------------------------- //

function isHexColor(color){    
    const matchPattern=/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/i;
    return(matchPattern.test(color));
    
}

function isValidUrl(url){
    const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return(matchPattern.test(url));
}

// ------------------------- QUIZZ BASIC INFOS ------------------------- //

function storeBasicInfos(){
    
    numberOfLevels = document.querySelector(".quizz-nlevels").value;
    numberOfQuestions = document.querySelector(".quizz-nquestions").value;
    quizz.title = document.querySelector(".quizz-title").value;
    quizz.image = document.querySelector(".quizz-img-url").value;

    validateBasicInfos();
}

function validateBasicInfos(){
    let isValidInfo = true;
    if(quizz.title.length<20 || quizz.title.length > 65){
        isValidInfo = false;
        console.log("Invalid Quizz Title");
    }
    if(!isValidUrl(quizz.image)){
        isValidInfo = false;
        console.log("Invalid Quizz Url");
    }
    if(numberOfQuestions < 3){
        isValidInfo = false;
        console.log("Invalid Amount of Questions");
    }
    if(numberOfQuestions < 2){
        isValidInfo = false;
        console.log("Invalid Amount of Levels");
    }

    if(!isValidInfo){
        alert("Preencha os dados corretamente");
        quizz = {
            title: "",
            image: "",
            questions: questions,
            levels: levels
        }
    }
    else{
        changeToQuestionsScreen();
    }
}

function changeToQuestionsScreen(){
    const questionsScreenHTML = document.querySelector(".questions-info");

    questionsScreenHTML.innerHTML = "<h3>Crie suas perguntas</h3>";
    questionsScreenHTML.innerHTML += `
    <div class="creation-content-layout" data-identifier="question"> 
        <div class="inputs-box">
            <h3>Pergunta 1</h3>
            <ul class="inputs-layout">
                <li><input type="text" placeholder="Texto da pergunta" class="question-text1"></li>
                <li><input type="text" placeholder="Cor de fundo da pergunta" class="question-color-bg1"></li>                    
            </ul>
        </div> 
        <div class="inputs-box">
            <h3>Resposta correta</h3>
            <ul class="inputs-layout">
                <li><input type="text" placeholder="Resposta correta" class="question-correct-answer1"></li>
                <li><input type="text" placeholder="URL da imagem" class="question-img-url1"></li>                    
            </ul>
        </div>             
    </div> 
    `

    const questionsHTML = document.querySelector(".questions-info .creation-content-layout");

    for(let i = 0; i<3; i++){
        questionsHTML.innerHTML += `
        <div class="inputs-box">
            <h3>Respostas Incorretas</h3>
            <ul class="inputs-layout">
                <li><input type="text" placeholder="Resposta incorreta" class="question-incorrect-answer1 incorrect${i+1}"></li>
                <li><input type="text" placeholder="URL da imagem" class="question-img-url1 incorrect${i+1}"></li>                    
            </ul>
        </div>
        `
    }
    for(let i = 2; i<=numberOfQuestions; i++){
        questionsScreenHTML.innerHTML += `
        <div class="creation-content-layout" data-identifier="question"> 
            <div class="inputs-box">
                <h3>Pergunta ${i}</h3> 
                <ion-icon name="create-outline" class="open-box-icon" onclick="openQuestion(${i}, this)" data-identifier="expand"></ion-icon>                   
            </div>      
        </div> 
        `        
    } 

    questionsScreenHTML.innerHTML += `<button type="button" class="creation-button" onclick="storeQuestions()">Prosseguir pra criar níveis</button>`;

    document.querySelector(".basic-info").classList.add("hidden");
    questionsScreenHTML.classList.remove("hidden");
}
    
function openQuestion(questionNumber, element){
    if(element !== null) {
        element.classList.add("hidden");
        const questionBox = element.parentNode.parentNode;
        element.parentNode.innerHTML += `
        <ul class="inputs-layout">
            <li><input type="text" placeholder="Texto da pergunta" class="question-text${questionNumber}"></li>
            <li><input type="text" placeholder="Cor de fundo da pergunta" class="question-color-bg${questionNumber}"></li>                    
        </ul>
        `
        questionBox.innerHTML += `
        <div class="inputs-box">
            <h3>Resposta correta</h3>
            <ul class="inputs-layout">
                <li><input type="text" placeholder="Resposta correta" class="question-correct-answer${questionNumber}"></li>
                <li><input type="text" placeholder="URL da imagem" class="question-img-url${questionNumber}"></li>                    
            </ul>
        </div>
        `
        for(let i = 0; i<3; i++){
            questionBox.innerHTML += `
            <div class="inputs-box">
                <h3>Respostas Incorretas</h3>
                <ul class="inputs-layout">
                    <li><input type="text" placeholder="Resposta incorreta" class="question-incorrect-answer${questionNumber} incorrect${i+1}"></li>
                    <li><input type="text" placeholder="URL da imagem" class="question-img-url${questionNumber} incorrect${i+1}"></li>                    
                </ul>
            </div>
            `
        }
    }

}

// ------------------------- QUIZZ QUESTIONS ------------------------- //


function getQuestionTitleValue(questionN){
    if(document.querySelector(".question-text"+questionN) != null){
        const value = document.querySelector(".question-text"+questionN).value;
        return value;
    }
    else return null;  
}
function getQuestionColorValue(questionN){
    if(document.querySelector(".question-color-bg"+questionN) != null){
        const value = document.querySelector(".question-color-bg"+questionN).value;
        return value;
    }
    else return null;  
}
function getAnswersValues(questionN){  
    let questionsCorrectsAnswers = document.querySelectorAll(".question-correct-answer"+questionN);
    let questionsIncorrectsAnswers = document.querySelectorAll(".question-incorrect-answer"+questionN);
    let questionsImgURLs = document.querySelectorAll(".question-img-url"+questionN);
    let answers = [];

    for(let i = 0; i<4; i++){                                  
        let obj = null;
        if(questionsCorrectsAnswers[i] !=null && questionsImgURLs[i] !=null){

        }
        if(i===0){ 
            if(questionsCorrectsAnswers[i] !=null && questionsImgURLs[i] !=null){
                obj = {
                    text: questionsCorrectsAnswers[i].value,
                    image: questionsImgURLs[i].value,
                    isCorrectAnswer: true
                }
            }
            else{
                obj = {
                    text: null,
                    image: null,
                    isCorrectAnswer: true
                }
            }                               
            
        }
        else{  
            if(questionsIncorrectsAnswers[i-1] !=null && questionsImgURLs[i] !=null){
                obj = {
                    text: questionsIncorrectsAnswers[i-1].value,
                    image: questionsImgURLs[i].value,
                    isCorrectAnswer: false
                }
            }
            else{
                obj = {
                    text: null,
                    image: null,
                    isCorrectAnswer: false
                }
            }    
        }     

        if(i===0){
            answers.push(obj);
        }
        else if(obj.image!="" || obj.text!=""){
            answers.push(obj);
        }
    }

    return answers;
}

function storeQuestions(){
    for(let i = 1; i <= numberOfQuestions; i++){
        const obj = {
            title: getQuestionTitleValue(i),
            color: getQuestionColorValue(i),
            answers: getAnswersValues(i)
        }
        questions.push(obj);
    }

    validateQuestions();
}

function validateQuestions(){
    let isValidQuestion = true;
    
    questions.forEach((element) => {
        if(element.title == null){
            isValidQuestion = false;
            console.log("Invalid title question");
        }
        else if(element.title.length < 20){
            isValidQuestion = false;
            console.log("Invalid title question");
        }
        if(element.color == null){
            isValidQuestion = false;
            console.log("Invalid hex color");
        }
        else if(!isHexColor(element.color)){
            isValidQuestion = false;
            console.log("Invalid hex color");
        }
        if(element.answers == null){
            isValidQuestion = false;
            console.log("Invalid amount of answers");
        }
        else if(element.answers.length<2){
            isValidQuestion = false;
            console.log("Invalid amount of answers");
        }
        else{
            element.answers.forEach((elementAnswer) => {
                if(elementAnswer.text == null){
                    isValidQuestion = false;
                    console.log("Invalid text question");
                }
                else if(elementAnswer.text.length===0){
                    isValidQuestion = false;
                    console.log("Invalid text question");
                }
                if(elementAnswer.image == null){
                    isValidQuestion = false;
                    console.log("Invalid url question");
                }
                else if(!isValidUrl(elementAnswer.image)){
                    isValidQuestion = false;
                    console.log("Invalid url question");
                }
            });
        }
        
    })    

    if(!isValidQuestion){
        alert("Preencha os dados corretamente");
        questions = [];
    }
    else{
        quizz.questions = questions;
        changeToLevelsScreen();
    }
}

function changeToLevelsScreen(){
    const levelsInfo = document.querySelector(".levels-info");

    levelsInfo.innerHTML = `<h3>Agora, decida os níveis!</h3>`;

    levelsInfo.innerHTML += `
    <div class="creation-content-layout">
        <div class="inputs-box">
            <h3>Nível 1</h3>
            <ul class="inputs-layout" data-identifier="level">
                <li><input type="text" placeholder="Título do nível" class="level-title1"></li>
                <li><input type="text" placeholder="% de acerto mínima" class="minimum-hit1"></li>
                <li><input type="text" placeholder="URL da imagem do nível" class="url-level1"></li>
                <li><textarea name="Description" id="description" cols="30" rows="10" placeholder="Descrição do nível" class="level-description1"></textarea></li>                  
            </ul>
        </div> 
    </div>      
    `

    for(let i = 2; i <= numberOfLevels; i++){
        levelsInfo.innerHTML += `
        <div class="creation-content-layout">
            <div class="inputs-box">
                <h3>Nível ${i}</h3>
                <ion-icon name="create-outline" class="open-box-icon" onclick="openLevel(${i}, this)" data-identifier="expand"></ion-icon>
            </div> 
        </div>      
        `
    }

    levelsInfo.innerHTML += `<button type="button" class="creation-button" onclick="storeLevels()">Finalizar Quizz</button>`;


    document.querySelector(".questions-info").classList.add("hidden");
    levelsInfo.classList.remove("hidden");
    levelsInfo.scrollIntoView();
}

function openLevel(questionNumber, element){
    if(element !== null) {
        element.classList.add("hidden");
        const levelBox = element.parentNode.parentNode;
        element.parentNode.innerHTML += `
        <ul class="inputs-layout"  data-identifier="level">
            <li><input type="text" placeholder="Título do nível" class="level-title${questionNumber}"></li>
            <li><input type="text" placeholder="% de acerto mínima" class="minimum-hit${questionNumber}"></li>
            <li><input type="text" placeholder="URL da imagem do nível" class="url-level${questionNumber}"></li>
            <li><textarea name="Description" id="description" cols="30" rows="10" placeholder="Descrição do nível" class="level-description${questionNumber}"></textarea></li>                  
        </ul>
        `    
    };
};


// ------------------------- QUIZZ LEVELS ------------------------- //

function getLevelTitleValue(levelN){
    if(document.querySelector(".level-title"+levelN) != null){
        return document.querySelector(".level-title"+levelN).value;
    }
    else return null;    
}
function getLevelImgUrl(levelN){
    if(document.querySelector(".url-level"+levelN) != null){
        return document.querySelector(".url-level"+levelN).value;
    }
    else return null;   
}
function getLevelMinValue(levelN){
    if(document.querySelector(".minimum-hit" + levelN) != null){
        return parseInt(document.querySelector(".minimum-hit" + levelN).value);
    }
    else return null;   
}
function getLevelDescription(levelN){
    if(document.querySelector(".level-description" + levelN) != null){
        return document.querySelector(".level-description" + levelN).value;
    }
    else return null;   
}


function storeLevels(){
    for(let i = 1; i <= numberOfLevels; i++){
        const obj = {
            title: getLevelTitleValue(i),
            image: getLevelImgUrl(i),
            text: getLevelDescription(i),
            minValue: getLevelMinValue(i)
        }
        levels.push(obj);
    }

    validateLevels();
}

function validateLevels(){
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
        sendQuizzToServerAPI();
    }
}

function testQuizz() {
    quizz = {
        title: "Título do quizz aaaa",
        image: "https://http.cat/411.jpg",
        questions: [
            {
                title: "Título da pergunta 1",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: "Título da pergunta 2",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: "Título da pergunta 3",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            }
        ],
        levels: [
            {
                title: "Título do nível 1",
                image: "https://http.cat/411.jpg",
                text: "Descrição do nível 1",
                minValue: 0
            },
            {
                title: "Título do nível 2",
                image: "https://http.cat/412.jpg",
                text: "Descrição do nível 2",
                minValue: 50
            }
        ]
    };
    sendQuizzToServerAPI();
}

function sendQuizzToServerAPI(){
    const requisition = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizz);
    requisition.then(finalizeQuizzCreation);
    requisition.catch( (error) => {  
        console.log("Falha em enviar quizz pro servidor\n" + error.data);
    })
}
function finalizeQuizzCreation(response){
    const creationSuccessScreen = document.querySelector(".creation-success");

    creationSuccessScreen.innerHTML = `
    <h3>Seu quizz está pronto!</h3>
    <div class="img-creation">
        <img src="${quizz.image}" alt="Quizz Image">
        <span class="img-text">${quizz.title}</span>
        <span class="img-degrade"></span>
    </div>            
    <button type="button" class="creation-button" onclick="startQuizzCreated(${response.data.id})">Acessar Quizz</button>
    <span class="back-home" onclick="backHome()">Voltar pra home</span>
    `

    document.querySelector(".levels-info").classList.add("hidden");
    creationSuccessScreen.classList.remove("hidden");
    creationSuccessScreen.scrollIntoView();
    localStoreQuizz(response);
}

function localStoreQuizz(response){
    userQuizz = response.data;

    if (localStorage.getItem("userQuizz") != null) {
        const userQuizzAPIDeserialized = JSON.parse(localStorage.getItem("userQuizz"));
        userQuizzesObj = userQuizzAPIDeserialized;
    };
    userQuizzesObj.push(userQuizz);
    const userQuizzSerializeds = JSON.stringify(userQuizzesObj); 
    localStorage.setItem("userQuizz", userQuizzSerializeds);
}

function backHome(){
    document.location.reload();
    // document.querySelector(".site-container").classList.remove("hidden");
    // document.querySelector(".quizz-creation").classList.add("hidden");
    // document.querySelector(".basic-info").classList.remove("hidden");
    // document.querySelector(".creation-success").classList.add("hidden");
}