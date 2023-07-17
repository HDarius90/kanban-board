const mongoose = require('mongoose');
const Task = require('./models/task.js');

mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard')
    .then(() => {
        console.log("MONGOOSE CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("OH NO MONGOOOSE ERROR")
        console.log(err);
    })


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

    Task.insertMany(seedTasks)
    .then(res => {
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
    })