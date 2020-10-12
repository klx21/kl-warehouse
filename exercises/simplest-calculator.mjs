/**
 * Handles addition, subtraction, multiplication, division and parentheses.
 *
 * @author Huan Li <klx211@gmail.com>
 * @param {string} exp An arithmetic expression which only contains positive numbers, plus signs, minus signs, multiply
 * signs, divide signs and parentheses.
 * @returns {number} The result of the arithmetic expression.
 */
export function calculate(exp) {
  const compactExp = exp.replace(/\s+/g, '');
  // The expression is a number
  if (isPureNumber(compactExp)) {
    return compactExp;
  }
  // There are parentheses in the expression
  if (compactExp.search(/[()]/) > -1) {
    let noParenthesesExp = '';
    let expCache = [];
    let openParentheses = 0;

    [...compactExp].forEach(char => {
      if (char === '(') {
        expCache[++openParentheses] = '';
      }
      if (char === ')') {
        let expInParentheses = expCache.splice(openParentheses--, 1)[0];
        let resultOfParentheses = doASMD(expInParentheses);
        if (openParentheses > 0) {
          expCache[openParentheses] += resultOfParentheses;
        } else {
          noParenthesesExp += resultOfParentheses;
        }
      }
      if (/[0-9+*/-]+/.test(char)) {
        if (openParentheses > 0) {
          expCache[openParentheses] += char;
        } else {
          noParenthesesExp += char;
        }
      }
    });

    // console.log('no parentheses expression is ', noParenthesesExp);
    return doASMD(noParenthesesExp);
  } else {
    return doASMD(compactExp);
  }
}

/**
 * Do addition, subtraction, multiplication, and division
 */
function doASMD(exp) {
  if (isPureNumber(exp)) {
    return parseInt(exp, 10);
  }
  // console.log('exp in doASMD is ', exp);
  const plusRegex = /\+[0-9*/]+/g;
  const minusRegex = /-[0-9*/]+/g;
  const firstNum = parseInt(exp.substring(0, exp.search(/[+-]/)), 10);
  const plusItems = exp.match(plusRegex);
  const minusItems = exp.match(minusRegex);
  // console.log('plus items are ', plusItems);
  // console.log('minus items are ', minusItems);
  const plusResult = firstNum + (
    plusItems ? plusItems.reduce((accumulator, current) => {
      return accumulator + doMD(current.substring(1));
    }, 0) : 0
  );
  const minusResult = minusItems ? minusItems.reduce((accumulator, current) => {
    return accumulator + doMD(current.substring(1));
  }, 0) : 0;
  // console.log('plus result is ', plusResult);
  // console.log('minus result is ', minusResult);

  return plusResult - minusResult;
}

/**
 * Do multiplication and division
 */
function doMD(exp) {
  if (isPureNumber(exp)) {
    return parseInt(exp, 10);
  }
  const multiplyRegex = /\*[0-9]+/g;
  const divideRegex = /\/[0-9]+/g;
  const firstNum = parseInt(exp.substring(0, exp.search(/[*/]/)), 10);
  const multiplyItems = exp.match(multiplyRegex);
  const divideItems = exp.match(divideRegex);
  // console.log('multiply items are ', multiplyItems);
  // console.log('divide items are ', divideItems);
  const multiplyResult = firstNum * (
    multiplyItems ? multiplyItems.reduce((accumulator, current) => {
      return accumulator * parseInt(current.substring(1), 10);
    }, 1) : 1
  );
  const divideResult = divideItems ? divideItems.reduce((accumulator, current) => {
    return accumulator * parseInt(current.substring(1), 10);
  }, 1) : 1;
  // console.log('multiply result is ', multiplyResult);
  // console.log('divide result is ', divideResult);

  return multiplyResult / divideResult;
}

function isPureNumber(exp) {
  const regex = /^[0-9]+$/;
  return regex.test(exp);
}
