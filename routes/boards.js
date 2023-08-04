const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Task = require('../models/task');
const Board = require('../models/board');
const taskSchema = require('../schemas');
const { isLoggedIn } = require('../middleware')


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

router.get('/', (req, res) => {
    res.render('boards/index')
})

router.get('/newboard', isLoggedIn, catchAsync(async (req, res) => {
    res.render('boards/new');
}))

router.post('/newboard', isLoggedIn, validateTask, catchAsync(async (req, res) => {
    const newBoard = new Board({ name: req.body.board.name });
    const newTask = new Task(req.body.task);
    newTask.boardName = newBoard;
    newBoard.tasks.push(newTask);
    await newBoard.save();
    await newTask.save();
    req.flash('success', 'New Board successfully created');
    res.redirect(`/boards/${newBoard._id}`)
}))

router.get('/:boardID', catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    if (!selectedBoard) {
        req.flash('error', 'Cannot find board!');
        return res.redirect('/boards');
    }
    res.render('boards/show', { selectedBoard })
}))

router.get('/:boardID/delete', isLoggedIn, catchAsync(async (req, res) => {
    await Board.findByIdAndDelete(req.params.boardID);
    res.locals.boards = await Board.find({});
    req.flash('success', 'Baord was successfully deleted');
    res.redirect('/boards')
}))

router.patch('/:boardID/save-database', isLoggedIn, catchAsync(async (req, res) => {
    const database = JSON.parse(req.body.database);
    database.forEach(async element => {
        await Task.findByIdAndUpdate(element._id, element)
    });
    req.flash('success', 'Successfully updated tasks state!');
    res.redirect(`/boards/${req.params.boardID}`)
}));


router.get('/:boardID/newtask', isLoggedIn, catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('tasks/new', { selectedBoard });
}))

router.post('/:boardID/newtask', isLoggedIn, validateTask, catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    req.body.task.boardName = selectedBoard._id;
    const newTask = new Task(req.body.task);
    selectedBoard.tasks.push(newTask);
    await newTask.save();
    await selectedBoard.save();
    req.flash('success', 'Task successfully created');
    res.redirect(`/boards/${selectedBoard._id}`)
}))

module.exports = router;