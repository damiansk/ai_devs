import { openai } from "../utils/openai";
import { solveTask } from "../utils/tasks";

const TASK_NAME = "people";
const QUESTION_SUMMARY_SYSTEM_TEMPLATE = `
  You are an assistant who is responsible to get core information from the asked question.

  Instruction:
  - Focus on the first name and last name from the question
  - First name should be changed to the official non short version
  - Carefully match the question to the following topics:
    + colour
    + favourite-food
    + residence
  - Your response should be in JSON format
  - Double verify if generated content is in valid JSON format
  - If you cannot match the name or topic return empty string as a value

  Example:
  - { firstName: "Bogusław", lastName: "Bajorko", question: "colour" }
  - { firstName: "Henryk", lastName: "Ludek", question: "favourite-food" }
  - { firstName: "Andrzej", lastName: "Pizza", question: "residence" }
  - { firstName: "", lastName: "", question: "" }
`;

const ANSWER_SYSTEM_TEMPLATE = (context) => `
  You are an assistant who is responsible for answer the question about the person based on provided context.

  Instruction:
  - Answer should be short
  - Answer should based on a provided Context
  - Context is provided in a JSON format
  - If you doesn't have enough information be honest and say "I don't know"

  Context ###
  ${context}
  ###
`;

const fetchPeople = async (url) => {
  const response = await fetch(url);
  const articles = await response.json();

  return articles;
};

const solution = async ({ task }) => {
  const people = await fetchPeople(task.data);

  const questionSummaryChat = await openai.chat.completions.create({
    messages: [
      { role: "system", content: QUESTION_SUMMARY_SYSTEM_TEMPLATE },
      { role: "user", content: task.question },
    ],
    model: "gpt-3.5-turbo",
  });

  const questionSummary = JSON.parse(
    questionSummaryChat.choices[0].message.content
  );
  console.log("Question summary:", questionSummary);

  const person = people.find(
    ({ imie, nazwisko }) =>
      imie === questionSummary?.firstName &&
      nazwisko === questionSummary?.lastName
  );

  console.log("Found person:", person);

  const answerChat = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: ANSWER_SYSTEM_TEMPLATE(JSON.stringify(person)),
      },
      { role: "user", content: task.question },
    ],
    model: "gpt-3.5-turbo",
  });

  const answer = answerChat.choices[0].message.content;
  console.log("Answer:", answer);

  return answer;
};

solveTask(TASK_NAME, solution);
