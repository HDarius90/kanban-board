const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.taskSchema = Joi.object({
    task: Joi.object({
        boardName: Joi.object(),
        text: Joi.string().required().escapeHTML(),
        state: Joi.string().required().valid('todo', 'inprogress', 'done'),
        priority: Joi.string().required().valid('low', 'medium', 'high'),
        deadline: Joi.date().greater('now').required()
    }).required(),
    board: Joi.object({
        name: Joi.string().required().escapeHTML(),
        tasks: Joi.array()
    })
})