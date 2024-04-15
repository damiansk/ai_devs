import { Document } from "langchain/document";
import { v4 as uuidv4 } from "uuid";
import { QdrantConnect } from "../utils/qdrant";
import { solveTask } from "../utils/tasks";

const TASK_NAME = "search";
const ARTICLES_URL = "https://unknow.news/archiwum_aidevs.json";
const COLLECTION_NAME = "aidevs-articles";

const fetchArticles = async () => {
  const response = await fetch(ARTICLES_URL);
  const articles = await response.json();

  return articles;
};

const solution = async ({ task }) => {
  try {
    const qadrantConnect = new QdrantConnect();
    await qadrantConnect.createCollection(COLLECTION_NAME);
    const articles = await fetchArticles();

    const documents = articles.map(
      (article) =>
        new Document({
          pageContent: article.info,
          metadata: {
            title: article.title,
            url: article.url,
            uuid: uuidv4(),
          },
        })
    );

    await qadrantConnect.saveDocumentsOnce(COLLECTION_NAME, documents);
    const searchResult = await qadrantConnect.search(
      COLLECTION_NAME,
      task.question
    );

    console.log("Search result:", searchResult);
    return searchResult?.payload?.url;
  } catch (error) {
    console.error("Error creating collection", error);
    return null;
  }
};

solveTask(TASK_NAME, solution);
