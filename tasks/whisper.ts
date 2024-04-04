import { OpenAIWhisperAudio } from "langchain/document_loaders/fs/openai_whisper_audio";
import { solveTask } from "../utils/tasks";

const TASK_NAME = "whisper";
const FILE_URL = "https://tasks.aidevs.pl/data/mateusz.mp3";

const solution = async ({ task }) => {
  const response = await fetch(FILE_URL);
  const audioFile = new File([await response.arrayBuffer()], "mateusz.mp3", {
    type: "audio/mpeg",
  });

  // const loader = new OpenAIWhisperAudio(audioFile);
  const loader = new OpenAIWhisperAudio("mateusz.mp3");

  const document = await loader.load();
  console.log("Document:", document);

  return document[0].pageContent;
};

solveTask(TASK_NAME, solution);
