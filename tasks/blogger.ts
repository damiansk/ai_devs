import { openai } from "../utils/openai";
import { solveTask } from "../utils/tasks";
// const { ChatOpenAI } = require('langchain/chat_models/openai.js')
// const { ChatPromptTemplate } = require('langchain/prompts/load.js');

const TASK_NAME = "blogger";

const SYSTEM_TEMPLATE = `
  You are a professional blogger and you have to write a blog post about the provided topics.

  Instruction:
  - JSON array with only blog text section content
  - Each section should have a text with max 500 characters
  - Double verify if generated content is in valid JSON format

  Example:
  - ['blog text section 1', 'blog text section 2']
  - ['Content of section XYZ', 'Section ABC content']
`;

const solution = async ({ task }) => {
  const blogContent = task.blog
    .map((title, index) => `${index + 1}. ${title}`)
    .join(" ");

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_TEMPLATE },
      { role: "user", content: blogContent },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log("OpenAI response", chatCompletion.choices[0].message);

  return JSON.parse(chatCompletion.choices[0].message.content);
};

solveTask(TASK_NAME, solution);
