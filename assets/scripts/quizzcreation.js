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

    resetInvalidWarnings();

    if(quizz.title.length<20 || quizz.title.length > 65){
        isValidInfo = false;
        console.log("Invalid Quizz Title");
        invalidIndicationBasicInfo(".quizz-title", "O título não possui um tamanho apropriado");
    }
    if(!isValidUrl(quizz.image)){
        isValidInfo = false;
        console.log("Invalid Quizz Url");
        invalidIndicationBasicInfo(".quizz-img-url", "O valor informado não é uma URL válida");
    }
    if(numberOfQuestions < 3){
        isValidInfo = false;
        console.log("Invalid Amount of Questions");
        invalidIndicationBasicInfo(".quizz-nquestions", "O quizz deve ter no mínimo 3 perguntas");
    }
    if(numberOfLevels < 2){
        isValidInfo = false;
        console.log("Invalid Amount of Levels");
        invalidIndicationBasicInfo(".quizz-nlevels", "O quizz deve ter no mínimo 2 níveis");
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

function invalidIndicationBasicInfo(element, errorIndication){
    const elementParent = document.querySelector(element).parentNode;
    if(!elementParent.classList.contains("invalid-input")){
        elementParent.classList.add("invalid-input");        
        if(elementParent.querySelector(".quizz-creation-invalid") != null){
            elementParent.querySelector(".quizz-creation-invalid").innerHTML = `${errorIndication}`; 
        }
        else{
            elementParent.innerHTML += `<span class="quizz-creation-invalid">${errorIndication}</span>`;
        }
    }
}

function resetInvalidWarnings(){
    const invalidElements = document.querySelectorAll(".invalid-input");
    invalidElements.forEach(element => {
        element.classList.remove("invalid-input");
        const warningText = element.querySelector(".quizz-creation-invalid");
        warningText.innerHTML = "";
    });
}

function changeToQuestionsScreen(){
    const questionsScreenHTML = document.querySelector(".questions-info");

    questionsScreenHTML.innerHTML = "<h3>Crie suas perguntas</h3>";
    questionsScreenHTML.innerHTML += `
    <div class="creation-content-layout question-box1" data-identifier="question"> 
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
                <li><input type="text" placeholder="Resposta incorreta" class="question-incorrect-answer1 incorrect${i}"></li>
                <li><input type="text" placeholder="URL da imagem" class="question-img-url1 incorrecturl${i}"></li>                    
            </ul>
        </div>
        `
    }
    for(let i = 2; i<=numberOfQuestions; i++){
        questionsScreenHTML.innerHTML += `
        <div class="creation-content-layout question-box${i}" data-identifier="question"> 
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
    if (element !== null) {
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
                    <li><input type="text" placeholder="Resposta incorreta" class="question-incorrect-answer${questionNumber} incorrect${i}"></li>
                    <li><input type="text" placeholder="URL da imagem" class="question-img-url${questionNumber} incorrecturl${i}"></li>                    
                </ul>
            </div>
            `
        };
    }

};

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
            while(answers.length != i){
                const newObj = {
                    text: "",
                    image: "",
                    isCorrectAnswer: false
                }
                answers.push(newObj);
            }
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
    
    resetInvalidWarnings();
   

    questions.forEach((element, index) => {
        if(element.title == null){
            isValidQuestion = false;
        }
        else if(element.title.length < 20){
            isValidQuestion = false;
            invalidIndicationQuestions(".question-text", index+1, "O texto da pergunta possui tamanho invalido");
        }
        if(element.color == null){
            isValidQuestion = false;
        }
        else if(!isHexColor(element.color)){
            isValidQuestion = false;
            invalidIndicationQuestions(".question-color-bg", index+1, "A cor de fundo da pergunta é inválida");
        }
        if(element.answers == null){
            isValidQuestion = false;
        }
        
        else{           
            element.answers.forEach((elementAnswer, idx) => {
                if(elementAnswer.text == null){
                    isValidQuestion = false;
                }
                else if(elementAnswer.text.length===0){
                    if(elementAnswer.isCorrectAnswer){
                        invalidIndicationQuestions(".question-correct-answer", index+1, "É necessário preencher o texto da resposta correta");
                        isValidQuestion = false;
                        if(element.answers.length<2){
                            isValidQuestion = false;
                            invalidIndicationQuestions(".question-incorrect-answer", index+1, "É necessário preencher pelo menos 1 resposta incorreta");
                        }
                    }
                    else{
                        isValidQuestion = false;
                        invalidIndicationQuestions(`.question-incorrect-answer${index+1}.incorrect`, idx-1, "É necessário preencher o texto da resposta incorreta");
                    }
                }
                if(elementAnswer.image == null){
                    isValidQuestion = false;
                }
                else if(!isValidUrl(elementAnswer.image)){
                    if(elementAnswer.isCorrectAnswer){
                        invalidIndicationQuestions(".question-img-url", index+1, "URL da imagem inválida");
                    }
                    else{
                        invalidIndicationQuestions(`.question-img-url${index+1}.incorrecturl`, idx-1, "URL da imagem inválida");
                    }
                    isValidQuestion = false;
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

function invalidIndicationQuestions(element, idx, errorIndication){
    const elementParent = document.querySelector(element+idx).parentNode;
    if(!elementParent.classList.contains("invalid-input")){
        elementParent.classList.add("invalid-input");
        if(elementParent.querySelector(".quizz-creation-invalid") != null){
            elementParent.querySelector(".quizz-creation-invalid").innerHTML = `${errorIndication}`; 
        }
        else{
            elementParent.innerHTML += `<span class="quizz-creation-invalid">${errorIndication}</span>`;
        }
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

    levelsInfo.innerHTML += `
    <button type="button" class="creation-button" onclick="storeLevels()">Finalizar Quizz</button>
    <button type="button" class="creation-button updade-levels hidden">Atualizar Quizz</button>
    `;


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


function storeLevels(isUpdate, el, id, key){
    for(let i = 1; i <= numberOfLevels; i++){
        const obj = {
            title: getLevelTitleValue(i),
            image: getLevelImgUrl(i),
            text: getLevelDescription(i),
            minValue: getLevelMinValue(i)
        }
        levels.push(obj);
    }

    validateLevels(isUpdate, el, id, key);
}

function validateLevels(isUpdate, el, id, key){
    isValidLevel = true;
    hasValidLevelMin = false;

    levels.forEach((element, index) => {
        if(element.title == null){
            isValidLevel = false;
        }
        else if(element.title.length < 10){
            isValidLevel = false;
            invalidIndicationLevels(".level-title", index+1, "Titulo precisa ter pelo menos 10 caracteres");
        }
        if(element.minValue == null){
            isValidLevel = false;
        }
        else if(element.minValue < 0 || element.minValue > 100){
            isValidLevel = false;
            invalidIndicationLevels(".minimum-hit", index+1, "Valor de acerto minimo precisa ser entre 0 e 100");
            console.log("Invalid min value");
        }
        else if(element.minValue === 0){
            hasValidLevelMin = true;                
            console.log("Has min value = 0");
        }
        
        if(element.image == null){
            isValidLevel = false;
        }
        else if(!isValidUrl(element.image)){
            isValidLevel = false;
            invalidIndicationLevels(".url-level", index+1, "Valor de URL inválida");
            console.log("Invalid url");
        }
        if(element.text ==null){
            isValidLevel = false;
        }
        else if(element.text.length<30){
            isValidLevel = false;
            invalidIndicationLevels(".level-description", index+1, "Descrição do nível precisa ter pelo menos 30 caracteres");
        }        
    });

    if(!isValidLevel || !hasValidLevelMin){
        if(!hasValidLevelMin){
            invalidIndicationLevels(".minimum-hit", 1, "É necessário pelo menos um acerto minimo igual a 0");   
        }
        alert("Preencha os dados corretamente");
        levels = [];
    }
    else{
        quizz.levels = levels;
        if (isUpdate === true){
            updateQuizzOnServerAPI(el, id, key);
        } else {
            sendQuizzToServerAPI();
        }
        
    }
}


function invalidIndicationLevels(element, idx, errorIndication){
    const elementParent = document.querySelector(element+idx).parentNode;
    if(!elementParent.classList.contains("invalid-input")){
        elementParent.classList.add("invalid-input");
        if(elementParent.querySelector(".quizz-creation-invalid") != null){
            elementParent.querySelector(".quizz-creation-invalid").innerHTML = `${errorIndication}`; 
        }
        else{
            elementParent.innerHTML += `<span class="quizz-creation-invalid">${errorIndication}</span>`;
        }
    }    
}

function sendQuizzToServerAPI(){
    const requisition = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizz);
    requisition.then(finalizeQuizzCreation);
    document.querySelector(".loading-screen").classList.remove("hidden");
    document.querySelector(".levels-info").classList.add("hidden");
    requisition.catch( (error) => {  
        console.log("Falha em enviar quizz pro servidor\n" + error.data);
        document.querySelector(".loading-screen").classList.add("hidden");
        document.querySelector(".levels-info").classList.remove("hidden");
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

    document.querySelector(".loading-screen").classList.add("hidden");
    creationSuccessScreen.classList.remove("hidden");
    creationSuccessScreen.scrollIntoView();
    localStoreQuizz(response);
}

function updateQuizzOnServerAPI(el, id, key){
    deleteFromlocalStorage(id)

    const requisition = axios.put(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`, quizz, {
        headers: {"Secret-Key": key}
    });
    requisition.then(finalizeQuizzCreation);
    requisition.catch( (error) => {  
        console.log("Falha em enviar quizz pro servidor\n" + error.data);
    });


};


function deleteFromlocalStorage(quizzId){
    let localStorageQuizzes = JSON.parse(localStorage.getItem("userQuizz"));
    localStorageQuizzes.forEach(element =>{
        if(element.id === quizzId) {
            let quizzToBeDeletedIndex = localStorageQuizzes.indexOf(element);

            localStorageQuizzes.splice(quizzToBeDeletedIndex, 1);
        };
        localStorage.clear();
        let string = JSON.stringify(localStorageQuizzes);
        localStorage.setItem("userQuizz", string);
    });
};

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
}