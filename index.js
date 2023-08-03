const express = require("express");
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash  =  require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');


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


//Setting up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting flash msg in local variable so it can be accessible on templates
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// Middleware to fetch boards
const fetchBoards = catchAsync(async (req, res, next) => {
    res.locals.boards = await Board.find({});
    next();
});


// These middlewares will be executed for every route
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(fetchBoards);


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

