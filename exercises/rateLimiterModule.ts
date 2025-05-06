/**
 * This rate limiter is used to limit the number of concurrent requests to an API. It takes into account both the rate
 * limit and the burst limit of a specific API and makes sure that we don't go over the limits while exploiting the
 * assigned limits to the most. It also provides a callback function to be invoked when all tasks are done.
 *
 * @example
 * const rateLimiter: RateLimiter = getRateLimiter(10, 20, () => console.log('All tasks are done!'));
 */

/**
 * The rate limiter object which contains the configuration and the functions to run the tasks.
 * @typedef {Object} RateLimiter
 * @property {StartFunction|undefined} run The function to run the tasks. If the `immediately` option is true, the tasks
 * will start running immediately. Otherwise, return a function which will start running the tasks.
 */
export type RateLimiter = {
  run: (tasks: Task[], options?: RunFunctionOptions) => StartFunction | undefined;
};

/**
 * The options to run the tasks.
 * @typedef {Object} RunFunctionOptions
 * @property {boolean} [immediately=true] True if tasks should start running as soon as possible. Otherwise, wait for
 * the start function.
 * @property {() => void} [onAllDoneOverride] Override the `onAllDone()` function that's set when the rate limiter is
 * created. This only works with the current run.
 */
export type RunFunctionOptions = { immediately?: boolean; onAllDoneOverride?: () => void };

/**
 * The function to start running the tasks in the queue if they were not configured to run immediately after entering
 * the queue.
 * @typedef {() => void} StartFunction
 * @returns {undefined} Nothing is returned.
 */
export type StartFunction = () => void;

/**
 * The task to run. It should return a promise. It should take care of any error that may happen when the task is running.
 * @typedef {() => Promise<any>} Task
 * @returns {Promise<any>} A promise.
 * @example
 * const task: Task = () => Promise.resolve();
 */
export type Task = () => Promise<any>;

/**
 * Creates a rate limiter which runs an array of tasks according to the assigned limits and optionally invoke a callback
 * when all tasks are done.
 *
 * @param {number} rateLimit The rate limit.
 * @param {number} burstLimit The burst limit.
 * @param {() => void} [onAllDone] The callback to be invoked when all tasks are done. This is used for all runs and can
 * be overridden for individual runs.
 * @returns {RateLimiter} The rate limiter object.
 * @example
 * const rateLimiter: RateLimiter = getRateLimiter(10, 20, () => console.log('All tasks are done!'));
 */
export function getRateLimiter(rateLimit: number, burstLimit: number, onAllDone?: () => void): RateLimiter {
  // Each rate limiter object will have its own config object which has all the configuration data it needs.
  const config: RateLimiterConfig = {
    burstLimit,
    historicalTasks: [],
    rateLimit,
    runningTasksCounter: 0,
    taskIdCounter: 0,
    taskIdPrefix: `taskId-${Math.round(Math.random() * 10 ** 8)}-`,
    taskQ: [],
    onAllDone,
  };

  return {
    /**
     * Run the tasks. If the `immediately` is true, the tasks will start running immediately. Otherwise, return a function
     * which will start running the tasks.
     *
     * @param {Task[]} tasks The tasks to run.
     * @param {boolean} [immediately=true] True if tasks should start running as soon as possible. Otherwise, wait for
     * the start function.
     * @param {() => void} [onAllDoneOverride] Override the `onAllDone()` function that's set when the rate limiter is
     * created. This only works with the current run.
     * @returns {StartFunction|undefined} If the tasks are run immediately, returns undefined. Otherwise, return a
     * function which will start running the tasks.
     */
    run: (
      tasks: Task[],
      { immediately = true, onAllDoneOverride }: RunFunctionOptions = {}
    ): StartFunction | undefined => {
      const newConfig: RateLimiterConfig = {
        ...config,
        onAllDone: onAllDoneOverride ?? onAllDone,
      };

      tasks.forEach((task: Task): void => nQ(newConfig, task, immediately));

      if (!immediately) {
        return (): void => dQ(newConfig);
      }
    },
  };
}

/**
 * The task object which is an enriched object of a task.
 * @typedef {Object} TaskObject
 * @property {string} id The unique ID of the task.
 * @property {Task} task The task.
 * @property {number} createTime The time when the task is created.
 * @property {number} [startTime] The time when the task starts running.
 * @property {number} [endTime] The time when the task ends.
 */
type TaskObject = {
  id: string;
  task: Task;
  createTime: number;
  startTime?: number;
  endTime?: number;
};

/**
 * The configuration object for a RateLimiter object.
 * @typedef {Object} RateLimiterConfig
 * @property {number} burstLimit The burst limit. This is the maximum number of tasks which can be running at the same time.
 * @property {TaskObject[]} historicalTasks The tasks which have been started. This is used to calculate the rate limit.
 * @property {number} rateLimit The rate limit. This is the maximum number of tasks which can be running per second.
 * @property {number} runningTasksCounter The number of tasks which are currently running.
 * @property {number} taskIdCounter A counter for the purposes of generating unique IDs for tasks.
 * @property {string} taskIdPrefix The prefix for the task IDs. This is used to generate unique IDs for tasks.
 * @property {TaskObject[]} taskQ The task queue.
 * @property {() => void} [onAllDone] The callback to be invoked when all tasks are done.
 */
type RateLimiterConfig = {
  burstLimit: number;
  historicalTasks: TaskObject[];
  rateLimit: number;
  runningTasksCounter: number;
  taskIdCounter: number;
  taskIdPrefix: string;
  taskQ: TaskObject[];
  onAllDone?: () => void;
};

/**
 * Put the task into a queue and start running if it should.
 *
 * @param {RateLimiterConfig} config The config object which has all the configuration data that a rate limiter object needs.
 * @param {Task} task The task to be queued up.
 * @param {boolean} [shouldStartNow=true] True to start running the task right away. False do nothing after putting it
 * in the queue.
 */
function nQ(config: RateLimiterConfig, task: Task, shouldStartNow = true): void {
  const { taskIdPrefix, taskQ } = config;
  const taskObj: TaskObject = {
    id: `${taskIdPrefix}${config.taskIdCounter++}`,
    task,
    createTime: Date.now(),
  };

  taskQ.push(taskObj);

  if (shouldStartNow) {
    dQ(config);
  }
}

/**
 * Run a task if possible.
 *
 * @param {RateLimiterConfig} config The config object which has all the configuration data that a rate limiter object needs.
 */
function dQ(config: RateLimiterConfig): void {
  const { burstLimit, historicalTasks, rateLimit, runningTasksCounter, taskQ, onAllDone } = config;

  if (taskQ.length === 0) {
    return;
  }

  if (shouldStartAnother(config)) {
    const taskObj: TaskObject | undefined = taskQ.shift();

    if (!taskObj) {
      return;
    }

    const { task } = taskObj;

    ++config.runningTasksCounter;
    taskObj.startTime = Date.now();
    historicalTasks.push(taskObj);

    task().finally(() => {
      taskObj.endTime = Date.now();
      config.runningTasksCounter > 0 && --config.runningTasksCounter;

      // All done
      if (config.runningTasksCounter === 0 && taskQ.length === 0) {
        onAllDone?.();
      }

      dQ(config);
    });

    if (runningTasksCounter < burstLimit) {
      dQ(config);
    }
  } else {
    if (runningTasksCounter < burstLimit) {
      // We can not start another task while we are still below the burst limit? That means we have already made X
      // requests in the past 1 second (X is the rate limit). We can try starting a new task when this 1 second passes.

      /**
       * This should be the start time of the Xth task counting backwards from the end of the `historicalTasks` array
       * where `X` is the rate limit.
       */
      const startTimeToCompare: number | undefined = historicalTasks[historicalTasks.length - rateLimit]?.startTime;

      if (startTimeToCompare) {
        setTimeout(() => dQ(config), 1000 - (Date.now() - startTimeToCompare));
      }
    }
  }
}

/**
 * Check if a new task should start. The task is only started when the rate limit and burst limit are both not reached.
 *
 * @param {RateLimiterConfig} config The config object which has all the configuration data that a rate limiter object needs.
 * @returns {boolean} True if a new task should start. False otherwise.
 */
function shouldStartAnother(config: RateLimiterConfig): boolean {
  const { burstLimit, historicalTasks, rateLimit, runningTasksCounter } = config;
  /**
   * This should be the start time of the Xth task counting backwards from the end of the `historicalTasks` array where
   * `X` is the rate limit. It is `undefined` if the number of ever started tasks is less than the rate limit
   */
  const startTimeToCompare: number | undefined = historicalTasks[historicalTasks.length - rateLimit]?.startTime;
  const isLowerThanRateLimit: boolean = startTimeToCompare === undefined || Date.now() - startTimeToCompare > 1000;
  const isLowerThanBurstLimit: boolean = runningTasksCounter < burstLimit;

  return isLowerThanRateLimit && isLowerThanBurstLimit;
}
