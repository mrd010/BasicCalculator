// screens
const screenTop = document.querySelector("#top-screen");
const screenBottom = document.querySelector("#bottom-screen");
// utility buttons
const btnClear = document.querySelector("#clear");
const btnBackspace = document.querySelector("#backspace");
// operator buttons
const btnOperators = document.querySelectorAll(".operator");
// number buttons
const btnNumbers = document.querySelectorAll(".number");
// misc buttons
const btnSign = document.querySelector("#sign");
const btnFloat = document.querySelector("#float-point");

let mainNumDigitCount = 1;
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
function clearScreen() {
  screenBottom.textContent = "0";
  mainNumDigitCount = 1;
}
// ----------------------------------------------------------------------
// when pressing sign change btn
function changeSign() {
  if (screenBottom.textContent != 0) {
    if (screenBottom.textContent.charAt(0) == "-") {
      screenBottom.textContent = screenBottom.textContent.slice(1);
    } else {
      screenBottom.textContent = "-" + screenBottom.textContent;
    }
  }
}

// when pressing float point btn
function inputFloat() {
  if (mainNumDigitCount < 16) {
    if (!screenBottom.textContent.includes(".")) {
      screenBottom.textContent += ".";
    }
  }
}
// when pressing any number
function inputNumber() {
  let screenContent = screenBottom.textContent;
  if (mainNumDigitCount < 16) {
    if (screenContent.includes(".")) {
      screenContent += this.textContent;
      mainNumDigitCount++;
    } else {
      if (screenContent == "0") {
        screenContent = "";
        mainNumDigitCount--;
      }
      screenContent += this.textContent;
      mainNumDigitCount++;
      // add commas every 3 digits to int part of number
      screenContent = addCommas(screenContent);
    }
  }
  screenBottom.textContent = screenContent;
}

function addCommas(strNumber) {
  let strIntPart = strNumber.split("-").join("").split(",").join("");
  if (strIntPart.length <= 3) {
    return strNumber;
  }
  strIntPartCommad =
    appendComma(strIntPart.slice(0, -3)) + strIntPart.slice(-3);
  if (strNumber.charAt(0) == "-") {
    return "-" + strIntPartCommad;
  } else return strIntPartCommad;
}

function appendComma(str) {
  if (str.length <= 3) {
    return str + ",";
  } else return appendComma(str.slice(0, -3)) + str.slice(-3) + ",";
}

// main
btnSign.addEventListener("click", changeSign);
btnFloat.addEventListener("click", inputFloat);
btnNumbers.forEach((btn) => btn.addEventListener("click", inputNumber));

btnClear.addEventListener("click", clearScreen);
