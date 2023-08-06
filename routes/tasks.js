const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateTask } = require('../middleware');
const tasks = require('../controllers/tasks');

router.get('/edit', isLoggedIn, catchAsync(tasks.renderEditTaskForm));

router.put('/', isLoggedIn, validateTask, catchAsync(tasks.editTask))

router.delete('/', isLoggedIn, catchAsync(tasks.deleteTask))

module.exports = router;