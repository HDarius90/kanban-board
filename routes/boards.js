const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Task = require('../models/task');
const Board = require('../models/board');
const { isLoggedIn, isAuthor, validateTask } = require('../middleware')
const boards = require('../controllers/boards')


router.get('/', boards.index);

router.get('/newboard', isLoggedIn, catchAsync(boards.renderNewBoardForm));

router.post('/newboard', isLoggedIn, validateTask, catchAsync(boards.createBoard));

router.get('/:boardID', catchAsync(boards.showBoard));

router.get('/:boardID/delete', isLoggedIn, isAuthor, catchAsync(boards.deleteBoard));

router.patch('/:boardID/save-database', isLoggedIn, catchAsync(boards.saveBoard));

router.get('/:boardID/newtask', isLoggedIn, catchAsync(boards.renderNewTaskForm));

router.post('/:boardID/newtask', isLoggedIn, validateTask, catchAsync(boards.createTask));

module.exports = router;