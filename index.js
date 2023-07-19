const express = require("express");
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Task = require('./models/task');
const bodyParser = require('body-parser');
const { getAllBoards, convertISODateToYYYYMMDD } = require('./utils'); // 





app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
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

app.get('/index', async (req, res) => {
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('boards/index', { tasks, allBoardsName })
})

app.get('/boards', async (req, res) => {
    const { boardName } = req.query;
    const tasks = await Task.find({})
    const filteredTasks = await Task.find({ boardName })
    const allBoardsName = getAllBoards(tasks);
    res.render('boards/show', { filteredTasks, allBoardsName })
})

app.get('/boards/newtask', async (req, res) => {
    const boardName = req.query.board;
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('tasks/new', { allBoardsName, boardName });
})

app.post('/boards/newtask', async (req, res) => {
    const boardName = req.query.board;
    const newTask = new Task(req.body);
    newTask.boardName = boardName;
    await newTask.save();
    const tasks = await Task.find({})
    const filteredTasks = await Task.find({ boardName })
    const allBoardsName = getAllBoards(tasks);
    res.render('boards/show', { filteredTasks, allBoardsName })
})

app.get('/boards/newboard', async (req, res) => {
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('boards/new', { allBoardsName });
})

app.post('/boards/newboard', async (req, res) => {
    const newTask = new Task(req.body);
    const boardName = newTask.boardName;
    await newTask.save();
    const tasks = await Task.find({})
    const filteredTasks = await Task.find({ boardName })
    const allBoardsName = getAllBoards(tasks);
    res.render('boards/show', { filteredTasks, allBoardsName })
})

app.get('/boards/task/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('tasks/show', { task, allBoardsName })
})

app.get('/boards/task/:id/edit', async (req, res) => {
    const task = await Task.findById(req.params.id);
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('tasks/edit', { task, allBoardsName, convertISODateToYYYYMMDD })
})

app.put('/boards/task/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
    const tasks = await Task.find({})
    const allBoardsName = getAllBoards(tasks);
    res.render('tasks/show', { task, allBoardsName })
})

app.delete('/boards/task/:id', async (req, res) => {
    const boardName = req.query.board;
    await Task.findByIdAndDelete(req.params.id);
    const tasks = await Task.find({})
    const filteredTasks = await Task.find({ boardName })
    const allBoardsName = getAllBoards(tasks);
    res.render('boards/show', { filteredTasks, allBoardsName })
})



app.listen(3000, () => {
    console.log("LISSENING ON PORT 3000");
})

