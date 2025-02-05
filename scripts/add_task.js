const TASK_CONTACT_LIST_CONTAINER = document.getElementById("add-task-contact-list-container");
const CONTACT_INPUT = document.getElementById("task-contact-input");
const CONTACT_INPUT_ICON = document.getElementById("add-task-contact-drop-down-icon");
const TASK_CONTACT_LIST = document.getElementById("add-task-contacts-list");
const NAME_CIRCLE_CONTAINER = document.getElementById("name-circle-container");
const SUBTASK_INPUT = document.getElementById("subtask-title");
const SUBTASK_LIST = document.getElementById("subtask-list");
const SUBTASK_ICON_PLUS = document.getElementById("sub-task-icon-plus");
const SUBTASK_ICON_CROSS = document.getElementById("sub-task-icon-cross");
const SUBTASK_ICON_VECTOR = document.getElementById("sub-task-icon-vector");
const SUBTASK_ICON_CHECK = document.getElementById("sub-task-icon-check");
const TASK_TITLE_INPUT = document.getElementById("task-title");
const DUE_DATE_INPUT = document.getElementById("task-due-date");
const TASK_CATEGORY_SELECT = document.getElementById("task-category-select");
const TASK_DESCRIPTION = document.getElementById("task-description");
const PRIO_URGENT_BUTTON = document.getElementById("prio-urgent-btn");
const PRIO_MEDIUM_BUTTON = document.getElementById("prio-medium-btn");
const PRIO_LOW_BUTTON = document.getElementById("prio-low-btn");
let newTask = {};
let contactNames = [];
let filteredNamesAndColors = [];
let checkedContactNamesAndColors = [];
let subtaskList = [];
let editSubtaskListArray = [];
let taskPrio = "";
let subtaskTitleBeforeEditing = "";

/**
 * Function to get all contacts names from the allContacts array and add them to the contact list
 * after checking if the user is logged in or a guest and loading the user initials. Then preparing the
 * filteresNamesAndColors array for the search function and adding the contact names to the contact list
 * in the add task form
 */
async function getAllContactsNames() {
    onlyLoadIfUserOrGuest();
    loadUserInitials();
    await loadAllContacts();
    let contactsNamesAndColors = allContacts.map((entry) => ({
        name: entry.contact.name.replace(/[^a-zA-ZöüäÖÜÄ ]/g, ""),
        color: entry.color,
        id: entry.id,
        tasksAssignedTo: entry.tasksAssignedTo,
    }));
    filteredNamesAndColors = contactsNamesAndColors;
    addContactNamesToList(filteredNamesAndColors, TASK_CONTACT_LIST);
}

/**
 * Function to add a subtask to the subtask list in the add task form, setting the value of checked by default to false
 * and then clearing the input field
 */
function addSubTask() {
    let subtaskTitle = "";
    let subTaskObject = {};
    if (SUBTASK_INPUT.value) {
        subtaskTitle = SUBTASK_INPUT.value;
        if (subtaskTitle.trim() !== "") {
            SUBTASK_LIST.innerHTML += renderSubtask(subtaskTitle);
            subTaskObject["checked"] = false;
            subTaskObject["description"] = subtaskTitle;
            subtaskList.push(subTaskObject);
            SUBTASK_INPUT.value = "";
        }
        clearSubtaskInputField();
    }
}

/**
 * Function to delete a subtask from the subtask list in the add task form
 * @param {event} event
 */
function deleteSubtask(event, subtaskDescription) {
    event.target.parentNode.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.parentNode);
    subtaskList = subtaskList.filter((subtask) => subtask.description !== subtaskDescription);
}

/**
 * Function to set the priority of a task to urgent
 */
function setUrgentPrio() {
    PRIO_URGENT_BUTTON.classList.add("active-urgent");
    PRIO_MEDIUM_BUTTON.classList.remove("active-medium");
    PRIO_LOW_BUTTON.classList.remove("active-low");
    taskPrio = "urgent";
}

/**
 * Function to set the priority of a task to medium
 */
function setMediumPrio() {
    PRIO_URGENT_BUTTON.classList.remove("active-urgent");
    PRIO_MEDIUM_BUTTON.classList.add("active-medium");
    PRIO_LOW_BUTTON.classList.remove("active-low");
    taskPrio = "medium";
}

/**
 * Function to set the priority of a task to low
 */
function setLowPrio() {
    PRIO_URGENT_BUTTON.classList.remove("active-urgent");
    PRIO_MEDIUM_BUTTON.classList.remove("active-medium");
    PRIO_LOW_BUTTON.classList.add("active-low");
    taskPrio = "low";
}

/**
 * Function to check a contact in the contact list in the add task form by adding it to the checkedContactNamesAndColors array
 * or removing it from there if it is not checked anymore
 * @param {event} event
 * @param {string} data
 */
function checkContact(event, data) {
    const container = event.currentTarget;
    let currentContact = getContactFromArrayById(filteredNamesAndColors, data.id);
    container.classList.toggle("checked-contact");
    if (container.classList.contains("checked-contact")) {
        checkedContactNamesAndColors.push(currentContact);
        contactNames.push(currentContact.name);
    } else {
        checkedContactNamesAndColors.splice(checkedContactNamesAndColors.indexOf(currentContact), 1);
        contactNames.splice(contactNames.indexOf(currentContact.name), 1);
    }
    NAME_CIRCLE_CONTAINER.innerHTML = "";
    addNameCircles(checkedContactNamesAndColors, NAME_CIRCLE_CONTAINER, `contact-name-circle`);
}

/**
 * Function to show a list of initials-circles of the assigned contacts in the add task form
 */
function showContactList(event) {
    event.stopPropagation();
    if (event.currentTarget == event.target) {
        TASK_CONTACT_LIST_CONTAINER.classList.toggle("d-none");
        if (!TASK_CONTACT_LIST_CONTAINER.classList.contains("d-none")) {
            CONTACT_INPUT_ICON.src = "../assets/icons/arrow-drop-up.svg";
            document.addEventListener("click", prepareContactlistToGetClosedFromOutside);
        } else {
            CONTACT_INPUT_ICON.src = "../assets/icons/arrow-drop-down.svg";
            NAME_CIRCLE_CONTAINER.classList.remove("d-none");
            NAME_CIRCLE_CONTAINER.classList.add("open-circle-container");
        }
        if (!NAME_CIRCLE_CONTAINER.classList.contains("d-none") && !NAME_CIRCLE_CONTAINER.hasChildNodes()) {
            NAME_CIRCLE_CONTAINER.classList.add("d-none");
            NAME_CIRCLE_CONTAINER.classList.remove("open-circle-container");
        }
    }
}

/**
 * Function to add the initials-circles of the assigned contacts to the add task form
 * @param {array} array
 * @param {HTML-Element} containerElement
 * @param {string} elementIdForColor
 */
function addNameCircles(array, containerElement, elementIdForColor) {
    for (let i = 0; i < array.length; i++) {
        let name = array[i].name;
        let id = array[i].id;
        let color = array[i].color;
        let targetElementForColor = elementIdForColor + `(${id})`;
        handleCountOfItemsAtAddNameCircles(array, containerElement, targetElementForColor, name, id, i, color);
    }
}

/**
 * Function to clear the subtask input field in the add task form
 */
function clearSubtaskInputField() {
    SUBTASK_INPUT.value = "";
    SUBTASK_ICON_PLUS.classList.remove("d-none");
    SUBTASK_ICON_CROSS.classList.add("d-none");
    SUBTASK_ICON_VECTOR.classList.add("d-none");
    SUBTASK_ICON_CHECK.classList.add("d-none");
}

/**
 * Function to show and hide icons in the subtask input field in the add task form
 */
function showAndHideIcons() {
    if (SUBTASK_INPUT.value.length > 0) {
        SUBTASK_ICON_PLUS.classList.add("d-none");
        SUBTASK_ICON_CROSS.classList.remove("d-none");
        SUBTASK_ICON_VECTOR.classList.remove("d-none");
        SUBTASK_ICON_CHECK.classList.remove("d-none");
    }
}

/**
 * Function to edit the content of a subtasktitle in the add task form
 * @param {event} event
 */
function editContent(event) {
    let spanElement = event.target.parentNode.parentNode.querySelector("span");
    if (spanElement.innerHTML.trim() !== "") {
        subtaskTitleBeforeEditing = spanElement.innerHTML;
    }
    sessionStorage.setItem("currentEditedSubtask", spanElement.innerHTML);
    if (spanElement) {
        spanElement.setAttribute("contenteditable", "true");
        spanElement.focus();
        spanElement.classList.add("editableSpan");
    }
}

/**
 * Function to remove a subtasktitle in the add task form
 * @param {event} event
 */
function removeEditClass(event) {
    let subtaskSpan = event.target;
    if (subtaskSpan.textContent.trim() === "") {
        handleEmptySubtaskTitleAtRemoveEditClass(event);
    } else if (subtaskSpan.textContent.trim() !== "" && subtaskSpan.textContent !== subtaskTitleBeforeEditing) {
        let newString = subtaskSpan.textContent;
        setEditedSubtaskTitleToArray(subtaskList, subtaskTitleBeforeEditing, newString);
    } else {
        event.target.classList.remove("editableSpan");
        let spanElement = event.target.parentNode.parentNode.querySelector("span");
        if (spanElement) {
            spanElement.setAttribute("contenteditable", "false");
        }
    }
}

/**
 * Function to save a new task to firebase by collecting the input values of the add task form
 * @param {event} event
 */
async function createTask(event) {
    event.preventDefault();
    if (event.submitter.id !== "create-task-btn" || !inputsFilled("task-title", "task-due-date", "task-category-select")) {
        return;
    }
    let state = setNewTaskStateByParamOrDefault();
    newTask = createNewTaskObject(contactNames, subtaskList, state);
    await handleValidNewTask(newTask);
    navigateToBoard();
}

/**
 * Function to add a new task to the assigned contacts in the allContacts array and update the data in firebase
 */
async function addTaskToAssignedContacts() {
    if (checkedContactNamesAndColors.length > 0) {
        let newTaskId = await getIdOfNewTask();
        for (let i = 0; i < checkedContactNamesAndColors.length; i++) {
            let indexInAllContacts = allContacts.findIndex((contact) => contact.id == checkedContactNamesAndColors[i].id);
            addTaskToContactInAllContactsArray(allContacts[indexInAllContacts], "tasksAssignedTo", newTaskId);
            let allAssignedToTasks = getAllTaskIdsOfUser(allContacts[indexInAllContacts], "tasksAssignedTo");
            await updateData(PATH_TO_CONTACTS, checkedContactNamesAndColors[i].id, (data = { tasksAssignedTo: allAssignedToTasks }));
        }
    }
}

/**
 * Function to get an array of Task-ID`s of a user that are assigned to him
 * @param {object} contact
 * @param {array} arrayOfIds
 * @returns array
 */
function getAllTaskIdsOfUser(contact, arrayOfIds) {
    if (contact.contact[arrayOfIds]) {
        return contact.contact[arrayOfIds];
    }
}

/**
 * Function to add a new task-id to one assigned contact
 * @param {object} contact
 * @param {array} tasksAssignedTo
 * @param {string} newTaskId
 */
function addTaskToContactInAllContactsArray(contact, tasksAssignedTo, newTaskId) {
    if (!contact.contact[tasksAssignedTo]) {
        contact.contact[tasksAssignedTo] = [newTaskId];
    } else if (!contact.contact[tasksAssignedTo].includes(newTaskId)) {
        contact.contact[tasksAssignedTo].push(newTaskId);
    }
}

/**
 * Function to get the last task-id in firebase because it is the id of the new task that has to be added to the assigned contacts
 * @returns the last task-id in firebase
 */
async function getIdOfNewTask() {
    let response = await loadData(PATH_TO_TASKS);
    let taskKeysArray = Object.keys(response);
    return taskKeysArray[taskKeysArray.length - 1];
}

/**
 * Event listener that closes the contact list in the add task form when the user clicks outside
 * of the contact list. This function is called on every click event outside of the contact list
 * and checks if the event target is inside the contact list container. If it is not, the contact
 * list container is hidden and the event listener is removed.
 * @param {Event} event - The click event outside of the contact list
 */
function prepareContactlistToGetClosedFromOutside(event) {
    event.stopPropagation();
    if (!TASK_CONTACT_LIST_CONTAINER.contains(event.target)) {
        TASK_CONTACT_LIST_CONTAINER.classList.add("d-none");
        if (NAME_CIRCLE_CONTAINER.hasChildNodes()) {
            NAME_CIRCLE_CONTAINER.classList.remove("d-none");
        }
        document.removeEventListener("click", prepareContactlistToGetClosedFromOutside);
    }
}
