import { addEventListeners } from './cardevents.js'


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




//makes a Card element from task object and append it to an element if the element has less then 7 children, and add eventlisteners
export function addCard(task, element, allTask) {
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
                    { className: 'card', draggable: true, id: task._id, title: convertISODateToYYYYMMDD(task.deadline) }
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

        addEventListeners(element.lastChild, allTask);
    }
}

export function appendTaskToDom(task, addCard, allTask) {         //check if task.state is included on cols id and append it
    let allColumns = document.querySelectorAll('.col');
    allColumns.forEach((col) => {
        if (col.id.includes(task.state)) {
            addCard(task, col, allTask);
        }
    })
}

export function mooveCardToNewStateWithButton(task, selectedCard) {
    let allColumns = document.querySelectorAll('.col');
    allColumns.forEach((col) => {
        if (col.id.includes(task.state)) col.appendChild(selectedCard);
    })
}





export function dragOver(column, allTask) {
    column.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(column, e.clientY)
        const draggable = document.querySelector('.dragging') //set the current draggable element then append it to the current container
        if (column.children.length < 7) {
            if (afterElement == null) {                         // set conditions and check the AfterElements, 
                column.appendChild(draggable)                      //and if it is set to null, append a child at the end of the list.
            }
            else {
                column.insertBefore(draggable, afterElement)     // Else, add the element draggable and afterElement as parameters in the insertBefore function.
            }
            let draggedTask = allTask.find(task => task._id === draggable.id);
            switch (column.id) {
                case 'todo-col':
                    draggedTask.state = 'todo';
                    break;
                case 'inprogress-col':
                    draggedTask.state = 'inprogress';
                    break;
                case 'done-col':
                    draggedTask.state = 'done';
                    break;
            }
        }
    })
}


function convertISODateToYYYYMMDD(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
