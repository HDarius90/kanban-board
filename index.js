const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Task = require('./models/task');
const bodyParser = require('body-parser');
const { filterTasksByBoardName, getAllBoards } = require('./utils'); // 





app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard')
    .then(() => {
        console.log("MONGOOSE CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("OH NO MONGOOOSE ERROR")
        console.log(err);
    })

app.get('/boards', async (req, res) => {
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('boards', { tasks, allBoardsName })
})

app.get('/b/:reqestedBoardName', async (req, res) => {
    const { reqestedBoardName } = req.params;
    const tasks = await Task.find({})
    const filteredTasks = filterTasksByBoardName(tasks, reqestedBoardName)
    const allBoardsName = getAllBoards(tasks);
    res.render('show', { filteredTasks, allBoardsName })
})

app.get('/boards/newtask', async (req, res) => {
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('newtask', { allBoardsName });
})

app.post('/boards', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('boards', { tasks, allBoardsName })
})
app.listen(3000, () => {
    console.log("LISSENING ON PORT 3000");
})

