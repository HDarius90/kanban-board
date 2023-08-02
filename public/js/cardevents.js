//Add all the event listeners to the card element
export function addEventListeners(element, allTasks) {
    element.addEventListener('dragstart', () => {
        element.classList.add('dragging');  //Add dragging class when dragstart
    })

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging') //Remove dragging class when dragend
    })

    element.addEventListener('click', () => {
        let prevFocus = document.querySelector('.focus')
        element.classList.toggle('focus')  //Toogle focus class on clicked element

        if (prevFocus !== element) prevFocus.classList.remove('focus'); //If there is already a focus class element, then compare 
        //it, and if it is the same then remove the focus class instead of toggle
    })

    //rename tasks on dbclick event and update text on allTasks variable
    element.addEventListener('dblclick', () => {
        // Get the task ID from the element's data attribute
        const taskId = element.id;

        // Navigate to the edit page by updating the URL
        window.location.href = `/tasks/${taskId}/edit`;
    })
}