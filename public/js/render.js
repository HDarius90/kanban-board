
import { appendTaskToDom, addCard, dragOver, mooveCardToNewStateWithButton } from "./functions.js";

const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');
const btnSave = document.getElementById('saveButton');


let allTask = JSON.parse(tasks);

allTask.forEach((task) => appendTaskToDom(task, addCard, allTask));

//add dragover event for hovering elements around
const columns = document.querySelectorAll('.col')
columns.forEach(column => {
    dragOver(column, allTask);
})


//Mooving cards in the columns to the left and updating the task.state
btnLeft.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = allTask.find(task => task._id === selectedCard.id);
    switch (focusedTask.state) {
        case 'inprogress':
            if (document.querySelector('#todo-col').children.length < 7) {
                focusedTask.state = 'todo';
                mooveCardToNewStateWithButton(focusedTask, selectedCard)
            }
            break;
        case 'done':
            if (document.querySelector('#inprogress-col').children.length < 7) {
                focusedTask.state = 'inprogress';
                mooveCardToNewStateWithButton(focusedTask, selectedCard)
            }
            break;
    }
})

//Mooving cards in the columns to the right and updating the task.state
btnRight.addEventListener('click', () => {
    let selectedCard = document.querySelector('.focus')
    let focusedTask = allTask.find(task => task._id === selectedCard.id);
    switch (focusedTask.state) {
        case 'todo':
            if (document.querySelector('#inprogress-col').children.length < 7) {
                focusedTask.state = 'inprogress';
                mooveCardToNewStateWithButton(focusedTask, selectedCard)
            }
            break;
        case 'inprogress':
            if (document.querySelector('#done-col').children.length < 7) {
                focusedTask.state = 'done';
                mooveCardToNewStateWithButton(focusedTask, selectedCard)
            }
            break;
    }
});

btnSave.addEventListener('click', function () {
    const database = allTask; // Replace with the actual database variable

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/save-database/${database[0].boardName}/?_method=PATCH`;

    // Create a hidden input field to store the database variable
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'database';
    input.value = JSON.stringify(database); // Convert the array to JSON string

    // Append the input field to the form
    form.appendChild(input);

    // Append the form to the document and submit it
    document.body.appendChild(form);
    form.submit();
});
