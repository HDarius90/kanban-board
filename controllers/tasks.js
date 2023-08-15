const Task = require('../models/task');
const { convertISODateToYYYYMMDD } = require('../utils/utils');

// Controller to render the form for editing a task
module.exports.renderEditTaskForm = async (req, res) => {
    // Find the task to edit by its ID
    const task = await Task.findById(req.params.taskID);
    
    // Render the edit form with the task details and the date conversion function
    res.render('tasks/edit', { task, convertISODateToYYYYMMDD });
}

// Controller to handle the editing of a task
module.exports.editTask = async (req, res) => {
    // Find and update the task by its ID, running validators and fetching the updated task
    const task = await Task.findByIdAndUpdate(req.params.taskID, req.body.task, { runValidators: true, new: true }).populate('boardName');
    
    req.flash('success', 'Task successfully updated');
    res.redirect(`/boards/${task.boardName._id}`);
}

// Controller to delete a task
module.exports.deleteTask = async (req, res) => {
    // Find and delete the task by its ID
    const deletedTask = await Task.findByIdAndDelete(req.params.taskID);
    
    req.flash('success', 'Task successfully deleted');
    res.redirect(`/boards/${deletedTask.boardName._id}`);
}
