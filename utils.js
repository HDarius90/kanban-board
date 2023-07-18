module.exports = {
    filterTasksByBoardName: function (tasks, requestedBoardName) {
      const selectedBoardTasks = [];
  
      for (let task of tasks) {
        if (task.boardName.replace(/\s+/g, '').toLowerCase() === requestedBoardName.replace(/\s+/g, '').toLowerCase()) {
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
    },

    convertISODateToYYYYMMDD: function (isoDate) {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    }
    
  };