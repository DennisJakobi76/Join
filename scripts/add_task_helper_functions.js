/**
 * Function to add contact names from an array to the contact list in the add task form
 * @param {array} array
 * @param {HTML-Element} element
 */
function addContactNamesToList(array, element) {
    element.innerHTML = "";
    for (let j = 0; j < array.length; j++) {
        let name = array[j].name;
        let id = array[j].id;
        element.innerHTML += renderAssignContact(name, id);
        setColorById(`name-circle(${id})`, array[j].color);
    }
}

/**
 * Function to clear all input fields of the add task form by resetting their values
 */
function clearAllInputAddTask(event) {
    event.stopPropagation();
    TASK_TITLE_INPUT.value = "";
    TASK_DESCRIPTION.value = "";
    DUE_DATE_INPUT.value = "";
    clearSubtaskInputField();
    setMediumPrio();
    subtaskList = [];
    SUBTASK_LIST.innerHTML = "";
    removeNotValidIfClearButtonisClicked(event);
}

/**
 * Function to remove "not-valid" class from task input fields
 * and clear feedback and requirement info containers when the clear button is clicked.
 * @param {event} event - The event object from the clear button click
 */
function removeNotValidIfClearButtonisClicked(event) {
    event.stopPropagation();
    TASK_TITLE_INPUT.classList.remove("not-valid");
    DUE_DATE_INPUT.classList.remove("not-valid");
    TASK_CATEGORY_SELECT.classList.remove("not-valid");
    document.getElementById("input-feedback-container").innerHTML = "";
}

/**
 * Function to open a datePicker-tool under the position of the event-target
 * @param {event} event
 */
function openDatePicker(event) {
    let dateInput = document.getElementById("hiddenDateInput");
    let target = event.target;
    const rect = target.getBoundingClientRect();
    dateInput.style.left = `${rect.left - 190}px`;
    dateInput.style.top = `${rect.bottom}px`;
    dateInput.style.visibility = "visible";
    dateInput.offsetHeight;
    dateInput.showPicker();
}

/**
 * Function to format a datestring from a datepicker to a needed format
 * @param {dateString} dateString
 * @returns {string} in formatted design
 */
function formatDate(dateString) {
    if (!dateString) {
        return "";
    }
    let stringParts = dateString.split("-");
    return `${stringParts[2]}/${stringParts[1]}/${stringParts[0]}`;
}

/**
 * Function to set a formatted string as a value of an input-field
 */
function updateDateField() {
    let dateInput = document.getElementById("hiddenDateInput");
    DUE_DATE_INPUT.value = formatDate(dateInput.value);
}

/**
 * Function to filter the contact list showing possible contacts to assigne to the task in the add task form by the input value
 * @param {event} event
 */
function filterInput(event) {
    filteredNamesAndColors = filterInputFromArray(filteredNamesAndColors, event.target.value);
    addContactNamesToList(filteredNamesAndColors, TASK_CONTACT_LIST);
}

/**
 * Helper function for addNameCircles, adds the initials-circles of the assigned contacts to the add task form
 * @param {array} array - the array of contacts to be rendered
 * @param {HTML-Element} containerElement - the html-element containing the initials-circles
 * @param {string} targetElementForColor - the id of the html-element to be colored
 * @param {string} name - the name of the contact to be rendered
 * @param {number} id - the id of the contact to be rendered
 * @param {number} counter - the counter of the current contact in the array
 * @param {string} color - the color of the contact to be rendered
 */
function handleCountOfItemsAtAddNameCircles(array, containerElement, targetElementForColor, name, id, counter, color) {
    if (counter < 3) {
        containerElement.innerHTML += renderNameCircle(name, id);
        setColorById(targetElementForColor, color);
    } else {
        if (counter == array.length - 1) {
            containerElement.innerHTML += `...(${array.length - 3}) more Contact(s)`;
        }
    }
}

/**
 * Function to check if a date is valid and in the format dd/mm/yyyy
 * @param {string} dateString
 * @returns true if the date is valid, false if not
 */
function isDateValid(dateString) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateString)) return false;
    const [day, month, year] = dateString.split("/").map(Number);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2025) {
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    } else {
        return false;
    }
}

/**
 * Function to ensure that the due date input field in the add task form is formatted correctly
 */
function formatDateInput() {
    if (DUE_DATE_INPUT.value.length == 2 || DUE_DATE_INPUT.value.length == 5) {
        DUE_DATE_INPUT.value += `/`;
    }
    if (DUE_DATE_INPUT.value.length == 10 && !isDateValid(DUE_DATE_INPUT.value)) {
        DUE_DATE_INPUT.value = "";
    }
}

/**
 * Handles the case when the user removes the text from the subtask input field
 * while it is in edit mode. This function removes the subtask from the task
 * and removes the subtask from the subtask list and the session storage.
 * @param {event} event - The event object from the element that triggered the function.
 */
function handleEmptySubtaskTitleAtRemoveEditClass(event) {
    event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
    let subtaskText = sessionStorage.getItem("currentEditedSubtask");
    subtaskList = subtaskList.filter((subtask) => subtask.description !== subtaskText);
    sessionStorage.removeItem("currentEditedSubtask");
}

/**
 * Updates the description of a subtask in the provided array.
 * Searches for a subtask object with a description matching the oldstring
 * and updates it to the newString.
 *
 * @param {array} array - The array of subtask objects.
 * @param {string} oldstring - The current description to be updated.
 * @param {string} newString - The new description to replace the old one.
 */
function setEditedSubtaskTitleToArray(array, oldstring, newString) {
    let obj = array.find((obj) => obj.description === oldstring);
    obj.description = newString;
}

/**
 * Sets the new task state by either retrieving it from the URL parameter "state" or
 * sets it to the default value "toDo" if the parameter is not set or empty.
 * @return {string} The new task state.
 */
function setNewTaskStateByParamOrDefault() {
    let param = new URLSearchParams(window.location.search);
    let newTaskState = "";
    if (param.has("state") && param.get("state") !== "") {
        newTaskState = param.get("state");
    } else {
        newTaskState = "toDo";
    }
    return newTaskState;
}

/**
 * Handles a newly created task by posting it to the backend if it has a valid type, title, and due date.
 * Updates the assigned contacts and session storage, and clears the input form.
 * Logs an error message to the console if task creation fails.
 * @param {Object} newTask - The task object containing details like type, title, and due date.
 */
async function handleValidNewTask(newTask) {
    try {
        if (newTask["type"] !== "" && newTask["title"] !== "" && newTask["dueDate"] !== "") {
            await postData(PATH_TO_TASKS, newTask);
            await addTaskToAssignedContacts();
            await setBackendJsonToSessionStorage();
            clearAllInputAddTask();
        }
    } catch (error) {
        console.error("Fehler beim Erstellen der Aufgabe:", error);
    }
}

/**
 * Creates a new task object with the given contactNames, subtaskList, and state.
 * All other properties are retrieved from the corresponding input fields.
 * @param {Array<string>} contactNames - Names of the contacts assigned to the task
 * @param {Array<Object>} subtaskList - List of subtasks with properties 'description' and 'checked'
 * @param {string} state - State of the task (e.g. "toDo", "inProgress", "done")
 * @returns {Object} - The created task object
 */
function createNewTaskObject(contactNames, subtaskList, state) {
    newTaskObject = {
        type: document.getElementById("task-category-select").value,
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-description").value,
        dueDate: document.getElementById("task-due-date").value,
        priority: taskPrio || "low",
        assignedTo: contactNames,
        subtasks: subtaskList,
        state: state,
    };
    return newTaskObject;
}

/**
 * Navigates to the board.html page
 */
function navigateToBoard() {
    window.location.href = "board.html";
}
