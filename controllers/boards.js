const Task = require('../models/task');
const Board = require('../models/board');

module.exports.index = (req, res) => {
    res.render('boards/index')
}

module.exports.renderNewBoardForm = async (req, res) => {
    res.render('boards/new');
}

module.exports.createBoard = async (req, res) => {
    const newBoard = new Board({ name: req.body.board.name });
    newBoard.author = req.user._id;
    const newTask = new Task(req.body.task);
    newTask.boardName = newBoard;
    newBoard.tasks.push(newTask);
    await newBoard.save();
    await newTask.save();
    req.flash('success', 'New Board successfully created');
    res.redirect(`/boards/${newBoard._id}`)
}

module.exports.showBoard = async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks').populate('author');
    if (!selectedBoard) {
        req.flash('error', 'Cannot find board!');
        return res.redirect('/boards');
    }
    res.render('boards/show', { selectedBoard })
}

module.exports.deleteBoard = async (req, res) => {
    await Board.findByIdAndDelete(req.params.boardID);
    res.locals.boards = await Board.find({});
    req.flash('success', 'Baord was successfully deleted');
    res.redirect('/boards')
}

module.exports.saveBoard = async (req, res) => {
    const database = JSON.parse(req.body.database);
    database.forEach(async element => {
        await Task.findByIdAndUpdate(element._id, element)
    });
    req.flash('success', 'Successfully updated tasks state!');
    res.redirect(`/boards/${req.params.boardID}`)
}


module.exports.renderNewTaskForm = async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('tasks/new', { selectedBoard });
}

module.exports.createTask = async (req, res) => {
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    req.body.task.boardName = selectedBoard._id;
    const newTask = new Task(req.body.task);
    selectedBoard.tasks.push(newTask);
    await newTask.save();
    await selectedBoard.save();
    req.flash('success', 'Task successfully created');
    res.redirect(`/boards/${selectedBoard._id}`)
}
