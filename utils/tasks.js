const API_KEY = process.env.API_KEY;

const auth = async (taskName) => {
  const response = await fetch(`https://tasks.aidevs.pl/token/${taskName}`, {
    method: 'POST',
    body: JSON.stringify({ apikey: API_KEY }),
  });

  return await response.json()
}

const sendAnswer = async (token, answer) => {
  const response = await fetch(`https://tasks.aidevs.pl/answer/${token}`, {
    method: 'POST',
    body: JSON.stringify({ answer }),
  });

  const result = await response.json();

  console.log('Result', result);
}

const getTask = async (taskName) => {
  const { token } = await auth(taskName);

  const response = await fetch(`https://tasks.aidevs.pl/task/${token}`);

  const task = await response.json();

  console.log('Task', task);

  return {
    task,
    sendAnswer: (answer) => sendAnswer(token, answer),
  };
}


exports.getTask = getTask;