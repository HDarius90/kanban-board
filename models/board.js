const mongoose = require('mongoose');
const Task = require('./task');
const { Schema } = mongoose;

const boardSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Board must have a name!']
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// DELETE ALL ASSOCIATED TASKS AFTER A BOARD IS DELETED
boardSchema.post('findOneAndDelete', async function (board) {
    if (board.tasks.length) {
        await Task.deleteMany({
            _id: {
                $in: board.tasks
            }
        })
    }
})

const Board = mongoose.model('Board', boardSchema);



module.exports = Board;