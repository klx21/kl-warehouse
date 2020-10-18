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

  if (compactExp.search(/[()]/) > -1) { // There are parentheses in the expression
    let noParenthesesExp = '';
    let expCache = []; // Cache of expressions inside parentheses.

    [...compactExp].forEach(char => {
      if (char === '(') { // Open parenthesis. Push a new string to the expressions cache.
        expCache.push('');
      }
      if (char === ')') { // Close parenthesis. Calculate the result of the expression inside the parentheses.
        let expInParentheses = expCache.pop();
        let resultOfParentheses = doASMD(expInParentheses);
        if (expCache.length > 0) { // There are still expressions inside parentheses to calculate.
          expCache[expCache.length - 1] += resultOfParentheses;
        } else { // All parentheses expressions have been worked out.
          noParenthesesExp += resultOfParentheses;
        }
      }
      if (/[0-9+*/-]+/.test(char)) { // Numbers or operators. Append to either the last element in the expressions cache or the main string.
        if (expCache.length > 0) { // Append to the last element in the expressions cache.
          expCache[expCache.length - 1] += char;
        } else { // Append to the main string.
          noParenthesesExp += char;
        }
      }
    });

    console.log(noParenthesesExp);

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
  const plusRegex = /\+[0-9*/]+/g;
  const minusRegex = /-[0-9*/]+/g;
  const firstNum = exp.substring(0, exp.search(/[+-]/));
  const plusItems = exp.match(plusRegex);
  const minusItems = exp.match(minusRegex);
  const plusResult = (firstNum ? doMD(firstNum) : 0) + (
    plusItems ? plusItems.reduce((accumulator, current) => {
      return accumulator + doMD(current.substring(1));
    }, 0) : 0
  );
  const minusResult = minusItems ? minusItems.reduce((accumulator, current) => {
    return accumulator + doMD(current.substring(1));
  }, 0) : 0;

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
  const multiplyResult = firstNum * (
    multiplyItems ? multiplyItems.reduce((accumulator, current) => {
      return accumulator * parseInt(current.substring(1), 10);
    }, 1) : 1
  );
  const divideResult = divideItems ? divideItems.reduce((accumulator, current) => {
    return accumulator * parseInt(current.substring(1), 10);
  }, 1) : 1;

  return multiplyResult / divideResult;
}

function isPureNumber(exp) {
  const regex = /^[0-9]+$/;
  return regex.test(exp);
}
