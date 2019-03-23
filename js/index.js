var activeNumber = "0"; // String to be displayed on the main screen
var prevNumber = "0";
var prevNumber2 = ""
var expression = "";
var lastOperator = "";
var lastInput = "";
var expressionHistory = ["", "", "", ""];

$("document").ready(function() {
  activateButtons();
  checkExpression();
  updateDisplay();
});

// Bind .click() events to calculator buttons
function activateButtons() {

  // number input buttons
  $("#btn-0").click(function() {
    inputNumber("0");
  });
  $("#btn-1").click(function() {
    inputNumber("1");
  });
  $("#btn-2").click(function() {
    inputNumber("2");
  });
  $("#btn-3").click(function() {
    inputNumber("3");
  });
  $("#btn-4").click(function() {
    inputNumber("4");
  });
  $("#btn-5").click(function() {
    inputNumber("5");
  });
  $("#btn-6").click(function() {
    inputNumber("6");
  });
  $("#btn-7").click(function() {
    inputNumber("7");
  });
  $("#btn-8").click(function() {
    inputNumber("8");
  });
  $("#btn-9").click(function() {
    inputNumber("9");
  });
  $("#btn-dp").click(function() {
    inputNumber(".");
  });

  // basic arithmetic operators
  $("#btn-plus").click(function() {
    inputOperator("+");
  });
  $("#btn-minus").click(function() {
    inputOperator("-");
  });
  $("#btn-multiply").click(function() {
    inputOperator("×");
  });
  $("#btn-divide").click(function() {
    inputOperator("÷");
  });
  $("#btn-equal").click(function() {
    inputOperator("=");
  });

  // display operators
  $("#btn-R").click(function() {
    inputOperator("R");
  }); // [Reset]       Reset everything
  $("#btn-C").click(function() {
    inputOperator("C");
  }); // [Clear]       Clears activeNumber + expression, preserves history
  $("#btn-CE").click(function() {
    inputOperator("CE");
  }); // [Clear Entry] Clears activeNumber, preserves expression + history
  $("#btn-BA").click(function() {
    inputOperator("BA");
  }); // [Back]        clears the last digit of activeNumber

  // unary operators
  $("#btn-inv").click(function() {
    unaryOperator("inv");
  });
  $("#btn-neg").click(function() {
    unaryOperator("neg");
  });
  $("#btn-sq").click(function() {
    unaryOperator("sq");
  });
  $("#btn-sqrt").click(function() {
    unaryOperator("sqrt");
  });
}

// Function handles various NUMBER/DP button presses
function inputNumber(input) {

  // Disables the "." button if there's a "." present in the activeNumber already
  if (input == "." && activeNumber.indexOf(".") >= 0)
    return;
  else if (activeNumber == "Infinity") {
    resetCalculator();
    return;
  }

  if (lastInput == "=") {
    activeNumber = "0";
    prevNumber = "0";
    lastOperator = "";
  }
  // Overwrites the last result if we have just handled an arithmetic operation
  else if (/[\+\-\×\÷]/.test(lastInput) == true)
    activeNumber = "0";

  lastInput = input;
  activeNumber = activeNumber.concat(input); // appends input to 'activeNumber' string
  checkExpression(input); // checks the 'activeNumber' string
  updateDisplay(); // update new values on webpage        
}

// Checks the expression string & handles input accordingly
function checkExpression(prevInput) {

  var stringLength = activeNumber.length;
  var firstChar = activeNumber.charAt(0);
  var secondChar = activeNumber.charAt(1);

  // Fills in "0" is activeNumber is empty
  if (stringLength == 0 || activeNumber == undefined)
    activeNumber = "0";
  // Make sure the initial "0" doesn't get concat() (eg. "08", should be "8" instead)
  else if (firstChar == "0" && isNaN(prevInput) == false && secondChar != ".")
    activeNumber = activeNumber.slice(1);
}

// Updates values displayed on the webpage (calculator)
function updateDisplay() {

  $("#display_main").text(activeNumber.substr(0, 12));

  // Reserves the space for emptied display_expression <div>
  if (expression == "") $("#display_expression").html('&nbsp;');
  else $("#display_expression").text(expression);

  // Reserves the space for emptied display_history <div>'s
  for (var i = 0; i < 4; i++) {
    var tempString = "#display_history_" + i.toString();
    if (expressionHistory[i] == "") $(tempString).html('&nbsp;');
    else $(tempString).text(expressionHistory[i]);
  }
}

function unaryOperator(input) {

  if (activeNumber == "Infinity") {
    resetCalculator();
    return;
  }

  var tempString = "";
  var tempNumber = activeNumber;

  switch (input) {

    case "inv":
      activeNumber = (1 / parseFloat(activeNumber)).toString();
      tempString = " inv(";
      break

    case "neg":
      activeNumber = ((-1) * parseFloat(activeNumber)).toString();
      tempString = " neg(";
      break

    case "sq":
      activeNumber = (Math.pow(parseFloat(activeNumber), 2)).toString();
      tempString = " sq(";
      break

    case "sqrt":
      activeNumber = (Math.sqrt(parseFloat(activeNumber))).toString();
      tempString = " sqrt(";
      break

    default:
      return;
  }

  checkExpression();
  $("#display_expression").text(expression + tempString + tempNumber + ")");
  $("#display_main").text(activeNumber.substr(0, 12));
  return;
}

// Function handles various OPERATOR button presses
function inputOperator(input) {

  switch (input) {

    case "R":
      expressionHistory = ["", "", "", ""];
      resetCalculator();
      return;

    case "C":
      resetCalculator();
      return;

    case "CE":
      activeNumber = "";
      break;

    case "BA":
      activeNumber = activeNumber.slice(0, -1);
      break;

    case "=":
      // Button disabled when user hasn't keyed in any arithmetic operator
      if (lastOperator == "") // Do nothing if there isn't a last operation
        expression = activeNumber;
      // Normal Operation
      else if (lastInput != "=") {
        prevNumber2 = activeNumber; // Caches the 2nd operand for case of user repeatedly pressing equal button
        expression = expression.concat(" " + activeNumber); // update expression
        var result = doMath(prevNumber, activeNumber, lastOperator); // Evaluate the math operation
        activeNumber = result; // display result
        prevNumber = result; // store result for next operation
      }
      // When user repeatedly presses equal button
      else {
        expression = (activeNumber + " " + lastOperator + " " + prevNumber2);
        activeNumber = doMath(activeNumber, prevNumber2, lastOperator); // Evaluate the math operation
      }

      pushToHistory(expression); // Push expression to history
      expression = ""; // Clear expression
      break;

    default:
      if (lastInput == "=") {
        expression = expression.concat(" " + activeNumber + " " + input); // update expression
        prevNumber = activeNumber;
      }
      // IF user changes math operator b4 keying in the 2nd operand
      else if (/[\+\-\×\÷]/.test(lastInput) == true && lastOperator != "")
        expression = expression.slice(0, -1).concat(input);
      else {
        expression = expression.concat(" " + activeNumber + " " + input); // update expression
        var result = doMath(prevNumber, activeNumber, lastOperator);
        activeNumber = result; // display result
        prevNumber = result; // store result for next operation
        lastOperator = input;
      }

      lastOperator = input;
      break;
  }

  lastInput = input
  checkExpression(input);
  updateDisplay();
}

// Function that handles MATH operations ( a = prevNumber, b = activeNumber )
function doMath(a, b, operation) {

  // convert a & b from string into numeric type
  var num_a = parseFloat(a);
  var num_b = parseFloat(b);
  var tempResult;

  // Prevents any operation when user presses a button just after a reset
  if (lastOperator == "") return b;

  switch (operation) {
    case "+":
      tempResult = (num_a + num_b);
      break;
    case "-":
      tempResult = (num_a - num_b);
      break;
    case "×":
      tempResult = (num_a * num_b);
      break;
    case "÷":
      tempResult = (num_a / num_b);
      break;
    default:
      return b;
  }

  // If result is has a decimal point, remove redundant zeroes behind (eg. 1.70000 -> 1.7)
  tempResult = tempResult.toFixed(8);
  if (tempResult.indexOf(".") != -1) {
    while (tempResult.slice(-1) == "0")
      tempResult = tempResult.slice(0, -1);

    if (tempResult.slice(-1) == ".")
      tempResult = tempResult.slice(0, -1);
  }

  return tempResult;
}

// Resets all variables (similar to refreshing webpage)
function resetCalculator() {
  activeNumber = "0"; // String to be displayed on the main screen
  prevNumber = "0";
  expression = "";
  lastOperator = "";
  lastInput = "";
  updateDisplay();
}

// Updates the expression history
function pushToHistory(str) {

  // Pops the oldest expression in the array (from the back)
  // Adds latest string into array (from the front)
  // [array can store only the last 4 EXP]
  if (expressionHistory.length > 4)
    expressionHistory.pop();

  expressionHistory.unshift(str);
}