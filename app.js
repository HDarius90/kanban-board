const draggables = document.querySelectorAll('.draggable')
const columns = document.querySelectorAll('.col')
const btnLeft = document.querySelector('.btn-left')
const btnRight = document.querySelector('.btn-right')
const btnDelete = document.querySelector('.btn-delete')
const btnNew = document.querySelector('.btn-new')
const btnOpenForm = document.querySelector('.open-button')
const btnCancelForm = document.querySelector('button.cancel')
const btnAddForm = document.querySelector('button.add')

class Task {
    constructor(text, state) {
        this.text = text;
        this.state = state;
    }
}


draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
    draggable.addEventListener('click', () => {
        let prevFocus = document.querySelector('.focus')
        draggable.classList.toggle('focus')
        if (prevFocus !== draggable) prevFocus.classList.remove('focus');
        console.log(prevFocus);
    })
})

// … 
columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(column, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            column.appendChild(draggable)
        }
        else {
            column.insertBefore(draggable, afterElement)
        }
    })
})

// …
function getDragAfterElement(column, y) {
    const draggableElements = [...column.querySelectorAll('.draggable:not(.dragging)')]

    // …
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


// … 
columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(column, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            column.appendChild(draggable)
        }
        else {
            column.insertBefore(draggable, afterElement)
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

function addCard(Task, element) {
    element.
        appendChild(
            Object.assign(
                document.createElement('div'),
                { className: 'card draggable' }
            )
        ).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: 'card-body' }
            )
        ).appendChild(
            Object.assign(
                document.createElement('span'),
                { innerText: Task.text }
            )
        )
}

btnAddForm.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {
        let taskText = document.forms["newTaskForm"]["taskText"].value;
        let taskState = document.forms["newTaskForm"]["state"].value;
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
    }

})




