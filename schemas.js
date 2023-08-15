// Import required modules
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Define an extension for Joi to sanitize HTML content
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                // Sanitize the HTML content using sanitize-html library
                const clean = sanitizeHtml(value, {
                    allowedTags: [], // Disallow all HTML tags
                    allowedAttributes: {}, // Disallow all HTML attributes
                });
                // If the cleaned content differs from the original value, raise an error
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean; // Return the sanitized content
            }
        }
    }
});

// Extend the BaseJoi with the custom HTML escaping extension
const Joi = BaseJoi.extend(extension)

// Define the task schema using the extended Joi
module.exports.taskSchema = Joi.object({
    task: Joi.object({
        boardName: Joi.object(), // Schema for board name (not specified)
        text: Joi.string().required().escapeHTML(), // Task text, required and sanitized
        state: Joi.string().required().valid('todo', 'inprogress', 'done'), // Task state, required and must be valid
        priority: Joi.string().required().valid('low', 'medium', 'high'), // Task priority, required and must be valid
        deadline: Joi.date().greater('now').required() // Task deadline, required and must be in the future
    }).required(),
    board: Joi.object({
        name: Joi.string().required().escapeHTML(), // Board name, required and sanitized
        tasks: Joi.array() // Array of tasks (not specified)
    })
})