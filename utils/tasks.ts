const API_KEY = process.env.API_KEY;

const auth = async (taskName) => {
  const response = await fetch(`https://tasks.aidevs.pl/token/${taskName}`, {
    method: "POST",
    body: JSON.stringify({ apikey: API_KEY }),
  });

  return await response.json();
};

const getTask = async (taskName) => {
  const { token } = await auth(taskName);

  if (!token) {
    throw new Error("No token provided!");
  }

  const response = await fetch(`https://tasks.aidevs.pl/task/${token}`);

  const task = await response.json();

  console.log("Task", task);

  Bun.file("./tasks/", `${taskName}.json`, JSON.stringify(task, null, 4));

  return {
    token,
    task,
    sendAnswer: (answer) => sendAnswer(token, answer),
  };
};

const sendAnswer = async (token, answer) => {
  const response = await fetch(`https://tasks.aidevs.pl/answer/${token}`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });

  const result = await response.json();

  console.log("Result", result);
};

const solveTask = async (taskName, solution) => {
  const { token, task, sendAnswer } = await getTask(taskName);

  if (!solution) {
    console.log("No solution provided");
    return;
  }

  const answer = await solution({ task, token });

  if (!answer) {
    console.log("No answer provided");
    return;
  }

  sendAnswer(answer);
};

const taskForm = async (data = {}, token) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) =>
    formData.append(key, value as string)
  );

  const response = await fetch(`https://tasks.aidevs.pl/task/${token}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  console.log("Task form", result);
  return result;
};

export { getTask, solveTask, taskForm };
