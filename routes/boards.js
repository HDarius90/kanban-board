const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateTask } = require('../middleware');
const boards = require('../controllers/boards');


router.get('/', boards.index);

router.route('/newboard')
    .get(isLoggedIn,
        catchAsync(boards.renderNewBoardForm))
    .post(isLoggedIn,
        validateTask,
        catchAsync(boards.createBoard));

router.get('/:boardID',
    catchAsync(boards.showBoard));

router.get('/:boardID/delete',
    isLoggedIn,
    isAuthor,
    catchAsync(boards.deleteBoard));

router.patch('/:boardID/save-database',
    isLoggedIn,
    catchAsync(boards.saveBoard));


router.route('/:boardID/newtask')
    .get(isLoggedIn,
        catchAsync(boards.renderNewTaskForm))
    .post(isLoggedIn,
        validateTask,
        catchAsync(boards.createTask));

module.exports = router;