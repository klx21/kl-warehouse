export function fibonacci(n) {
  return n <= 1 ?
    n :
    fibonacci(n - 2) + fibonacci(n - 1);
}
