import { getRateLimiter, RateLimiter, Task } from './rateLimiterModule';

let counter = 0;
const urls: string[] = [
  'https://www.google.com',
  'https://www.nba.com',
  'https://www.baidu.com',
  'https://www.usps.com',
  'https://mail.163.com',
  'https://www.bankofamerica.com'
];
const runningTime: number = getRunningTime();
// const tasks: Task[] = Array.from({ length: 10 }).map(
//   (): Task => (): Promise<number> =>
//     new Promise<number>((resolve) => {
//       setTimeout(() => resolve(counter++), runningTime);
//     })
// );
const tasks: Task[] = urls.map((url: string): Task => () => fetch(url)); // .then((res: Response): Promise<string> => res.text()).then((result) => result.length));
const rateLimiter: RateLimiter = getRateLimiter(3, 4);

const start = rateLimiter.run(tasks, true);

// start?.();

// In milliseconds
function getRunningTime(): number {
  return Math.round(Math.random() * 3 * 1000);
}
