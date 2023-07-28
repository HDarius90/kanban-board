const mongoose = require('mongoose');
const Task = require('./models/task.js');
const Board = require('./models/board.js');

mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDB = async () => {
  try {
    await Task.deleteMany({});
    await Board.deleteMany({});

    const seedTasks = [
      {
        boardName: 'Board 1',
        text: "Go to sleep",
        state: 'todo',
        priority: "low",
        deadline: "2023-08-14",
      },
      {
        boardName: 'Board 1',
        text: "Go to bed",
        state: 'done',
        priority: "medium",
        deadline: "2023-08-14",
      },
      {
        boardName: 'Board 1',
        text: "Go to school",
        state: 'inprogress',
        priority: "high",
        deadline: "2023-08-14",
      },
      {
        boardName: 'Board 2',
        text: "Eat",
        state: 'done',
        priority: "medium",
        deadline: "2023-08-14",
      },
      {
        boardName: 'Board 2',
        text: "Test",
        state: 'done',
        priority: "medium",
        deadline: "2023-08-14",
      },
    ];

    const seedBoards = [
      {
        name: 'Board 1',
        tasks: [],
      },
      {
        name: 'Board 2',
        tasks: [],
      },
    ];

    // Save the boards first to obtain their _id
    const createdBoards = await Board.insertMany(seedBoards);

    // Update the tasks' boardName references with the created board IDs
    for (const task of seedTasks) {
      const board = createdBoards.find((b) => b.name === task.boardName);
      task.boardName = board._id; // Use the _id of the corresponding board
    }

    // Insert the tasks with the updated boardName references
    const createdTasks = await Task.insertMany(seedTasks);

    // Associate tasks with their respective boards
    for (const task of createdTasks) {
      const board = createdBoards.find((b) => b._id.equals(task.boardName));
      board.tasks.push(task._id);
    }

    // Save the updated boards with task references
    await Promise.all(createdBoards.map((board) => board.save()));

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();