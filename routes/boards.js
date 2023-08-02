const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Task = require('../models/task');
const Board = require('../models/board');

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

router.get('/newboard', catchAsync(async (req, res) => {
    res.render('boards/new');
}))

router.post('/newboard', validateTask, catchAsync(async (req, res) => {
    const newBoard = new Board({ name: req.body.board.name });
    const newTask = new Task(req.body.task);
    newTask.boardName = newBoard;
    newBoard.tasks.push(newTask);
    await newBoard.save();
    await newTask.save();
    res.redirect(`/boards/${newBoard._id}`)
}))

router.get('/:boardID/delete', catchAsync(async (req, res) => {
    await Board.findByIdAndDelete(req.params.boardID);
    res.locals.boards = await Board.find({});
    res.render('boards/index')
}))

router.get('/:boardID', catchAsync(async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('boards/show', { selectedBoard })
}))

module.exports = router;