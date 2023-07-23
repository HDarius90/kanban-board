const mongoose = require('mongoose');
const Task = require('./models/task.js');

mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Task.deleteMany({});

    const seedTasks = [
        {
            boardName: 'Project 1',
            text: "Go to sleep",
            state: 'todo',
            priority: "low",
            deadline: "2023-08-14"
        },
        {
            boardName: 'Project 2',
            text: "Go to bed",
            state: 'done',
            priority: "medium",
            deadline: "2023-08-14"
        },
        {
            boardName: 'Project 1',
            text: "Go to school",
            state: 'inprogress',
            priority: "high",
            deadline: "2023-08-14"
        },
        {
            boardName: 'Project 2',
            text: "Eat",
            state: 'done',
            priority: "medium",
            deadline: "2023-08-14"
        },
        {
            boardName: 'Project 1',
            text: "Test",
            state: 'done',
            priority: "medium",
            deadline: "2023-08-14"
        },
    ]
    await Task.insertMany(seedTasks)
}


seedDB().then(() => {
    mongoose.connection.close()
})