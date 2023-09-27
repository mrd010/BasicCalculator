const root = document.querySelector(":root");
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
// Theme Button
const lightThemeBtn = document.querySelector("#theme-light-button > box-icon");
const darkThemeBtn = document.querySelector("#theme-dark-button > box-icon");
// variables
let mainNumDigitCount = 1;
let operatorEntered = false;
let number2Entered = false;
let operationEnded = false;

let currentTheme = "light";
// colors
const Theme = {
  BackgroundColor: {
    light: "white",
    dark: "#010101",
  },
  DarkColor: {
    dark: "white",
    light: "#010101",
  },
  ThemeColor: {
    light: "#0090fb",
    dark: "#fe820a",
  },
  ThemeColorLight: {
    light: "#bee3fe",
    dark: "#d55901",
  },
  BackgroundImg: {
    light: 'url("./img/bg.jpg")',
    dark: 'url("./img/bg_dark.jpg")',
  },
};

// ----------------------------------------------------------------------
const operators = {
  "+": function (a, b) {
    return a + b;
  },
  "-": function (a, b) {
    return a - b;
  },
  "*": function (a, b) {
    return a * b;
  },
  "/": function (a, b) {
    return a / b;
  },
  "=": function (a, b) {
    return this[screenTop.textContent.slice(-1)](a, b);
  },
};
// ----------------------------------------------------------------------
function loadTheme(theme) {
  if (theme == "light") {
    document.querySelector("#theme-dark-button").style.display = "none";
    document.querySelector("#theme-light-button").style.display =
      "inline-block";
  } else {
    document.querySelector("#theme-light-button").style.display = "none";
    document.querySelector("#theme-dark-button").style.display = "inline-block";
  }
  root.style.setProperty("--BG-Color", `${Theme.BackgroundColor[theme]}`);
  root.style.setProperty("--THEME-Color", `${Theme.ThemeColor[theme]}`);
  root.style.setProperty(
    "--THEME-Color-Light",
    `${Theme.ThemeColorLight[theme]}`
  );
  root.style.setProperty("--DARK-Color", `${Theme.DarkColor[theme]}`);
  root.style.setProperty("--BG-Image", `${Theme.BackgroundImg[theme]}`);
}

function clearScreen() {
  screenBottom.textContent = "0";
  screenTop.textContent = "";
  mainNumDigitCount = 1;
  operatorEntered = false;
  number2Entered = false;
  operationEnded = false;
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
  if (operationEnded) {
    clearScreen();
  }
  if (operatorEntered && !number2Entered) {
    screenBottom.textContent = "0";
    mainNumDigitCount = 1;
    number2Entered = true;
  }
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
  if (operationEnded) {
    clearScreen();
  }
  if (operatorEntered && !number2Entered) {
    screenBottom.textContent = "0";
    mainNumDigitCount = 1;
    number2Entered = true;
  }

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
  // let strIntPart = strNumber.split("-").join("").split(",").join("");
  let splitedFloat = strNumber.split("-")[0].split(".");
  let strIntPart = splitedFloat[0].split(",").join("");
  let strFloatPart = strNumber.includes(".") ? "." + splitedFloat[1] : "";
  if (strIntPart.length <= 3) {
    return strNumber;
  }
  strIntPartCommad =
    appendComma(strIntPart.slice(0, -3)) + strIntPart.slice(-3);
  if (strNumber.charAt(0) == "-") {
    return "-" + strIntPartCommad + strFloatPart;
  } else return strIntPartCommad + strFloatPart;
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
// -----------------------------------------------------------------------
function operate(operator) {
  operatorEntered = true;
  if (!screenTop.textContent.length || !number2Entered) {
    screenTop.textContent =
      parseScreen(screenBottom.textContent) + " " + operator;
    if (operator != "=") {
      operationEnded = false;
    }
    return;
  }

  // calculate
  const screenBottomNumber = parseScreen(screenBottom.textContent);
  let splited = screenTop.textContent.split(" ");
  let result = operators[splited[1]](Number(splited[0]), screenBottomNumber);

  if (operator == "=") {
    screenTop.textContent =
      splited[0] + " " + splited[1] + " " + screenBottomNumber + " = " + result;
    operationEnded = true;
  } else {
    screenTop.textContent = result + " " + operator;
  }

  screenBottom.textContent = addCommas(result.toString());
  number2Entered = false;
}

function parseScreen(numStr) {
  return Number(numStr.split(",").join(""));
}
// -----------------------------------------------------------------------
// main
// input buttons events
btnSign.addEventListener("mousedown", changeSign);
btnFloat.addEventListener("mousedown", inputFloat);
btnNumbers.forEach((btn) => btn.addEventListener("mousedown", inputNumBtn));
// utility buttons events
btnClear.addEventListener("mousedown", clearScreen);
btnBackspace.addEventListener("mousedown", backSpace);
// operator buttons events
btnOperators.forEach((btn) =>
  btn.addEventListener("mousedown", () => operate(btn.value))
);
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
  } else if (btn.classList.contains("operator")) {
    operate(btn.value);
  }
});
// -------------------------------------------

lightThemeBtn.setAttribute("color", Theme.ThemeColorLight.light);
darkThemeBtn.setAttribute("color", Theme.ThemeColorLight.dark);
lightThemeBtn.addEventListener("mousedown", () => loadTheme("dark"));
darkThemeBtn.addEventListener("mousedown", () => loadTheme("light"));
