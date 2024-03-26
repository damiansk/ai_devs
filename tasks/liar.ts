import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { solveTask, taskForm } from "../utils/tasks";
// const { ChatPromptTemplate } = require('langchain/prompts/load.js');

const TASK_NAME = "liar";

const chat = new ChatOpenAI({
  openAIApiKey: process.env["OPENAI_API_KEY"],
  modelName: "gpt-3.5-turbo",
});
const QUESTION = "Is coffee from a beans?";
const GUARD_PROMPT =
  "Return 1 if answer: {answer} is a correct answer for the question: {question}, otherwise return 0.";

const solution = async ({ token }) => {
  const response = await taskForm({ question: QUESTION }, token);
  const prompt = PromptTemplate.fromTemplate(GUARD_PROMPT);

  const chain = new LLMChain({ llm: chat, prompt });

  const { text } = await chain.call({
    question: QUESTION,
    answer: response.answer,
  });

  const result = text === "1" ? "YES" : "NO";

  return result;
};

solveTask(TASK_NAME, solution);
