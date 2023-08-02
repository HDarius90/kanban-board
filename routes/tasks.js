const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Task = require('../models/task');
const { convertISODateToYYYYMMDD } = require('../utils/utils')
const taskSchema = require('../schemas')

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

router.get('/edit', catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.taskID);
    res.render('tasks/edit', { task, convertISODateToYYYYMMDD })
}))

router.put('/', validateTask, catchAsync(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.taskID, req.body.task, { runValidators: true, new: true }).populate('boardName');
    res.redirect(`/boards/${task.boardName._id}`);
}))

router.delete('/', catchAsync(async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskID);
    res.redirect(`/boards/${deletedTask.boardName._id}`);
}))

module.exports = router;