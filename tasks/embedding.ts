import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { solveTask } from "../utils/tasks";

const TASK_NAME = "embedding";

const chat = new OpenAIEmbeddings({
  modelName: "text-embedding-ada-002",
});

const solution = async ({ task }) => {
  const response = await chat.embedQuery("Hawaiian pizza");
  console.log("Response:", response.length);

  return response;
};

solveTask(TASK_NAME, solution);
