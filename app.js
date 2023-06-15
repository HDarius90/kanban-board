const draggables = document.querySelectorAll('.draggable')
const columns = document.querySelectorAll('.col')


draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
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
containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        }
        else {
            container.insertBefore(draggable, afterElement)
        }
    })
})




