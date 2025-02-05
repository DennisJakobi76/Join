let editCheckedContactNamesAndColors = [];
let editNewTask = {};
let editContactNames = [];
let editFilteredNamesAndColors = [];
let helperArray = [];
let editTaskDropDownIcon;
let editTaskContactListContainer;
let editNameCircleContainer;

/**
 * Function to get all contacts that will be rendered in the contact list on editing a task
 * @param {array} array
 * @param {HTML-element} element
 */
function editAddContactNamesToList(array, element) {
    element.innerHTML = "";
    for (let j = 0; j < array.length; j++) {
        let name = array[j].name;
        let id = array[j].id;
        element.innerHTML += renderAssignContact(name, id);
        setColorById(`name-circle(${id})`, array[j].color);
    }
}

/**
 * Function to visualize the contact names that are allready assigned to a task in the contact list
 * of the task to be edited by adding a css-class that sets the background-color to black and checks the checkbox
 * of that contact
 * @param {array} taskArrayOfAssignedContacts
 * @param {array} arrayOfAllContactNames
 */
function setContactAssignedToChecked(taskArrayOfAssignedContacts, arrayOfAllContactNames) {
    let listElementDiv;
    for (let i = 0; i < arrayOfAllContactNames.length; i++) {
        for (let j = 0; j < taskArrayOfAssignedContacts.length; j++) {
            {
                if (arrayOfAllContactNames[i].name == taskArrayOfAssignedContacts[j]) {
                    listElementDiv = document.getElementById(`check-box-assign-contact-id(${arrayOfAllContactNames[i].id})`);
                    listElementDiv.classList.add("checked-contact");
                }
            }
        }
    }
}

/**
 * Function to ensure that the due date input field in the edit task form is formatted correctly
 */
function editFormatDateInput() {
    let dueDateInput = document.getElementById("edit-task-due-date");
    if (dueDateInput.value.length == 2 || dueDateInput.value.length == 5) {
        dueDateInput.value += `/`;
    }
    if (dueDateInput.value.length == 10 && !isDateValid(dueDateInput.value)) {
        dueDateInput.value = "";
    }
}

/**
 * Function to set the priority of a task to be edited to urgent
 */
function editSetUrgentPrio() {
    let editPrioUrgentButton = document.getElementById("edit-prio-urgent-btn");
    let editPrioMediumButton = document.getElementById("edit-prio-medium-btn");
    let editPrioLowButton = document.getElementById("edit-prio-low-btn");
    editPrioUrgentButton.classList.add("active-urgent");
    editPrioMediumButton.classList.remove("active-medium");
    editPrioLowButton.classList.remove("active-low");
    taskPrio = "urgent";
}

/**
 * Function to set the priority of a task to be edited to medium
 */
function editSetMediumPrio() {
    let prioUrgentButton = document.getElementById("edit-prio-urgent-btn");
    let prioMediumButton = document.getElementById("edit-prio-medium-btn");
    let prioLowButton = document.getElementById("edit-prio-low-btn");
    prioUrgentButton.classList.remove("active-urgent");
    prioMediumButton.classList.add("active-medium");
    prioLowButton.classList.remove("active-low");
    taskPrio = "medium";
}

/**
 * Function to set the priority of a task to be edited to low
 */
function editSetLowPrio() {
    let prioUrgentButton = document.getElementById("edit-prio-urgent-btn");
    let prioMediumButton = document.getElementById("edit-prio-medium-btn");
    let prioLowButton = document.getElementById("edit-prio-low-btn");
    prioUrgentButton.classList.remove("active-urgent");
    prioMediumButton.classList.remove("active-medium");
    prioLowButton.classList.add("active-low");
    taskPrio = "low";
}

/**
 * Function to filter the contact list showing possible contacts to assigne to the task in the edit task form by the input value
 * @param {event} event
 */
function editFilterInput(event) {
    editFilteredNamesAndColors = [];
    let editTaskContactList = document.getElementById("edit-task-contacts-list");
    editFilteredNamesAndColors = filterInputFromArray(editCheckedContactNamesAndColors, event.target.value);
    editAddContactNamesToList(editFilteredNamesAndColors, editTaskContactList);
}

/**
 * Function to check a contact in the contact list in the edit task form by adding it to the checkedContactNamesAndColors array
 * or removing it from there if it is not checked anymore
 * @param {event} event
 * @param {string} data
 */
function checkContact(event, data) {
    const container = event.currentTarget;
    const currentContact = getContactFromArrayById(editFilteredNamesAndColors, data.id);
    const isChecked = container.classList.toggle("checked-contact");

    [editCheckedContactNamesAndColors, contactNames, helperArray].forEach((arr) => {
        const index = arr.indexOf(currentContact.name);
        isChecked ? arr.push(currentContact.name) : arr.splice(index, 1);
    });

    editNameCircleContainer.innerHTML = "";
    addNameCircles(editCheckedContactNamesAndColors, editNameCircleContainer, `contact-name-circle`);
}

/**
 * Function to get a task-object from an array of task based on its id
 * @param {array} array
 * @param {string} id
 * @returns a task-object from an array of tasks by its id
 */
function getTaskFromArrayById(array, id) {
    return array.find((entry) => entry.id == id);
}

/**
 * Function to show the list of contacts that can be assigned to a task in the detailed view to edit a task
 */
function editShowContactList(event, taskId) {
    event.preventDefault();
    if (event.currentTarget !== event.target) return;
    initEditTaskElements();
    let currentTask = getTaskFromArrayById(allTasks, taskId);
    editCheckedContactNamesAndColors = getCheckedContacts(currentTask.assignedTo);
    setContactAssignedToChecked(currentTask.assignedTo, editCheckedContactNamesAndColors);
    toggleClass(editTaskContactListContainer, "d-none");
    editTaskDropDownIcon.src = getDropDownIcon(editTaskContactListContainer);
    if (!editTaskContactListContainer.classList.contains("d-none")) updateNameCircles();
    if (!editNameCircleContainer.classList.contains("d-none") && !editNameCircleContainer.hasChildNodes()) resetNameCircles();
}

/**
 * Initializes the elements needed for the edit task view
 */
function initEditTaskElements() {
    editTaskContactListContainer = document.getElementById("edit-task-contact-list-container");
    editTaskDropDownIcon = document.getElementById("edit-task-contact-drop-down-icon");
    editNameCircleContainer = document.getElementById("edit-name-circle-container");
}

/** returns contacts that should be checked */
function getCheckedContacts(assignedTo) {
    return editFilteredNamesAndColors.filter((contact) => assignedTo.includes(contact.name));
}

/**
 * toggles class
 * @param {element} element
 * @param {string} className
 */
function toggleClass(element, className) {
    element.classList.toggle(className);
}

/**
 * gets img source of dropdown/up icon relevant to the container
 * @param {element} container
 * @returns dropdown/up img source
 */
function getDropDownIcon(container) {
    return container.classList.contains("d-none") ? "../assets/icons/arrow-drop-down.svg" : "../assets/icons/arrow-drop-up.svg";
}

/**
 * updates the contact Bubbles
 */
function updateNameCircles() {
    editNameCircleContainer.classList.add("open-circle-container");
    editNameCircleContainer.classList.remove("d-none");
    editNameCircleContainer.innerHTML = "";
    addNameCircles(editCheckedContactNamesAndColors, editNameCircleContainer, `contact-name-circle`);
}

/**
 * resets the contact Bubbles
 */
function resetNameCircles() {
    editNameCircleContainer.innerHTML = "";
    editNameCircleContainer.classList.remove("open-circle-container");
}

/**
 * Function to remove a task-id from an assigned contact that is not checked anymore in the database
 * @param {string} taskId
 */
async function removeTaskIdFromUncheckedContacts(taskId) {
    let uncheckedContacts = editFilteredNamesAndColors.filter((contact) => !contactNames.includes(contact.name));
    for (let i = 0; i < uncheckedContacts.length; i++) {
        let contact = uncheckedContacts[i];
        let contactTasks = contact.tasksAssignedTo || [];
        let taskIndex = contactTasks.indexOf(taskId);
        if (taskIndex !== -1) {
            contactTasks.splice(taskIndex, 1);
            await updateData(PATH_TO_CONTACTS, contact.id, contact);
        }
    }
}

/**
 * edits a subtask
 * @param {event} event
 */
function editSubtask(event) {
    let spanElement = event.target.parentNode.parentNode.querySelector("span");
    sessionStorage.setItem("currentEditedSubtask", spanElement.innerHTML);
    if (spanElement) {
        spanElement.setAttribute("contenteditable", "true");
        spanElement.focus();
        spanElement.classList.add("editableSpan");
    }
}

/**
 * Function to edit a subtask of a task in the edit view of a task
 */
function editAddSubTask() {
    let subtaskTitle = "";
    let subTaskObject = {};
    let editSubtaskInput = document.getElementById("edit-subtask-title");
    let editSubtaskList = document.getElementById("edit-subtask-list");
    if (editSubtaskInput.value) {
        subtaskTitle = editSubtaskInput.value;
        editSubtaskList.innerHTML += renderSubtask(subtaskTitle);
        subTaskObject["description"] = subtaskTitle;
        subTaskObject["checked"] = false;
        subtaskList.push(subTaskObject);
        editSubtaskInput.value = "";
        editClearSubtaskInputField();
    }
}

/**
 * Function to delete a subtask from the subtask list in the edit view of a task
 */
function editClearSubtaskInputField() {
    document.getElementById("edit-subtask-title").value = "";
    document.getElementById("edit-sub-task-icon-plus").classList.remove("d-none");
    document.getElementById("edit-sub-task-icon-cross").classList.add("d-none");
    document.getElementById("edit-sub-task-icon-vector").classList.add("d-none");
    document.getElementById("edit-sub-task-icon-check").classList.add("d-none");
}

/**
 * Function to show or hide the icons in the subtask input field in the edit view of a task
 */
function editShowAndHideIcons() {
    let editSubtaskInput = document.getElementById("edit-subtask-title");
    let editSubtaskIconPlus = document.getElementById("edit-sub-task-icon-plus");
    let editSubtaskIconCross = document.getElementById("edit-sub-task-icon-cross");
    let editSubtaskIconVector = document.getElementById("edit-sub-task-icon-vector");
    let editSubtaskIconCheck = document.getElementById("edit-sub-task-icon-check");
    if (editSubtaskInput.value.length > 0) {
        editSubtaskIconPlus.classList.add("d-none");
        editSubtaskIconCross.classList.remove("d-none");
        editSubtaskIconVector.classList.remove("d-none");
        editSubtaskIconCheck.classList.remove("d-none");
    }
}

/**
 * Function to get needed values of assigned contacts to render der initial-cirlces in the edit view of a task
 * @param {array} assignedUsers
 */
function editTaskGetEmployeeInfo(assignedUsers) {
    let circleContainer = document.getElementById("edit-name-circle-container");
    assignedUsers = typeof assignedUsers === "string" && assignedUsers ? assignedUsers.split(",") : assignedUsers;

    assignedUsers.forEach((user, index) => {
        if (index < 3) circleContainer.innerHTML += createNameCircle(user);
        else if (index === assignedUsers.length - 1) circleContainer.innerHTML += `...(${assignedUsers.length - 3}) more Contact(s)`;
    });
}

/**
 * funktion to create contact Bubble out of a user
 * @param {string} user
 * @returns contact Bubble Html
 */
function createNameCircle(user) {
    let bgColor = getColorFromArrayByName(boardContactsAndColorsHelperArray, user);
    return `<div style="background-color: ${bgColor}" class="name-circle">${getEmployeesInitials(user)}</div>`;
}

/**
 * Function to render the subtask list in the edit view of a task
 * @param {array} subtasks
 */
async function editGetSubtaskInfo(subtasks) {
    if (subtasks === "undefined") {
        document.getElementById("edit-subtask-list").innerHTML = "";
    } else {
        const decodedSubtasks = JSON.parse(decodeURIComponent(subtasks));
        for (let i = 0; i < decodedSubtasks.length; i++) {
            subtaskList.push(decodedSubtasks[i]);
            document.getElementById("edit-subtask-list").innerHTML += `<li>
				<div class="subtask-text-img-container">
					<span onblur="removeEditClass(event)">${decodedSubtasks[i].description}</span>
					<div class="subtask-img-container">
						<img 
							src="../assets/icons/edit-symbol.svg"
							alt="pencil icon"
							onclick="editContent(event)"
						/>
						<img
							id="sub-task-icon-vector"
							src="../assets/icons/subtask-vektor.svg"
							alt="vector icon"
						/>
						<img
							src="../assets/icons/trashcan.svg"
							alt="trashcan-logo"
							onclick="deleteSubtask(event,'${decodedSubtasks[i].description}')"
						/>
					</div>
				</div>
			</li>`;
        }
    }
}

/**
 * Function to collect changed data from editing a task
 * @param {string} taskId
 */
async function getChangedTaskData(taskId) {
    let changedTaskTitle = document.getElementById("edit-task-title").value;
    let changedTaskDescription = document.getElementById("edit-task-description").value;
    let changedTaskDate = document.getElementById("edit-task-due-date").value;
    let changedTaskPrio = taskPrio;
    let changedContacts = editCheckedContactNamesAndColors.map((contact) => contact.name);
    let changedSubtaskList = subtaskList;
    await setChangedTaskDataToBackend(taskId, changedTaskTitle, changedTaskDescription, changedTaskDate, changedTaskPrio, changedContacts, changedSubtaskList);
}

/**
 * Function to set new data from editing a task to firebase database, update session storage
 *  and let the edit task view slide out from screen
 * @param {string} taskId
 * @param {string} changedTaskTitle
 * @param {string} changedTaskDescription
 * @param {string} changedTaskDate
 * @param {string} changedTaskPrio
 * @param {array} changedContacts
 * @param {array} changedSubtaskList
 */
async function setChangedTaskDataToBackend(taskId, title, desc, date, prio, contacts, subtasks) {
    if (title && date && prio) {
        await updateData(PATH_TO_TASKS, taskId, { title, description: desc, dueDate: date, priority: prio, assignedTo: contacts, subtasks });
        await Promise.all([addTaskToAssignedContacts(), setBackendJsonToSessionStorage(), updateSessionStorage()]);
        editTaskSlideOut();
    }
    navigateToBoard();
}
