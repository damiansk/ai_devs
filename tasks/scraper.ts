import { openai } from "../utils/openai";
import { solveTask } from "../utils/tasks";

const TASK_NAME = "scraper";
const BROWSER_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.5",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

const systemPrompt = ({ instruction, article, question }) => `
  ${instruction}

  Article ###
  ${article}
  ###

  Question: ${question}
`;

const getArticle = async (url: string) => {
  console.log("Fetching...", url);

  try {
    const response = await fetch(url, {
      headers: BROWSER_HEADERS,
    });
    return await response.text();
  } catch (e) {
    console.log("Error", e);
    return getArticle(url);
  }
};

const solution = async ({ task }) => {
  const article = await getArticle(task.input);

  let openaiResponse = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt({
          instruction: task.msg,
          article: article,
          question: task.question,
        }),
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const answer = openaiResponse.choices[0].message.content;
  console.log("Answer: ", answer);

  return answer;
};

solveTask(TASK_NAME, solution);
