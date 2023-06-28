const columns = document.querySelectorAll('.col')
const btnLeft = document.querySelector('.btn-left')
const btnRight = document.querySelector('.btn-right')
const btnDelete = document.querySelector('.btn-delete')
const btnSave = document.querySelector('.btn-save')
const btnOpenForm = document.querySelector('.open-button')
const btnCancelForm = document.querySelector('button.cancel')
const btnAddForm = document.querySelector('button.add')
const tabButtons = document.querySelectorAll('button.tablinks')
let tabcontent = document.querySelectorAll('.tabcontent');
let allTabs = document.querySelectorAll('.tablinks');
let addProject = document.querySelector('#add-content');



import { addEventListeners } from "./cardevents.js"
import { getDragAfterElement, getIndexOfActiveTab, getRandomID, validateForm, addCard, appendTaskToDom, openProject, AddNewProjectTab, AddNewTabContent } from "./functions.js"


class Task {
    constructor(text, state, priority = 'low', deadline = '2023-12-01') {
        this.text = text;
        this.state = state;
        this.id = getRandomID();
        this.priority = priority;
        this.deadline = deadline
    }
}

//try to parse allProject from local storage and if it does not exist then create in it as many empty arrays as many project tabs we have
let allProjects = JSON.parse(localStorage.getItem('allProjects'));
if (!allProjects) {
    allProjects = [];
    for (let i = 0; i < tabcontent.length; i++) {
        allProjects.push([]);
    }
}

//append all Task from allProjects to the DOM 
for (let i = 0; i < allProjects.length; i++) {
    let columnsToAppend = tabcontent[i].querySelectorAll('.col');
    allProjects[i].forEach((task) => {
        appendTaskToDom(task, addCard, columnsToAppend)
    })
}

const draggables = document.querySelectorAll('[draggable=true]')


//Apply all the event listeners to all draggable elements
draggables.forEach(card => {
    addEventListeners(card, allProjects)
})


//adding eventlisteners for the tab buttons, to open project tabs
tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (event) => {
        openProject(event, tabButton.value)
    })
})

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


//creating new project when clicking to the add button on tab
addProject.addEventListener('click', ()=> {
    let newProjectName =  prompt('Name of the project:');
    let newTab = AddNewProjectTab(newProjectName);
    AddNewTabContent(newProjectName);
    newTab.addEventListener('click', (event) => {
        openProject(event, newTab.value)
    })
    newTab.click();
})




//add dragover event for hovering elements around
columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(column, e.clientY)
        const draggable = document.querySelector('.dragging') //set the current draggable element then append it to the current container
        if (afterElement == null) {                         // set conditions and check the AfterElements, 
            column.appendChild(draggable)                      //and if it is set to null, append a child at the end of the list.
        }
        else {
            column.insertBefore(draggable, afterElement)     // Else, add the element draggable and afterElement as parameters in the insertBefore function.
        }
    })
})

//Mooving cards in the columns to the left and updating the task.state in project1Tasks variable
btnLeft.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = allProjects[getIndexOfActiveTab(allTabs)].find(task => task.id === selectedCard.id);
    let activeColumns = document.querySelector('*[style="display: block;"]').querySelectorAll('.col');

    switch (focusedTask.state) {
        case 'inprogress':
            activeColumns[0].appendChild(selectedCard)
            focusedTask.state = 'todo';
            break;
        case 'done':
            activeColumns[1].appendChild(selectedCard)
            focusedTask.state = 'inprogress';
            break;
    }
})

//Mooving cards in the columns to the right and updating the task.state in project1Tasks variable
btnRight.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = allProjects[getIndexOfActiveTab(allTabs)].find(task => task.id === selectedCard.id);
    let activeColumns = document.querySelector('*[style="display: block;"]').querySelectorAll('.col');

    switch (focusedTask.state) {
        case 'todo':
            activeColumns[1].appendChild(selectedCard)
            focusedTask.state = 'inprogress';
            break;
        case 'inprogress':
            activeColumns[2].appendChild(selectedCard)
            focusedTask.state = 'done';
            break;
    }
})

//removing selected card from DOM and from project1Tasks variable
btnDelete.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let allTabs = document.querySelectorAll('.tablinks');
    for (let i = 0; i < allTabs.length; i++) {
        if (allTabs[i].classList.contains('active')) {
            allProjects[i] = allProjects[i].filter(task => task.id !== selectedCard.id);
            console.log(allProjects[i]);
        }

    }
    selectedCard.remove();
})

//Saving allProjects to localStorage and showing success alert then hide it
btnSave.addEventListener('click', () => {
    localStorage.setItem('allProjects', JSON.stringify(allProjects));
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

//if form valid then creates new Task object from input fields value, push it on the vurrentTasks array, and append it to the DOM then hide the form
btnAddForm.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {
        let taskText = document.forms["newTaskForm"]["taskText"].value;
        document.forms["newTaskForm"]["taskText"].value = '';
        let taskState = document.forms["newTaskForm"]["state"].value;
        document.forms["newTaskForm"]["state"].value = 'todo';
        let taskPrio = document.forms["newTaskForm"]["priority"].value;
        document.forms["newTaskForm"]["priority"].value = 'low';
        let taskDeadline = document.forms["newTaskForm"]["deadline"].value;
        document.forms["newTaskForm"]["deadline"].value = '2023-07-22';
        let newTask = new Task(taskText, taskState, taskPrio, taskDeadline);
        allProjects[getIndexOfActiveTab(allTabs)].push(newTask);
        appendTaskToDom(newTask, addCard);
        document.getElementById("myForm").style.display = "none";
    }
})