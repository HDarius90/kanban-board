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
const { convertISODateToYYYYMMDD } = require('./utils/utils');

const boards = require('./routes/boards');

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

// Common middleware to turn ON the saveSuccess flag in the response locals
function saveSuccessOn(req, res, next) {
    res.locals.saveSuccess = true;
    next();
}
function saveSuccessOff(req, res, next) {
    // Common middleware to turn OFF the saveSuccess flag in the response locals
    res.locals.saveSuccess = false;
    next();
}

// These middlewares will be executed for every route
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(fetchBoards);
app.use(saveSuccessOff);

// This middleware only executed if you hit the save route
app.use('/save-database/:boardID', saveSuccessOn);

// Setting up mongoDB connection with mongoose
mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use('/boards', boards)

// ROUTES
app.get('/index', (req, res) => {
    res.render('boards/index')
})

app.patch('/save-database/:boardID', catchAsync(async (req, res) => {
    const database = JSON.parse(req.body.database);
    database.forEach(async element => {
        await Task.findByIdAndUpdate(element._id, element)
    });
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('boards/show', { selectedBoard })
}));


app.get('/boards/:boardID/newtask', catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('tasks/new', { selectedBoard });
}))

app.post('/boards/:boardID/newtask', validateTask, catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    req.body.task.boardName = selectedBoard._id;
    const newTask = new Task(req.body.task);
    selectedBoard.tasks.push(newTask);
    await newTask.save();
    await selectedBoard.save();
    res.redirect(`/boards/${selectedBoard._id}`)
}))

app.get('/boards/task/:taskID/edit', catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.taskID);
    res.render('tasks/edit', { task, convertISODateToYYYYMMDD })
}))

app.put('/boards/task/:taskID', validateTask, catchAsync(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.taskID, req.body.task, { runValidators: true, new: true }).populate('boardName');
    res.redirect(`/boards/${task.boardName._id}`);
}))

app.delete('/boards/task/:taskID', catchAsync(async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskID);
    res.redirect(`/boards/${deletedTask.boardName._id}`);
}))


// Bad request route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, Something went wrong!"
    res.status(statusCode).render('error', { err });
})


app.listen(5000, () => {
    console.log("LISSENING ON PORT 5000");
})

