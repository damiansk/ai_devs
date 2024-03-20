const { getTask } = require('../../utils/tasks.js');

(async () => {
  const TASK_NAME = 'helloapi';

  const { task, sendAnswer } = await getTask(TASK_NAME);

  sendAnswer(task.cookie)
})()