import { addEventListeners } from "../../cardevents.js"

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

//check which tab has active class and return the button element
export function getActiveTab(allTabs) {
    for (let i = 0; i < allTabs.length; i++) {
        if (allTabs[i].classList.contains('active')) {
            return allTabs[i];
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
export function addCard(task, element, allTasks) {

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

        addEventListeners(element.lastChild, allTasks);
    }
}

export function appendTaskToDom(task, addCard, allTasks) {
    let allColumns = document.querySelectorAll('.col');
    let projectsColumns = [];
    allColumns.forEach((col) => {
        if (col.id.includes(task.projectName)) {              //collects all the columns that has an id whitch contains the tasks projectname
            projectsColumns.push(col);
        }
    })

    projectsColumns.forEach((col) => {                        //append task to the selected columns if task.state is included on columns.id
        if (col.id.includes(task.state)) {
            addCard(task, col, allTasks);
        }
    })
}

export function mooveCardToNewStateWithButton(task, selectedCard) {
    let allColumns = document.querySelectorAll('.col');
    allColumns.forEach((col) => {
        if (col.id.includes(task.projectName) && col.id.includes(task.state)) {
            col.appendChild(selectedCard);
        }
    })

}

// Where el is the DOM element you'd like to test for visibility
export function isHidden(el) {
    return (el.offsetParent === null)
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

//creates a new tablink element from projectName, append it to the DOM and return it
export function AddNewProjectTab(projectName) {
    const tabs = document.querySelector('.projects');
    const newTab = document.createElement('button');
    newTab.className = 'tablinks';
    newTab.value = projectName + '-content'
    newTab.textContent = projectName;

    tabs.appendChild(newTab);
    return newTab;
}

export function AddNewTabContent(projectName) {
    let tabContentHolder = document.querySelector('.tabcontent-holder')
    tabContentHolder.
        appendChild(
            Object.assign(
                document.createElement('div'),
                { id: projectName + '-content', className: "tabcontent" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "container text-center" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "row" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "col container", id: projectName + "todo" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "col-title-red" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('h4'),
                { innerText: "To Do" }
            )
        )


    tabContentHolder.lastChild.lastChild.lastChild.
        appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "col container", id: projectName + "inprogress" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "col-title-yellow" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('h4'),
                { innerText: "In Progress" }
            )
        )


    tabContentHolder.lastChild.lastChild.lastChild.
        appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "col container", id: projectName + "done" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: "col-title-green" }
            )
        ).appendChild(
            Object.assign(
                document.createElement('h4'),
                { innerText: "Done" }
            )
        )

    return tabContentHolder.lastChild;
}

export function dragOver(column) {
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
}

module.export = function getAllProjectName (tasks) {
    const allProjectsName = [];
    for (let task of tasks) {   //populate allProjectsName array with the name of the tasks project name
        if (!allProjectsName.includes(task.projectName)) {
            allProjectsName.push(task.projectName)
        }
    }
    return allProjectsName;
}
