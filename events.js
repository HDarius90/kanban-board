//Add all the event listeners to the card element
export function addEventListeners(element, allProjects) {
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
        } catch (error) {
            //catch classlist error
        }
    })

    //rename tasks on dbclick event and update text on project object
    element.addEventListener('dblclick', () => {
        let newTaskText = prompt('Rename task:');
        if (newTaskText) {
            element.firstElementChild.firstElementChild.textContent = newTaskText;
            console.log(allProjects);
            for (let i = 0; i < allProjects.length; i++){
              for (let z = 0; z < allProjects[i].length; z++){
                  console.log(allProjects[i][z]);

                if (allProjects[i][z].id === element.id) {
                    allProjects[i][z].text = newTaskText;
                }
              }
            }
        }
    })
}