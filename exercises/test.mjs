import { calculate } from './simplest-calculator.mjs';

const expression1 = '1 + ((9 - 6) - (4 - 2)) - (1 + 2) - 5';
const expression2 = '1 + 2 - 3 * 4 * 5 * 6 - 7 + 8 / 9 / 10 - 1';

console.log(calculate(expression1));
console.log(calculate(expression2));
