const draggables = document.querySelectorAll('[draggable=true]')
const columns = document.querySelectorAll('.col')
const btnLeft = document.querySelector('.btn-left')
const btnRight = document.querySelector('.btn-right')
const btnDelete = document.querySelector('.btn-delete')
const btnOpenForm = document.querySelector('.open-button')
const btnCancelForm = document.querySelector('button.cancel')
const btnAddForm = document.querySelector('button.add')

import { addEventListeners } from "./events.js"

class Task {
    constructor(text, state) {
        this.text = text;
        this.state = state;
    }
}


//Apply the event listeners to all draggable elements
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

function getCurrentColIndex(selectedCard) {
    for (let i = 0; i < 3; i++) {
        if (selectedCard.parentElement === selectedCard.parentElement.parentElement.children[i]) {
            return i;
        }
    }
}

btnLeft.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    switch (getCurrentColIndex(selectedCard)) {
        case 1:
            columns[0].appendChild(selectedCard)
            break;
        case 2:
            columns[1].appendChild(selectedCard)
            break;
    }
})

btnRight.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    switch (getCurrentColIndex(selectedCard)) {
        case 0:
            columns[1].appendChild(selectedCard)
            break;
        case 1:
            columns[2].appendChild(selectedCard)
            break;
    }
})

btnDelete.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    selectedCard.remove();
})

function validateForm() {
    let taskText = document.forms["newTaskForm"]["taskText"].value;
    if (taskText == "") {
        alert("Text must be filled out");
        return false;
    }
    return true;
}

btnOpenForm.addEventListener('click', () => {
    document.getElementById("myForm").style.display = "block";
})

btnCancelForm.addEventListener('click', () => {
    document.getElementById("myForm").style.display = "none";

})

function addCard(task, element) {
    if (element.children.length < 7) {
        element.
            appendChild(
                Object.assign(
                    document.createElement('div'),
                    { className: 'card', draggable: true }
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

btnAddForm.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {
        let taskText = document.forms["newTaskForm"]["taskText"].value;
        document.forms["newTaskForm"]["taskText"].value = '';
        let taskState = document.forms["newTaskForm"]["state"].value;
        document.forms["newTaskForm"]["state"].value = 'todo'
        let newTask = new Task(taskText, taskState);
        console.log(newTask);
        switch (newTask.state) {
            case 'todo':
                addCard(newTask, columns[0]);
                break;
            case 'inprogress':
                addCard(newTask, columns[1]);
                break;
            case 'done':
                addCard(newTask, columns[2]);
                break;
        }
        document.getElementById("myForm").style.display = "none";
    }
})

