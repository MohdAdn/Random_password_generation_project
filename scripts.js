const inputSlider = document.querySelector("[data-lenSlider]");
const lengthDisplay =document.querySelector("[data-lengthData]");

const dataPassWord =document.querySelector("[data-passwordDisplay]");
const copyBtn =document.querySelector("[data-copy]");
const copyMsg =document.querySelector("[data-message]");
const uppercaseCheck =document.querySelector("#uppercase");
const lowerCheck=document.querySelector("#lowercase");
const numberCheck =document.querySelector("#numbers"); 
const specialCheck =document.querySelector("#special");
const indicator =document.querySelector("[data-indicator]");
const generateBtn =document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%^&*()_+=-[]{}\|?><;";


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator('#aaa');

//set password length
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min) ) + "%   100%";

}

function setIndicator(color)
{
   indicator.style.backgroundColor = color;
   indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
   
}

// MIN MAX FUNCTION
function getRandInteger(min,max)
{
    return Math.floor(Math.random()* ( max - min )) + min;
}
function generateRandomNumber()
{
    return getRandInteger(0,9);
}
function generateLowercase()
{
    return String.fromCharCode(getRandInteger(97,123));
}
function generateUppercase()
{
    return String.fromCharCode(getRandInteger(65,91));
}
function generateSymbol()
{
 const randNum = getRandInteger(0,symbols.length);
 return symbols.charAt(randNum); // charAt is function that tell what char at that index
}

function calStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowerCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(specialCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8)
    {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        (passwordLength>=6)
    ){
        setIndicator("#ff0");
    }else
    {
        setIndicator("#f00");
    }

}
async function copyContent()
{
    try{
        await navigator.clipboard.writeText(dataPassWord.value);
        copyMsg.innerText='copied';
    }
   catch(e)
   {
     copyMsg.innerText = 'failed';
   }
   //to make copy span visible
   copyMsg.classList.add("active");
   setTimeout( () => {
    copyMsg.classList.remove("active");
   },2000);
}
function shufflePassword(array)
{
     //Fisher Yates Method
     for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handlecheckboxChange()
{
     checkCount = 0;
     allCheckbox.forEach( (checkbox) => 
     {
        if(checkbox.checked)
        checkCount++;
     });
      
     //special case condition
     if(passwordLength < checkCount)
     {
        passwordLength = checkCount;
        handleSlider();
     }
}
allCheckbox.forEach((checkbox) => 
{
    checkbox.addEventListener('change',handlecheckboxChange);
})

inputSlider.addEventListener('input',(e)=>
{
    passwordLength = e.target.value;
    handleSlider();
});
copyBtn.addEventListener('click', () => 
{
    if(dataPassWord.value)
     copyContent();
})

generateBtn.addEventListener('click',() => 
{
    if(checkCount<=0)
    return;
if(passwordLength<checkCount)
   passwordLength=checkCount;
    handleSlider();

    password = "";
    // lets put stuff mentioned by checkedbox
  /*   if(uppercaseCheck.checked)
    {
        password += generateUppercase();
    }
    if(lowerCheck.checked)
    {
        password += generateLowercase();
    }
    if(numberCheck.checked)
    {
        password += generateRandomNumber();
    }
    if(specialCheck.checked)
    {
        password += generateSymbol();
    } */

    let funcArr = [];
    if(uppercaseCheck.checked)
    {
        funcArr.push(generateUppercase);
    }
    if(lowerCheck.checked)
    {
        funcArr.push(generateLowercase);
    }
    if(numberCheck.checked)
    {
        funcArr.push(generateRandomNumber);
    }
     if(specialCheck.checked)
     {  
        
       funcArr.push(generateSymbol);

     }
     /// compulsory addition
     for(let i=0;i<funcArr.length;i++)
     {
        password+= funcArr[i]();
     }
     //remaining addition
     for(let i =0; i<passwordLength-funcArr.length;i++)
     {
        let randIndex = getRandInteger(0,funcArr.length);
        password+= funcArr[randIndex]();
     }
     

     //shuffle password
     password = shufflePassword(Array.from(password));
     dataPassWord.value = password;
     ///call password strength
     calStrength();
    
    


})