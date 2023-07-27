const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    boardName: {
        type: String,
        required: [true, "Board name is required"]
    },
    text: {
        type: String,
        required: true,
        trim: [true, "Task must have text"]
    },
    state: {
        type: String,
        required: [true, "Task must have state"],
        default: "todo",
        enum: ["todo", "inprogress", "done"]
    },
    priority: {
        type: String,
        required: [true, "Task must have priority"],
        enum: ["low", "medium", "high"],
        default: "low"
    },
    deadline: {
        type: Date,
        required: [true, "Task must have deadline"],
        validate: {
            validator: function (value) {
                // `value` is the value of the `deadline` property

                // Check if the deadline is a valid Date and not in the past
                return value instanceof Date && value >= new Date();
            },
            message: 'Deadline must be a valid date and cannot be in the past.',
        },
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task