const express = require("express");
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Task = require('./models/task');
const bodyParser = require('body-parser');
const { getAllBoards, convertISODateToYYYYMMDD } = require('./utils'); // 

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(async (req, res, next) => {
    req.tasks = await Task.find({});
    req.allBoardsName = getAllBoards(req.tasks);
    next();
})


mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.get('/index', async (req, res) => {
    res.render('boards/index', { tasks: req.tasks, allBoardsName: req.allBoardsName })
})

app.get('/boards', async (req, res) => {
    const { boardName } = req.query;
    const filteredTasks = await Task.find({ boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
})

app.get('/boards/newtask', async (req, res) => {
    const { boardName } = req.query;
    res.render('tasks/new', { allBoardsName: req.allBoardsName, boardName });
})

app.post('/boards/newtask', async (req, res) => {
    req.body.boardName = req.query.boardName;
    const { boardName } = req.query;
    const newTask = new Task(req.body);
    await newTask.save();
    const filteredTasks = await Task.find({ boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
})

app.get('/boards/newboard', async (req, res) => {
    res.render('boards/new', { allBoardsName: req.allBoardsName });
})

app.post('/boards/newboard', async (req, res) => {
    const newTask = new Task(req.body);
    req.allBoardsName.push(newTask.boardName);
    const boardName = newTask.boardName;
    await newTask.save();
    const filteredTasks = await Task.find({ boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
})

app.get('/boards/task/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('tasks/show', { task, allBoardsName: req.allBoardsName })
})

app.get('/boards/task/:id/edit', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('tasks/edit', { task, allBoardsName: req.allBoardsName, convertISODateToYYYYMMDD })
})

app.put('/boards/task/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
    res.render('tasks/show', { task, allBoardsName: req.allBoardsName })
})

app.delete('/boards/task/:id', async (req, res) => {
    const { boardName } = req.query;
    await Task.findByIdAndDelete(req.params.id);
    const filteredTasks = await Task.find({ boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
})

app.use((req, res) => {
    res.status(404).send('NOT FOUND!')
})

app.listen(5000, () => {
    console.log("LISSENING ON PORT 5000");
})

