import { solveTask } from "../utils/tasks";

const TASK_NAME = "functions";

// Is this the correct solution?
export const addUserSchema = {
  name: "addUser",
  description: "Add User with given data",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "User name",
      },
      surname: {
        type: "string",
        description: "User surname",
      },
      year: {
        type: "number",
        description: "User birth year",
      },
    },
  },
};

const solution = ({ task }) => {
  return addUserSchema;
};

solveTask(TASK_NAME, solution);
