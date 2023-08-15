// Import necessary modules and utilities
const { taskSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Board = require('./models/board');

// Middleware to check if a user is authenticated, redirecting to login if not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}
// Middleware to store the returnTo URL in local variables if it exists in the session
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Middleware to check if the authenticated user is the author of a board
module.exports.isAuthor = async (req, res, next) => {
    const { boardID } = req.params;
    const board = await Board.findById(boardID);
    if (!board.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/boards/${boardID}`)
    }
    next();
}


// Middleware to validate task data against the task schema and throw an error if invalid
module.exports.validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}