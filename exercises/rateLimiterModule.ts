export type RateLimiter = {
  run: (tasks: Task[], immediately?: boolean) => void | StartFunction;
};

export type StartFunction = () => void;

export type Task = () => Promise<any>;

export function getRateLimiter(rateLimit: number, burstLimit: number, onAllDone?: () => void): RateLimiter {
  const config: RateLimiterConfig = {
    burstLimit,
    rateLimit,
    runningTaskCounter: 0,
    taskIdCounter: 0,
    taskIdPrefix: `taskId-${Math.round(Math.random() * Math.pow(10, 8))}-`,
    taskQ: [],
    taskStartTimes: [],
    onAllDone
  };

  return {
    run: (tasks: Task[], immediately = true): void | StartFunction => {
      tasks.forEach((task: Task): void => nQ(config, task, immediately));

      if (!immediately) {
        return (): void => dQ(config);
      }
    }
  };
}

type TaskObject = {
  id: string;
  task: Task;
  createTime: number;
  startTime?: number;
  endTime?: number;
};

type RateLimiterConfig = {
  burstLimit: number;
  rateLimit: number;
  runningTaskCounter: number;
  taskIdCounter: number;
  taskIdPrefix: string;
  taskQ: TaskObject[];
  taskStartTimes: number[];
  onAllDone?: () => void
};

function nQ(config: RateLimiterConfig, task: Task, shouldStartNow = false): void {
  const { taskIdPrefix, taskQ } = config;
  const taskObj: TaskObject = {
    id: `${taskIdPrefix}${config.taskIdCounter++}`,
    task,
    createTime: Date.now()
  };

  taskQ.push(taskObj);

  if (shouldStartNow) {
    dQ(config);
  }
}

function dQ(config: RateLimiterConfig): void {
  const { burstLimit, runningTaskCounter, taskQ, taskStartTimes, onAllDone } = config;

  if (taskQ.length === 0) {
    return;
  }

  if (shouldStartAnother(config)) {
    // @ts-ignore
    const taskObj: TaskObject = taskQ.shift();
    const { task } = taskObj;
    // console.log('start task', taskObj.id);
    const startTime: number = Date.now();

    ++config.runningTaskCounter;
    // console.log('push start time:', startTime);
    taskStartTimes.push(startTime);
    taskObj.startTime = startTime;

    task().finally(() => {
      taskObj.endTime = Date.now();
      runningTaskCounter > 0 && --config.runningTaskCounter;

      if (runningTaskCounter === 0 && taskQ.length === 0) {
        onAllDone?.();
      }
      
      // console.log('done............................');
      dQ(config);
    });

    if (runningTaskCounter < burstLimit) {
      dQ(config);
    }
  } else {
    // console.log('throttled');
    if (runningTaskCounter < burstLimit) {
      setTimeout(() => dQ(config), 1000 - (Date.now() - taskStartTimes[0]));
    }
  }
}

function shouldStartAnother(config: RateLimiterConfig): boolean {
  const { burstLimit, rateLimit, runningTaskCounter, taskStartTimes } = config;
  const now: number = Date.now();
  const baseTime: number | undefined = taskStartTimes[taskStartTimes.length - rateLimit];
  const isLowerThanRateLimit: boolean = baseTime === undefined || now - baseTime > 1000;
  const isLowerThanBurstLimit: boolean = runningTaskCounter < burstLimit;

  // console.log('###################################################');
  // console.log('baseTime:', baseTime);
  // console.log('now - baseTime:', now - baseTime);
  // console.log('task start times:', taskStartTimes);
  // console.log('rateLimit:', rateLimit);
  // console.log('is lower than rate limit:', isLowerThanRateLimit);
  // console.log('runningTaskCounter:', runningTaskCounter);
  // console.log('burstLimit:', burstLimit);
  // console.log('is lower than burst limit:', isLowerThanBurstLimit);
  if (isLowerThanRateLimit && isLowerThanBurstLimit) {
    if (typeof baseTime === 'number') {
      taskStartTimes.shift();
    }

    return true;
  }

  return false;
}
