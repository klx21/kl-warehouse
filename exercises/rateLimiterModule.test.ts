import { getRateLimiter, type RateLimiter, type Task } from "utils/rateLimiter";

describe("RateLimiter", () => {
  describe("getRateLimiter(2, 3)", () => {
    const rateLimit = 2;
    const burstLimit = 3;

    it("should return an object with a run() function", () => {
      const taskRunner: RateLimiter = getRateLimiter(rateLimit, burstLimit);

      expect(taskRunner).toHaveProperty("run");
      expect(typeof taskRunner.run).toBe("function");
    });

    describe("getRateLimiter().run()", () => {
      // eslint-disable-next-line jest/expect-expect
      it("should finish in about 0.4 seconds", async () => {
        await testRunFct([rateLimit, burstLimit], [100, 400], [400, 500]);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should finish in about 1.8 seconds", async () => {
        await testRunFct([rateLimit, burstLimit], [100, 400, 800], [1800, 1900]);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should finish in about 1.5 seconds", async () => {
        await testRunFct([rateLimit, burstLimit], [800, 400, 500], [1500, 1600]);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should finish in about 1.6 seconds", async () => {
        await testRunFct([rateLimit, burstLimit], [1600, 400, 300], [1600, 1700]);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should finish in about 2.3 seconds", async () => {
        await testRunFct([rateLimit, burstLimit], [1600, 400, 1300], [2300, 2400]);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should finish in about 3.1 seconds", async () => {
        await testRunFct([rateLimit, burstLimit], [1600, 400, 500, 600, 1100], [3100, 3200]);
      });
    });
  });
});

async function testRunFct(
  throttleLimits: [rateLimit: number, burstLimit: number],
  taskDurations: number[],
  totalTimeRange: [lowerBoundary: number, higherBoundary: number]
): Promise<void> {
  const tasks: Task[] = taskDurations.map((duration, index) => createTask(duration, index));
  const rateLimiter: RateLimiter = getRateLimiter(...throttleLimits);
  let start: number;
  let end: number;

  const diff: number = await new Promise((resolve) => {
    start = Date.now();
    rateLimiter.run(tasks, {
      onAllDoneOverride: () => {
        end = Date.now();
        resolve(end - start);
      },
    });
  });

  expect(diff).toBeGreaterThanOrEqual(totalTimeRange[0]);
  expect(diff).toBeLessThanOrEqual(totalTimeRange[1]);
}

function createTask(timeToRun: number, taskIndex: number): Task {
  return () => new Promise<any>((resolve) => setTimeout(() => resolve(`resolved ${taskIndex}`), timeToRun));
}
