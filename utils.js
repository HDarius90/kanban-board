module.exports = {
    filterTasksByBoardName: function (tasks, requestedBoardName) {
      const selectedBoardTasks = [];
  
      for (let task of tasks) {
        if (task.boardName.replace(/\s+/g, '').toLowerCase() === requestedBoardName) {
          selectedBoardTasks.push(task);
        }
      }
  
      return selectedBoardTasks;
    },
  
    getAllBoards: function (tasks) {
      const allBoardsName = [];
  
      for (let task of tasks) {
        if (!allBoardsName.includes(task.boardName)) {
          allBoardsName.push(task.boardName);
        }
      }
  
      return allBoardsName;
    }
  };