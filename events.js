//Add all the event listeners to the card element
export function addEventListeners(element) {
    element.addEventListener('dragstart', () => {
        element.classList.add('dragging');  //Add dragging class when dragstart
    })

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging') //Remove dragging class when dragend
    })

    element.addEventListener('click', () => {
        let prevFocus = document.querySelector('.focus')
        element.classList.toggle('focus')  //Toogle focus class on clicked element
        try {
            if (prevFocus !== element) prevFocus.classList.remove('focus'); //If there is already a focus class element, then compare 
            //it, and if it is the same then remove the focus class instead of toggle
        } catch (error) {//prevent error message on the console if focus class does not exist jet

        }
    })

    element.addEventListener('dblclick', () => {
        let newTaskText = prompt('Rename task:');
        if (newTaskText) element.firstElementChild.firstElementChild.textContent = newTaskText;
    })

    element.addEventListener('hoover', () => {
        let newTaskText = prompt('Rename task:');
        if (newTaskText) element.firstElementChild.firstElementChild.textContent = newTaskText;
    })
}