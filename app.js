const draggables = document.querySelectorAll('[draggable=true]')
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



import { addEventListeners } from "./events.js"
import { openProject } from "./tabs.js"


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
        appendTaskToDom(task, columnsToAppend)
    })
}

//adding eventlisteners for the tab buttons, to open project tabs
tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (event) => {
        openProject(event, tabButton.value)
    })
})

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


class Task {
    constructor(text, state,  priority = 'low', deadline = '2023-12-01') {
        this.text = text;
        this.state = state;
        this.id = getRandomID();
        this.priority = priority;
        this.deadline = deadline
    }
}


//Apply all the event listeners to all draggable elements
draggables.forEach(draggable => {
    addEventListeners(draggable)
})

// Call a reduce function which will loop through the list of draggable elements and also specify the single element after the mouse cursor.
// Return the reduce function by adding the first element as closest and the second as a child. Also, equate the offset and add conditions.
function getDragAfterElement(column, y) {
    const draggableElements = [...column.querySelectorAll('[draggable=true]:not(.dragging)')]


    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        }
        else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

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

//check which tab has active class and return the index number of it
function getIndexOfActiveTab(allTabs) {
    for (let i = 0; i < allTabs.length; i++) {
        if (allTabs[i].classList.contains('active')) {
            return i;
        }
    }
}

function getRandomID() {
    return Math.floor(Math.random() * 1000 + 1);
  }

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

//Check if user filled out text input field and return boolean
function validateForm() {
    let taskText = document.forms["newTaskForm"]["taskText"].value;
    if (taskText == "") {
        alert("Text must be filled out");
        return false;
    }
    return true;
}

//Show form
btnOpenForm.addEventListener('click', () => {
    document.getElementById("myForm").style.display = "block";
})

//Hide Form
btnCancelForm.addEventListener('click', () => {
    document.getElementById("myForm").style.display = "none";

})

//makes a Card element from task object and append it to an element if the element has less then 7 children, and add eventlisteners
function addCard(task, element) {

    //determ priority css class
    let cardBodyClassList = '';
    switch (task.priority) {
        case 'low':
            cardBodyClassList = 'card-body low-prior';
            break;
        case 'medium':
            cardBodyClassList = 'card-body medium-prior'
            break;
        case 'high':
            cardBodyClassList = 'card-body high-prior'
            break;
    }

    if (element.children.length < 7) {
        element.
            appendChild(
                Object.assign(
                    document.createElement('div'),
                    { className: 'card', draggable: true, id: task.id, title: task.deadline }
                )
            ).appendChild(
                Object.assign(
                    document.createElement('div'),
                    { className: cardBodyClassList }
                )
            ).appendChild(
                Object.assign(
                    document.createElement('span'),
                    { innerText: task.text }
                )
            )

        addEventListeners(element.lastChild);
    }
}

//determing which project is active and append task to the matching column by task-state
function appendTaskToDom(task, activeColumns) {
    if (activeColumns === undefined) {
        activeColumns = document.querySelector('*[style="display: block;"]').querySelectorAll('.col');
    }
    switch (task.state) {
        case 'todo':
            addCard(task, activeColumns[0]);
            break;
        case 'inprogress':
            addCard(task, activeColumns[1]);
            break;
        case 'done':
            addCard(task, activeColumns[2]);
            break;
    }
}

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
        appendTaskToDom(newTask);
        document.getElementById("myForm").style.display = "none";
    }
})


