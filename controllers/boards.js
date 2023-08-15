const Task = require('../models/task');
const Board = require('../models/board');

// Controller to render the index view for boards
module.exports.index = (req, res) => {
    res.render('boards/index');
}

// Controller to render the form for creating a new board
module.exports.renderNewBoardForm = async (req, res) => {
    res.render('boards/new');
}

// Controller to handle the creation of a new board
module.exports.createBoard = async (req, res) => {
    // Create a new Board instance with the provided name and set the author
    const newBoard = new Board({ name: req.body.board.name });
    newBoard.author = req.user._id;
    
    // Create a new Task instance with the provided task data
    const newTask = new Task(req.body.task);
    newTask.boardName = newBoard;
    
    // Add the task to the board's tasks array and save both
    newBoard.tasks.push(newTask);
    await newBoard.save();
    await newTask.save();
    
    req.flash('success', 'New Board successfully created');
    res.redirect(`/boards/${newBoard._id}`);
}

// Controller to show details of a specific board
module.exports.showBoard = async (req, res) => {
    // Find the selected board by its ID, populating tasks and author
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks').populate('author');
    
    // Handle case where the board doesn't exist
    if (!selectedBoard) {
        req.flash('error', 'Cannot find board!');
        return res.redirect('/boards');
    }
    
    res.render('boards/show', { selectedBoard });
}

// Controller to delete a board
module.exports.deleteBoard = async (req, res) => {
    // Delete the board by its ID
    await Board.findByIdAndDelete(req.params.boardID);
    
    // Fetch all boards and store them in res.locals for the view
    res.locals.boards = await Board.find({});
    
    req.flash('success', 'Board was successfully deleted');
    res.redirect('/boards');
}

// Controller to save the state of tasks within a board
module.exports.saveBoard = async (req, res) => {
    // Parse the provided JSON data of task states
    const database = JSON.parse(req.body.database);
    
    // Iterate through each task element and update its state in the database
    database.forEach(async element => {
        await Task.findByIdAndUpdate(element._id, element);
    });
    
    req.flash('success', 'Successfully updated tasks state!');
    res.redirect(`/boards/${req.params.boardID}`);
}

// Controller to render the form for creating a new task
module.exports.renderNewTaskForm = async (req, res) => {
    // Find the selected board by its ID, populating tasks
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    res.render('tasks/new', { selectedBoard });
}

// Controller to create a new task within a board
module.exports.createTask = async (req, res) => {
    // Find the selected board by its ID, populating tasks
    const selectedBoard = await Board.findById(req.params.boardID).populate('tasks');
    
    // Set the boardName for the new task and create the task instance
    req.body.task.boardName = selectedBoard._id;
    const newTask = new Task(req.body.task);
    
    // Add the new task to the selected board's tasks array and save both
    selectedBoard.tasks.push(newTask);
    await newTask.save();
    await selectedBoard.save();
    
    req.flash('success', 'Task successfully created');
    res.redirect(`/boards/${selectedBoard._id}`);
}
