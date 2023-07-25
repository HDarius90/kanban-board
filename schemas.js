const Joi = require('joi');

module.exports = taskSchema = Joi.object({
    task: Joi.object({
        boardName: Joi.string().required(),
        text: Joi.string().required(),
        state: Joi.string().required().valid('todo', 'inprogress', 'done'),
        priority: Joi.string().required().valid('low', 'medium', 'high'),
        deadline: Joi.date().greater('now').required()
    }).required()
})