// screens
const screenTop = document.querySelector("#top-screen");
const screenBottom = document.querySelector("#bottom-screen");

const buttonsContainer = document.querySelector(".buttons-container");
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

function inputNumBtn() {
  inputNumber(this.value);
}
function inputNumber(num) {
  let screenContent = screenBottom.textContent;
  if (mainNumDigitCount < 16) {
    if (screenContent.includes(".")) {
      screenContent += num;
      mainNumDigitCount++;
    } else {
      if (screenContent == "0") {
        screenContent = "";
        mainNumDigitCount--;
      }
      screenContent += num;
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
// -----------------------------------------------------------------------
function backSpace() {
  let screenContent = screenBottom.textContent;
  if (mainNumDigitCount > 0) {
    if (screenContent.includes(".")) {
      let splited = screenContent.split("");
      let removed = splited.pop();
      if (removed != ".") {
        mainNumDigitCount--;
      }
      screenContent = splited.join("");
    } else {
      if (mainNumDigitCount == 1) {
        screenContent = "0";
      } else {
        let splited = screenContent.split(",").join("").split("");
        splited.pop();
        mainNumDigitCount--;
        screenContent = splited.join("");
        // add commas every 3 digits to int part of number
        screenContent = addCommas(screenContent);
      }
    }
    screenBottom.textContent = screenContent;
  }
}
// main
// input buttons events
btnSign.addEventListener("click", changeSign);
btnFloat.addEventListener("click", inputFloat);
btnNumbers.forEach((btn) => btn.addEventListener("click", inputNumBtn));
// utility buttons events
btnClear.addEventListener("click", clearScreen);
btnBackspace.addEventListener("click", backSpace);
// key events
window.addEventListener("keydown", (e) => {
  const btn = buttonsContainer.querySelector(
    `button[data-key="${e.code}"], button[data-num="${e.code}"]`
  );

  if (btn.classList.contains("number")) {
    inputNumber(btn.value);
  } else if (btn.getAttribute("id") == "float-point") {
    inputFloat();
  } else if (btn.getAttribute("id") == "clear") {
    clearScreen();
  } else if (btn.getAttribute("id") == "backspace") {
    backSpace();
  }
});
