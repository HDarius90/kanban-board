const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Task = require('./models/task.js');
const bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
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
    res.render('index', { tasks })
})

app.get('/project/new', (req, res) =>{
    res.render('new');
})

app.post('/project', (req, res) =>{
    const newTask = req.body;
    console.log(newTask);
})


app.get('/boards', async (req, res) => {
    const tasks = await Task.find({})
    res.render('boards', { tasks })
})

app.get('/p/:reqestedProjName', async (req, res) => {
    const { reqestedProjName } = req.params;
    const tasks = await Task.find({})
    let selectedProjTasks = []
    const allProjectsName = [];

    for (let task of tasks) {   //populate selectedProjTasks array with tasks whitch has a matching projectName 
        if (!allProjectsName.includes(task.projectName)) {
            allProjectsName.push(task.projectName)
        }
        if (task.projectName.replace(/\s+/g, '').toLowerCase() === reqestedProjName) {
            selectedProjTasks.push(task)
        }
    }
    res.render('project', { selectedProjTasks, allProjectsName })
})

app.listen(3000, () => {
    console.log("LISSENING ON PORT 3000");
})

