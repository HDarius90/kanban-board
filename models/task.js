const mongoose = require('mongoose');
const getDate = require("../getDate.js");

const taskSchema = new mongoose.Schema({
    projectName: {
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
        min: new Date()
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task