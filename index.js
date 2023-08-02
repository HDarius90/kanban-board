const express = require("express");
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Board = require('./models/board');

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const boards = require('./routes/boards'); 
const tasks = require('./routes/tasks'); 

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Setup express-session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))




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
app.use('/boards/:boardID/save-database', saveSuccessOn);

// Setting up mongoDB connection with mongoose
mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.use('/boards', boards)
app.use('/tasks/:taskID', tasks)


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

