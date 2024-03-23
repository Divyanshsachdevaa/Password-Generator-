const slider = document.querySelector("[dataLength-slider]");
const lengthDisplay = document.querySelector("#pLength");
const indicator = document.querySelector("[strength-indicator]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const passwordDisplay = document.querySelector("[password-display]");
const copyMsg = document.querySelector(".copymsg");
const copyButton = document.querySelector(".copybutton");
const generateButton = document.querySelector(".generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "!@#$%^&*()~{}[]|\-=?/:;<>,.~`";

// default values
let passLength = 10;
let checkCount = 0;
let password = "";
// set strength circle to grey
setIndicator("#ccc");

handleSlider();

function handleSlider() {
    slider.value = passLength;
    lengthDisplay.innerText = passLength;
    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ((passLength - min) * 100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow set by yourself
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateLowerCase(){
    // ascii value of a = 97, z = 123
    // this function converts number to character 
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol(){
    const rndmNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(rndmNumber);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked){
        hasUpper = true;
    }
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSymbol = true;

    if((hasUpper && hasLower && hasNumber && hasSymbol) && passLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) || (hasNumber || hasSymbol)){
        setIndicator("#FFFF00");
    }
    else{
        setIndicator("#ff0000");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to make copy wala msg visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000); // Adjusted timeout duration to 2000 milliseconds (2 seconds)
}

function shufflePassword(array){
    // fisher yates method
    for(let i = array.length -1 ; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxes(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })

    //special case
    if(passLength < checkCount){
        passLength = checkCount;
        handleSlider(); 
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxes);
})

slider.addEventListener('input', (e) => {
    passLength = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateButton.addEventListener('click', () => {
    if(checkCount <= 0){
        return ;
    }

    if(passLength < checkCount){
        passLength = checkCount;
        handleSlider();
    }

    // let's start the journey to create new password

    // remove old passwords 
    password = "";

    // let's put the stuff mentioned by checkboxes
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase)
    }
    if(numberCheck.checked){
        funcArr.push(getRandomNumber)
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol)
    }

    //compulsory addition
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for (let i = funcArr.length; i < passLength; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // let's shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    console.log(password);
    passwordDisplay.value = password;

    // calculate Strength
    calculateStrength();
})

