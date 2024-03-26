import { solveTask } from "../utils/tasks";

const TASK_NAME = "helloapi";

const solution = ({ task }) => {
  return task.cookie;
};

solveTask(TASK_NAME, solution);
