let numberOfQuestions = 1;
let questions = [];

let numberOfLevels = 2;
let levels = [];


function isHexColor(color){    
    const reg=/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/i;
    return(reg.test(color));
    
}

function isValidUrl(url){
    const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return(matchPattern.test(url));
}

// ------------------------- QUIZZ QUESTION ------------------------- //


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

    console.log(questions);
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
        document.querySelector(".questions-info").classList.add("hidden");
        const levelsInfo = document.querySelector(".levels-info");
        levelsInfo.classList.remove("hidden");
        levelsInfo.scrollIntoView();
    }
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

    console.log(levels);
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
        console.log("Invalid levels");
        levels = [];
    }
    else{
        document.querySelector(".levels-info").classList.add("hidden");
        const creationSuccessScreen = document.querySelector(".creation-success");
        creationSuccessScreen.classList.remove("hidden");
        creationSuccessScreen.scrollIntoView();
    }
}

