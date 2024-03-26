import { openai } from "../utils/openai";
import { solveTask } from "../utils/tasks";

const TASK_NAME = "moderation";

const solution = async ({ task }) => {
  // Check latest version on `text-moderation`
  const response = await openai.moderations.create({ input: task.input });

  console.log("OpenAI response", response);

  return response.results.map(({ flagged }) => (flagged ? 1 : 0));
};

solveTask(TASK_NAME, solution);
