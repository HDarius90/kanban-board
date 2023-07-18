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

app.get('/boards/b/:reqestedBoardName', async (req, res) => {
    const { reqestedBoardName } = req.params;
    const tasks = await Task.find({})
    const filteredTasks = filterTasksByBoardName(tasks, reqestedBoardName)
    const allBoardsName = getAllBoards(tasks);
    res.render('show', { filteredTasks, allBoardsName })
})

app.get('/boards/newtask', async (req, res) => {
    const boardName = req.query.board;
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('newtask', { allBoardsName, boardName });
})

app.post('/boards/newtask', async (req, res) => {
    const boardName = req.query.board;
    const newTask = new Task(req.body);
    newTask.boardName = boardName;
    await newTask.save();
    const tasks = await Task.find({})
    const filteredTasks = filterTasksByBoardName(tasks, boardName)
    const allBoardsName = getAllBoards(tasks);
    res.render('show', { filteredTasks, allBoardsName })
})

app.get('/boards/newboard', async (req, res) => {
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('newboard', { allBoardsName });
})

app.post('/boards/newboard', async (req, res) => {
    const newTask = new Task(req.body);
    const boardName = newTask.boardName;
    await newTask.save();
    const tasks = await Task.find({})
    const filteredTasks = filterTasksByBoardName(tasks, boardName)
    const allBoardsName = getAllBoards(tasks);
    res.render('show', { filteredTasks, allBoardsName })
})

app.get('/boards/task/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('task', { task, allBoardsName })
})

app.listen(3000, () => {
    console.log("LISSENING ON PORT 3000");
})

