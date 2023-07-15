const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Task = require('./models/task.js');

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

mongoose.connect('mongodb://127.0.0.1:27017/kanbanboard')
    .then(() => {
        console.log("MONGOOSE CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("OH NO MONGOOOSE ERROR")
        console.log(err);
    })


app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({})
    res.render('projects/index', { tasks })
})
app.get('/boards', async (req, res) => {
    const tasks = await Task.find({})
    res.render('projects/boards', { tasks })
})

app.get('/boards/:projName/:taskID', (req, res) => {
    const { projName, taskID } = req.params;
    res.send(`<h1>This is the ${projName} board and ${taskID}</h1>`)
})

app.listen(3000, () => {
    console.log("LISSENING ON PORT 3000");
})