const Task = require('../models/task');
const { convertISODateToYYYYMMDD } = require('../utils/utils')


module.exports.renderEditTaskForm = async (req, res) => {
    const task = await Task.findById(req.params.taskID);
    res.render('tasks/edit', { task, convertISODateToYYYYMMDD })
}

module.exports.editTask = async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.taskID, req.body.task, { runValidators: true, new: true }).populate('boardName');
    req.flash('success', 'Task successfully updated');
    res.redirect(`/boards/${task.boardName._id}`);
}

module.exports.deleteTask = async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskID);
    req.flash('success', 'Task successfully deleted');
    res.redirect(`/boards/${deletedTask.boardName._id}`);
}