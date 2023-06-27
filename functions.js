import {addEventListeners} from "./events.js"

// Call a reduce function which will loop through the list of draggable elements and also specify the single element after the mouse cursor.
// Return the reduce function by adding the first element as closest and the second as a child. Also, equate the offset and add conditions.
export function getDragAfterElement(column, y) {
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

//check which tab has active class and return the index number of it
export function getIndexOfActiveTab(allTabs) {
    for (let i = 0; i < allTabs.length; i++) {
        if (allTabs[i].classList.contains('active')) {
            return i;
        }
    }
}

//generate random task ID between 1 and 1000 and convert it to string
export function getRandomID() {
    return Math.floor(Math.random() * 1000 + 1).toString();
  }

//Check if user filled out text input field and return boolean
export function validateForm() {
    let taskText = document.forms["newTaskForm"]["taskText"].value;
    if (taskText == "") {
        alert("Text must be filled out");
        return false;
    }
    return true;
}

//makes a Card element from task object and append it to an element if the element has less then 7 children, and add eventlisteners
export function addCard(task, element) {

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
export function appendTaskToDom(task, addCard, activeColumns) {
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

export function openProject(evt, projectName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(projectName).style.display = "block";
    evt.currentTarget.className += " active";
  }