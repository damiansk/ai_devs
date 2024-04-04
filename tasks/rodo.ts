import { solveTask } from "../utils/tasks";

const TASK_NAME = "rodo";

const USER_PROMPT = `
  Introduce yourself in a way that doesn't reveal your personal information.
  Information which you shouldn't reveal but should be included in the text are:
  - Imie/Name
  - Nazwisko/Surname
  - Zawód/Occupation
  - Miasto/Town
  Instead of that, you should provide fake text:
  - %imie%
  - %nazwisko%
  - %zawod%
  - %miasto%
  It is important to include all of the above information in the text.
`;

const solution = ({ task }) => {
  return USER_PROMPT;
};

solveTask(TASK_NAME, solution);
