const express = require("express");
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Task = require('./models/task');
const bodyParser = require('body-parser');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { getAllBoards, convertISODateToYYYYMMDD } = require('./utils/utils'); // 

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
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


app.get('/index', catchAsync(async (req, res) => {
    res.render('boards/index', { tasks: req.tasks, allBoardsName: req.allBoardsName })
}))

app.get('/boards', catchAsync(async (req, res) => {
        const { boardName } = req.query;
        const filteredTasks = await Task.find({ boardName })
        res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
}))

app.get('/boards/newtask', catchAsync(async (req, res) => {
    const { boardName } = req.query;
    res.render('tasks/new', { allBoardsName: req.allBoardsName, boardName });
}))

app.post('/boards/newtask', catchAsync(async (req, res) => {
    const { boardName } = req.query;
    req.body.task.boardName = boardName;
    const newTask = new Task(req.body.task);
    await newTask.save();
    const filteredTasks = await Task.find({ boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
}))

app.get('/boards/newboard', catchAsync(async (req, res) => {
    res.render('boards/new', { allBoardsName: req.allBoardsName });
}))

app.post('/boards/newboard', catchAsync(async (req, res) => {
    if(!req.body.task) throw new ExpressError('Invalid Task Data', 400)
    const newTask = new Task(req.body.task);
    req.allBoardsName.push(newTask.boardName);
    const boardName = newTask.boardName;
    await newTask.save();
    const filteredTasks = await Task.find({ boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
}))

app.get('/boards/task/:id', catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('tasks/show', { task, allBoardsName: req.allBoardsName })
}))

app.get('/boards/task/:id/edit', catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('tasks/edit', { task, allBoardsName: req.allBoardsName, convertISODateToYYYYMMDD })
}))

app.put('/boards/task/:id', catchAsync(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body.task, { runValidators: true, new: true });
    res.render('tasks/show', { task, allBoardsName: req.allBoardsName })
}))

app.delete('/boards/task/:id', catchAsync(async (req, res) => {
    const { boardName } = req.query;
    await Task.findByIdAndDelete(req.params.id);
    const filteredTasks = await Task.find({ boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message =  "Something went wrong!"} = err;
    res.status(statusCode).send(message);
})

app.listen(5000, () => {
    console.log("LISSENING ON PORT 5000");
})

