const User = require('../models/user');

// Controller to render the registration form
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

// Controller to handle user registration
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        
        // Register the user with the provided email, username, and password
        const registeredUser = await User.register(user, password);
        
        // Log in the registered user and display a success flash message
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Kanban Board!');
            res.redirect('/boards');
        });
    } catch (e) {
        // If there's an error during registration, display an error flash message and redirect back to the registration form
        req.flash('error', e.message);
        res.redirect('register');
    }
}

// Controller to render the login form
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

// Controller to handle user login
module.exports.login = (req, res) => {
    // Display a success flash message upon successful login
    req.flash('success', 'Welcome back!');
    
    // Determine the redirect URL after login, considering the returnTo URL stored in res.locals
    const redirectUrl = res.locals.returnTo || '/boards';
    res.redirect(redirectUrl);
}

// Controller to handle user logout
module.exports.logout = (req, res, next) => {
    // Log the user out and display a success flash message
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/boards');
    });
}
