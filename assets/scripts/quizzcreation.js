let numberOfQuestions = 1;
let questions = [];

let numberOfLevels = 2;
let levels = [];

let quizz = {
    title: "",
    image: "",
    questions: questions,
    levels: levels
}

let Ids = [];

let userQuizzesArr = [];
let userQuizzFromAPI = null;

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
    numberOfQuestions = document.querySelector(".quizz-nlevels").value;
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
    for(let i = 1; i<=numberOfQuestions; i++){
        questionsScreenHTML.innerHTML += `
        <div class="creation-content-layout"> 
            <div class="inputs-box">
                <h3>Pergunta ${i}</h3>
                <ul class="inputs-layout">
                    <li><input type="text" placeholder="Texto da pergunta" class="question-text${i}"></li>
                    <li><input type="text" placeholder="Cor de fundo da pergunta" class="question-color-bg${i}"></li>                    
                </ul>
            </div> 
            <div class="inputs-box">
                <h3>Resposta correta</h3>
                <ul class="inputs-layout">
                    <li><input type="text" placeholder="Resposta correta" class="question-correct-answer${i}"></li>
                    <li><input type="text" placeholder="URL da imagem" class="question-img-url${i}"></li>                    
                </ul>
            </div>             
        </div> 
        `        
    } 

    const questionsHTML = document.querySelectorAll(".questions-info .creation-content-layout");
    questionsHTML.forEach((element, index) => {
        for(let i = 0; i<3; i++){
            element.innerHTML += `
            <div class="inputs-box">
                <h3>Respostas Incorretas</h3>
                <ul class="inputs-layout">
                    <li><input type="text" placeholder="Resposta incorreta" class="question-incorrect-answer${index+1}"></li>
                    <li><input type="text" placeholder="URL da imagem" class="question-img-url${index+1}"></li>                    
                </ul>
            </div>
            `
        }
       
    });

    questionsScreenHTML.innerHTML += `<button type="button" class="creation-button" onclick="storeQuestions()">Prosseguir pra criar níveis</button>`;

    document.querySelector(".basic-info").classList.add("hidden");
    questionsScreenHTML.classList.remove("hidden");
}
    


// ------------------------- QUIZZ QUESTIONS ------------------------- //


function getQuestionTitleValue(questionN){
    return document.querySelector(".question-text"+questionN).value;
}
function getQuestionColorValue(questionN){
    return document.querySelector(".question-color-bg"+questionN).value;     
}
function getAnswersValues(questionN){  
    let questionsCorrectsAnswers = document.querySelectorAll(".question-correct-answer"+questionN);
    let questionsIncorrectsAnswers = document.querySelectorAll(".question-incorrect-answer"+questionN);
    let questionsImgURLs = document.querySelectorAll(".question-img-url"+questionN);
    let answers = [];

    for(let i = 0; i<4; i++){                                  
        let obj = null;
        if(i===0){                                       
            obj = {
                text: questionsCorrectsAnswers[i].value,
                image: questionsImgURLs[i].value,
                isCorrectAnswer: true
            }
        }
        else{            
            obj = {
                text: questionsIncorrectsAnswers[i-1].value,
                image: questionsImgURLs[i].value,
                isCorrectAnswer: false
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
        if(element.title.length < 20){
            isValidQuestion = false;
            console.log("Invalid title question");
        }
        if(!isHexColor(element.color)){
            isValidQuestion = false;
            console.log("Invalid hex color");
        }
        if(element.answers.length<2){
            isValidQuestion = false;
            console.log("Invalid amount of answers");
        }
        element.answers.forEach((elementAnswer) => {
            if(elementAnswer.text.length===0){
                isValidQuestion = false;
                console.log("Invalid text question");
            }
            if(!isValidUrl(elementAnswer.image)){
                isValidQuestion = false;
                console.log("Invalid url question");
            }
        });
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
    for(let i = 1; i <= numberOfLevels; i++){
        levelsInfo.innerHTML += `
        <div class="creation-content-layout">
            <div class="inputs-box">
                <h3>Nível ${i}</h3>
                <ul class="inputs-layout">
                    <li><input type="text" placeholder="Título do nível" class="level-title${i}"></li>
                    <li><input type="text" placeholder="% de acerto mínima" class="minimum-hit${i}"></li>
                    <li><input type="text" placeholder="URL da imagem do nível" class="url-level${i}"></li>
                    <li><textarea name="Description" id="description" cols="30" rows="10" placeholder="Descrição do nível" class="level-description${i}"></textarea></li>                  
                </ul>
            </div> 
        </div>      
        `
    }

    levelsInfo.innerHTML += `<button type="button" class="creation-button" onclick="storeLevels()">Finalizar Quizz</button>`;


    document.querySelector(".questions-info").classList.add("hidden");
    levelsInfo.classList.remove("hidden");
    levelsInfo.scrollIntoView();
}


// ------------------------- QUIZZ LEVELS ------------------------- //

function getLevelTitleValue(levelN){
    return document.querySelector(".level-title"+levelN).value;
}
function getLevelImgUrl(levelN){
    return document.querySelector(".url-level"+levelN).value;
}
function getLevelMinValue(levelN){
    return parseInt(document.querySelector(".minimum-hit" + levelN).value);
}
function getLevelDescription(levelN){
    return document.querySelector(".level-description" + levelN).value;
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
        if(element.title.length < 10){
            isValidLevel = false;
            console.log("Invalid level title");
        }
        if(element.minValue < 0 || element.minValue > 100){
            isValidLevel = false;
            console.log("Invalid min value");
        }
        if(element.minValue === 0){
            hasValidLevelMin = true;
            console.log("Has min value = 0");
        }
        if(!isValidUrl(element.image)){
            isValidLevel = false;
            console.log("Invalid url");
        }
        if(element.text.length<30){
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
    <button type="button" class="creation-button" onclick="accessQuizz()">Acessar Quizz</button>
    <span class="back-home" onclick="backHome()">Voltar pra home</span>
    `

    document.querySelector(".levels-info").classList.add("hidden");
    creationSuccessScreen.classList.remove("hidden");
    creationSuccessScreen.scrollIntoView();
    console.log(response.data);
    localStoreQuizz(response);
}

function localStoreQuizz(response){
    userQuizzFromAPI = (response.data);
    userQuizzesArr.push(userQuizzFromAPI);
    const quizzId = response.data.id;
    

    if(localStorage.getItem("QuizzIDs") != null){        
        const idsAPIDeserialized = JSON.parse(localStorage.getItem("QuizzIDs"));
        if(!Array.isArray(idsAPIDeserialized)){
            Ids.push(idsAPIDeserialized);
        }
        else{
            Ids=idsAPIDeserialized;
        }
    }    

    Ids.push(quizzId);
    const idSerializeds = JSON.stringify(Ids); 
    localStorage.setItem("QuizzIDs", idSerializeds);
    localStorage.setItem("userQuizzObj", userQuizzFromAPI);
    localStorage.setItem("userQuizzArr", userQuizzesArr);
    console.log(quizzId);
    console.log("ids criados" + Ids);
}

function backHome(){
    document.querySelector(".site-container").classList.remove("hidden");
    document.querySelector(".quizz-creation").classList.add("hidden");
    document.querySelector(".basic-info").classList.remove("hidden");
    document.querySelector(".creation-success").classList.add("hidden");
}