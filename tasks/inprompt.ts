import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SystemMessagePromptTemplate } from "langchain/prompts";
import { solveTask } from "../utils/tasks";

const TASK_NAME = "inprompt";
const NAME_SYSTEM_MESSAGE = `
  You are an assistant helping with parson summarization.
  Return the name of the person who is described in the text.
  Return name and only name without any additional text.
`;
const QUESTION_TEMPLATE = `
  Instructions:
  - Answer the question based on the context below.
  - Your answer shouldn't contain any additional information.
  - If you can't answer the question, you can respond with "null".

  context###
  {context}
  ###
`;

const invokeChatWithMessages = async (messages) => {
  const chat = new ChatOpenAI({
    temperature: 0,
  });

  return await chat.invoke(messages);
};

const solution = async ({ task }) => {
  const nameMessages = [
    new SystemMessage(NAME_SYSTEM_MESSAGE),
    new HumanMessage(task.question),
  ];
  const nameResponse = await invokeChatWithMessages(nameMessages);
  const name = nameResponse.content;
  console.log("Name:", name);

  const personDescription = task.input
    .filter((text) => text.includes(name))
    .join(" ");
  console.log("Description:", personDescription);

  const descriptionMessages = [
    await SystemMessagePromptTemplate.fromTemplate(QUESTION_TEMPLATE).format({
      context: personDescription,
    }),
    new HumanMessage(task.question),
  ];

  const questionResponse = await invokeChatWithMessages(descriptionMessages);
  console.log("Answer:", questionResponse.content);

  return questionResponse.content;
};

solveTask(TASK_NAME, solution);
