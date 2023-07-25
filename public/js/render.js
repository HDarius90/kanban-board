
const allTask = JSON.parse(tasks);
let allColumns = document.querySelectorAll('.col');
console.log(allTask);

allTask.forEach((task) => {
    switch (task.state) {
        case 'todo':
            addCard(task, allColumns[0], allTask);
            break;
        case 'inprogress':
            addCard(task, allColumns[1], allTask);
            break;
        case 'done':
            addCard(task, allColumns[2], allTask);
            break;
    }
});


function addCard(task, element, allTasks) {

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

        // addEventListeners(element.lastChild, allTasks);
    }
}