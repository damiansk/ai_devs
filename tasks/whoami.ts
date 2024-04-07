import { Document } from "langchain/document";
import { openai } from "../utils/openai";
import { getTask } from "../utils/tasks";

const TASK_NAME = "whoami";

const systemPrompt = ({ documents }) => {
  const context = documents.map((doc) => doc.pageContent).join("\n");

  return `
    You are a person who is trying to guess who is the person described in a context below.

    Rules:
    - Only when you are 100% ready to make a guess return: status "1" and the name of that person as an answer.
    - If you are not sure you should return: status "0" and empty answer.
    - Your answer should be in a JSON format.

    Example answers:
    - {"status": "1", "answer": "Elon Musk"}
    - {"status": "0", "answer": ""}

    Context ###
    ${context}
    ###
  `;
};

const tryToGuess = async ({ documents }) => {
  const openaiResponse = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt({ documents }),
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const answer = openaiResponse.choices[0].message.content;

  if (answer === null) {
    return { status: "0", answer: "" };
  }

  try {
    return JSON.parse(answer);
  } catch (e) {
    return { status: "0", answer: "" };
  }
};

const solution = async () => {
  const documents: Document[] = [];
  let answer, task, sendAnswer;

  do {
    console.log("Getting hint...");

    const response = await getTask(TASK_NAME);
    task = response.task;
    sendAnswer = response.sendAnswer;

    documents.push(new Document({ pageContent: task.hint }));
    answer = await tryToGuess({ documents });
    console.log("Answer: ", answer);
  } while (answer.status !== "1");

  sendAnswer(answer.answer);
};

solution();
