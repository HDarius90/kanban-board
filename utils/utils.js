module.exports = { 
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