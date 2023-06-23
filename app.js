const draggables = document.querySelectorAll('[draggable=true]')
const columns = document.querySelectorAll('.col')
const btnLeft = document.querySelector('.btn-left')
const btnRight = document.querySelector('.btn-right')
const btnDelete = document.querySelector('.btn-delete')
const btnSave = document.querySelector('.btn-save')
const btnOpenForm = document.querySelector('.open-button')
const btnCancelForm = document.querySelector('button.cancel')
const btnAddForm = document.querySelector('button.add')


import { addEventListeners } from "./events.js"


class Task {
    constructor(text, state, id) {
        this.text = text;
        this.state = state;
        this.id = id;
    }
}

let taskIDCount = 3;

//curentTask holdes all the task objects
let currentTasks = [];
if (localStorage.getItem('currentTasks')){
    currentTasks = JSON.parse(localStorage.getItem('currentTasks'));
    console.log(currentTasks);
} else {
    let testTask1 = new Task("This is just text within a card body", "todo", "task-#1");
    let testTask2 = new Task("This is some text within a card body", "inprogress", "task-#2");
    let testTask3 = new Task("This is some more text within a card body", "done", "task-#3");
    currentTasks.push(testTask1, testTask2, testTask3);
}


//append testTasks to the DOM
currentTasks.forEach(task => {
    appendTaskToDom(task)
})

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



//Mooving cards in the columns to the left and updating the task.state in currentTasks variable
btnLeft.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = currentTasks.find(task => task.id === selectedCard.id);
    switch (focusedTask.state) {
        case 'inprogress':
            columns[0].appendChild(selectedCard)
            focusedTask.state = 'todo';
            break;
        case 'done':
            columns[1].appendChild(selectedCard)
            focusedTask.state = 'inprogress';
            break;
    }
})

//Mooving cards in the columns to the right and updating the task.state in currentTasks variable
btnRight.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = currentTasks.find(task => task.id === selectedCard.id);
    switch (focusedTask.state) {
        case 'todo':
            columns[1].appendChild(selectedCard)
            focusedTask.state = 'inprogress';
            break;
        case 'inprogress':
            columns[2].appendChild(selectedCard)
            focusedTask.state = 'done';
            break;
    }
})

//removing selected card from DOM and from currentTasks variable
btnDelete.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    currentTasks = currentTasks.filter(task => task.id !== selectedCard.id);
    selectedCard.remove();
    console.log(currentTasks);
})

//Saving currentTasks to file
btnSave.addEventListener('click', () => {
    localStorage.setItem('currentTasks', JSON.stringify(currentTasks));
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
    if (element.children.length < 7) {
        element.
            appendChild(
                Object.assign(
                    document.createElement('div'),
                    { className: 'card', draggable: true, id: task.id }
                )
            ).appendChild(
                Object.assign(
                    document.createElement('div'),
                    { className: 'card-body' }
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

function appendTaskToDom(task) {
    switch (task.state) {
        case 'todo':
            addCard(task, columns[0]);
            break;
        case 'inprogress':
            addCard(task, columns[1]);
            break;
        case 'done':
            addCard(task, columns[2]);
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
        taskIDCount++;
        let newTaskID = 'task-#' + taskIDCount;
        let newTask = new Task(taskText, taskState, newTaskID);
        currentTasks.push(newTask);
        appendTaskToDom(newTask);
        document.getElementById("myForm").style.display = "none";
    }
})


