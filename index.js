const express = require("express");
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Task = require('./models/task');
const Board = require('./models/board');
const bodyParser = require('body-parser');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const taskSchema = require('./schemas');
const { convertISODateToYYYYMMDD } = require('./utils/utils'); // 

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Common middleware to validate task schema and throw an error
const validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Common middleware to fetch boards
const fetchBoards = catchAsync(async (req, res, next) => {
    res.locals.boards = await Board.find({});
    next();
});

// These middlewares will be executed for every route
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(fetchBoards);

mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.get('/index', (req, res) => {
    res.render('boards/index')
})

app.patch('/save-database/:boardID', catchAsync(async (req, res) => {
    const database = JSON.parse(req.body.database);


    database.forEach(async element => {
        await Task.findByIdAndUpdate(element._id, element)
    });
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('boards/show', { selectedBoard, saveSuccess: true })
}));

app.get('/boards/newboard', catchAsync(async (req, res) => {
    res.render('boards/new');
}))

app.post('/boards/newboard', validateTask, catchAsync(async (req, res) => {
    const newTask = new Task(req.body.task);
    const newBoard = new Board({ name: newTask.boardName, tasks: newTask });
    await newTask.save();
    await newBoard.save();
    res.locals.boards = await Board.find({});
    const selectedBoard = await Board.findById(newBoard._id).populate('tasks');
    res.render('boards/show', { selectedBoard, saveSuccess: false })
}))

app.get('/boards/:boardID/new', catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('tasks/new', { selectedBoard });
}))

app.post('/boards/:boardID/new', validateTask, catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    req.body.task.boardName = selectedBoard._id;
    const newTask = new Task(req.body.task);
    selectedBoard.tasks.push(newTask);
    await newTask.save();
    await selectedBoard.save();
    res.render('boards/show', { selectedBoard, saveSuccess: false })
}))

app.get('/boards/task/:taskID/edit', catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.taskID);
    res.render('tasks/edit', { task, convertISODateToYYYYMMDD })
}))

app.put('/boards/task/:taskID', validateTask, catchAsync(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.taskID, req.body.task, { runValidators: true, new: true }).populate('boardName');
    const selectedBoard = await Board.findById(task.boardName._id).populate('tasks');
    res.render('boards/show', { selectedBoard, saveSuccess: false })
}))

app.delete('/boards/task/:taskID', catchAsync(async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskID);
    const selectedBoard = await Board.findById(deletedTask.boardName).populate('tasks');
    res.render('boards/show', { selectedBoard, saveSuccess: false })
}))

app.get('/boards/:boardID', catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('boards/show', { selectedBoard, saveSuccess: false })
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

