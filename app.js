const btnLeft = document.querySelector('.btn-left')
const btnRight = document.querySelector('.btn-right')
const btnDelete = document.querySelector('.btn-delete')
const btnSave = document.querySelector('.btn-save')
const btnOpenForm = document.querySelector('.open-button')
const btnCancelForm = document.querySelector('button.cancel')
const btnAddForm = document.querySelector('button.add')
let allTabs = document.querySelectorAll('.tablinks');
let addProject = document.querySelector('#add-content');



import {
    dragOver, mooveCardToNewStateWithButton, getActiveTab, getRandomID, validateForm, addCard, appendTaskToDom, isHidden,
    openProject, AddNewProjectTab, AddNewTabContent, getDate
} from "./functions.js"


class Task {
    constructor(projectName, text, state, priority = 'low', deadline) {
        this.projectName = projectName;
        this.text = text;
        this.state = state;
        this.id = getRandomID();
        this.priority = priority;
        this.deadline = deadline
    }
}

//try to parse allProject from local storage and if it does not exist then create empty array
let allTasks = JSON.parse(localStorage.getItem('allTasks') || "[]");

//Rendering the projectTabs and TabContents from allTasks variable
let allProjectNames = [];

allTasks.forEach((task) => {
    if (!allProjectNames.includes(task.projectName)) {
        AddNewProjectTab(task.projectName);
        AddNewTabContent(task.projectName);
        allProjectNames.push(task.projectName);    //preventing rendering project more then once
    }
    appendTaskToDom(task, addCard, allTasks)
})


//adding eventlisteners for the tab buttons, to open project tabs
const tabButtons = document.querySelectorAll('button.tablinks')
tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (event) => {
        openProject(event, tabButton.value)
    })
})
if (tabButtons.length > 0) {
    tabButtons[0].click();  //Open the firs Tab as default if it is exist
}

//creating new project when clicking to the add button on tab
addProject.addEventListener('click', () => {
    let newProjectName = prompt('Name of the project:').trim()    //keeps asking projectname till user fill the input field
    while (newProjectName === '') {
        newProjectName = prompt('Name of the project:').trim() //comment new
    }
    console.log(allProjectNames);
    if (newProjectName && !allProjectNames.includes(newProjectName)) {  //prevent creating empty or existing project name
        allProjectNames.push(newProjectName);
        let newTab = AddNewProjectTab(newProjectName);          //creates new projectTab and tabcontent
        let newTabContent = AddNewTabContent(newProjectName);
        newTabContent.lastChild.lastChild.childNodes.forEach(column => {
            dragOver(column);                                   //gives dragover event to the newly appended columns
        })
        newTab.addEventListener('click', (event) => {
            openProject(event, newTab.value)                //gives openProject event to the newly appended tab
        })
        newTab.click();
    }
})

//add dragover event for hovering elements around
const columns = document.querySelectorAll('.col')
columns.forEach(column => {
    dragOver(column);
})

//Mooving cards in the columns to the left and updating the task.state
btnLeft.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = allTasks.find(task => task.id === selectedCard.id);
    switch (focusedTask.state) {
        case 'inprogress':
            focusedTask.state = 'todo';
            mooveCardToNewStateWithButton(focusedTask, selectedCard)
            break;
        case 'done':
            focusedTask.state = 'inprogress';
            mooveCardToNewStateWithButton(focusedTask, selectedCard)
            break;
    }
})

//Mooving cards in the columns to the right and updating the task.state
btnRight.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = allTasks.find(task => task.id === selectedCard.id);
    switch (focusedTask.state) {
        case 'todo':
            focusedTask.state = 'inprogress';
            mooveCardToNewStateWithButton(focusedTask, selectedCard)
            break;
        case 'inprogress':
            focusedTask.state = 'done';
            mooveCardToNewStateWithButton(focusedTask, selectedCard)
            break;
    }
})

//removing selected card from DOM and from allTasks variable
btnDelete.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus');
    if (!isHidden(selectedCard)) {                          //preventing removing a focused element from a hiden tab
        allTasks = allTasks.filter(task => task.id !== selectedCard.id);
        selectedCard.remove();
    }
})

//Saving allTasks to localStorage and showing success alert then hide it
btnSave.addEventListener('click', () => {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    document.getElementById("alert").classList.add('d-flex');
    setTimeout(() => {
        document.getElementById("alert").classList.remove('d-flex');
    }, 3000)
})

//Show form
btnOpenForm.addEventListener('click', () => {
    document.getElementById("myForm").style.display = "block";
})

//Hide Form
btnCancelForm.addEventListener('click', () => {
    document.getElementById("myForm").style.display = "none";

})

//set current date for deadline inputfields minimum, and set the task creating forms deafult deadline 60days
let deadlineInput = document.querySelector('#deadline');
deadlineInput.setAttribute("min", getDate());
deadlineInput.setAttribute("value", getDate(60));


//if form valid then creates new Task object from input fields value, push it on the vurrentTasks array, and append it to the DOM then hide the form
btnAddForm.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {

        //get values from form
        let taskText = document.forms["newTaskForm"]["taskText"].value;
        document.forms["newTaskForm"]["taskText"].value = '';
        let taskState = document.forms["newTaskForm"]["state"].value;
        document.forms["newTaskForm"]["state"].value = 'todo';
        let taskPrio = document.forms["newTaskForm"]["priority"].value;
        document.forms["newTaskForm"]["priority"].value = 'low';
        let taskDeadline = document.forms["newTaskForm"]["deadline"].value;
        document.forms["newTaskForm"]["deadline"].value = getDate();

        //refress the allTabs variable and save the projectname of the newTask
        allTabs = document.querySelectorAll('.tablinks');
        let activeTask = getActiveTab(allTabs);
        let taskProjectName = activeTask.textContent;

        //create newTask and save it to the allTasks variable
        let newTask = new Task(taskProjectName, taskText, taskState, taskPrio, taskDeadline);
        allTasks.push(newTask);
        appendTaskToDom(newTask, addCard);                          //append the newTask as an element to the DOM
        document.getElementById("myForm").style.display = "none";   //hide the form
    }
})
