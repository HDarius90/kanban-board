const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    boardName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        default: "todo",
        enum: ["todo", "inprogress", "done"]
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    deadline: {
        type: Date,
        required: true,
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