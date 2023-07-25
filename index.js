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
const taskSchema = require('./schemas');
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

const validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


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
    if (filteredTasks.length === 0) throw new ExpressError('Board not found', 404);
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
}))

app.get('/boards/newtask', catchAsync(async (req, res) => {
    const { boardName } = req.query;
    res.render('tasks/new', { allBoardsName: req.allBoardsName, boardName });
}))

app.post('/boards/newtask', validateTask, catchAsync(async (req, res) => {
    const newTask = new Task(req.body.task);
    await newTask.save();
    const filteredTasks = await Task.find({ boardName: newTask.boardName })
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName: newTask.boardName })
}))

app.get('/boards/newboard', catchAsync(async (req, res) => {
    res.render('boards/new', { allBoardsName: req.allBoardsName });
}))

app.post('/boards/newboard', validateTask, catchAsync(async (req, res) => {
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

app.put('/boards/task/:id', validateTask, catchAsync(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body.task, { runValidators: true, new: true });
    res.render('tasks/show', { task, allBoardsName: req.allBoardsName })
}))

app.delete('/boards/task/:id', catchAsync(async (req, res) => {
    const { boardName } = req.query;
    await Task.findByIdAndDelete(req.params.id);
    const filteredTasks = await Task.find({ boardName })
    if (filteredTasks.length === 0) throw new ExpressError('No more tasks to show', 404);
    res.render('boards/show', { filteredTasks, allBoardsName: req.allBoardsName, boardName })
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, Something went wrong!"
    res.status(statusCode).render('error', { err, allBoardsName: req.allBoardsName });
})

app.listen(5000, () => {
    console.log("LISSENING ON PORT 5000");
})

