let allTasks = [];
let allTaskUsers = [];
let allTaskContacts = [];
let boardContactsAndColorsHelperArray = [];

/**
 * Function to save names and colors of contatcs in an array
 */
async function setColorsOnceOnBoard() {
    await loadAllContacts();
    let contactsNamesAndColors = allContacts.map((entry) => ({
        name: entry.contact.name.replace(/[^a-zA-ZöüäÖÜÄ ]/g, ""),
        color: entry.color,
    }));
    boardContactsAndColorsHelperArray = contactsNamesAndColors;
}
setColorsOnceOnBoard();

/**
 * Function to show the detailed view of a task
 * @param {string} taskId
 * @param {integer} j
 * @param {string} taskDate
 * @param {string} taskPriority
 * @param {string} priorityImage
 * @param {string} assignedUsers
 * @param {string} subtasks
 * @param {string} cardTypeColor
 */
function taskBigView(taskId, j, taskDate, taskPriority, priorityImage, assignedUsers, subtasks, cardTypeColor) {
    document.getElementById("window-overlay").classList.remove("d-none");
    if (subtasks === "undefined") {
        getSmallCardInfo(taskId, j, taskDate, taskPriority, priorityImage, assignedUsers, cardTypeColor);
    } else {
        const decodedSubtasks = JSON.parse(decodeURIComponent(subtasks));
        getSmallCardInfo(taskId, j, taskDate, taskPriority, priorityImage, assignedUsers, cardTypeColor, decodedSubtasks);
    }
}
/**
 * Function to load the contacts assigned to a task in an array
 * @param {string} taskId
 */
function loadCardContactsInArray(taskId) {
    let currentTask = getTaskFromArrayById(allTasks, taskId);
    helperArray = currentTask.assignedTo;
    editCheckedContactNamesAndColors = editFilteredNamesAndColors.filter((contact) => helperArray.includes(contact.name));
}

/**
 * Function to collect informations of a task from a small card on board
 */
function getSmallCardInfo(taskId, j, taskDate, taskPriority, priorityImage, assignedUsers, cardTypeColor, decodedSubtasks) {
    let taskTitle = document.getElementById(`task-title${j}`).innerHTML;
    let taskDescription = document.getElementById(`task-description${j}`).innerHTML;
    let taskType = document.getElementById(`task-type${j}`).innerHTML;

    setInfoToBigCard(taskId, taskTitle, taskDescription, taskDate, taskType, taskPriority, priorityImage, assignedUsers, cardTypeColor, decodedSubtasks);
}

/**
 * Function to transfer collected informations of a task to the detailed view of that task
 * @param {string} taskId
 * @param {string} taskTitle
 * @param {string} taskDescription
 * @param {string} taskDate
 * @param {string} taskType
 * @param {string} taskPriority
 * @param {string} priorityImage
 * @param {string} assignedUsers
 * @param {string} cardTypeColor
 * @param {string} decodedSubtasks
 */
function setInfoToBigCard(taskId, taskTitle, taskDescription, taskDate, taskType, taskPriority, priorityImage, assignedUsers, cardTypeColor, decodedSubtasks) {
    document.getElementById("board-main").innerHTML += renderTaskBigView(taskId, taskTitle, taskDescription, taskDate, taskType, taskPriority, priorityImage, assignedUsers, cardTypeColor, decodedSubtasks);
    getEmployeeInfo(assignedUsers);
    getSubtaskInfo(decodedSubtasks, taskId);
}

/**
 * Function to get needed informations of an array of contacts assigned to a task and to render their initial-circles
 * in their correct colors
 * @param {array} assignedUsers
 */
function getEmployeeInfo(assignedUsers) {
    if (typeof assignedUsers === "string") {
        assignedUsers = assignedUsers.split(",");
    }
    if (assignedUsers.length > 0 && assignedUsers[0] !== "") {
        for (let index = 0; index < assignedUsers.length; index++) {
            let bgColor = getColorFromArrayByName(boardContactsAndColorsHelperArray, assignedUsers[index]);
            document.getElementById("assignedContacts").innerHTML += `
            <div class="contact">
                <div class="contact-info">
                    <div style="background-color: ${bgColor}" class="contact-img">${getEmployeesInitials(assignedUsers[index])}</div><span>${assignedUsers[index]}</span>
                </div>
            </div>
            `;
        }
    }
}

/**
 * Function to get subtask-texts and to render them in the detailed view of a task
 * @param {array} subtasks
 * @param {string} taskId
 */
async function getSubtaskInfo(subtasks, taskId) {
    if (subtasks === undefined) {
        document.getElementById("subtaskContainer").innerHTML = "Keine Subtasks";
    } else {
        for (let i = 0; i < subtasks.length; i++) {
            document.getElementById("subtaskContainer").innerHTML += `
            <div class="subtask-element-container">
                <input id="privacyCheckbox${i}" type="checkbox" onchange="changeStateofCheckbox(${i}, '${taskId}')" required>
                <label id="checkboxLabel${i}" for="privacyCheckbox${i}"></label>
                <span>${subtasks[i].description}</span>
            </div>
        `;
            await getCheckboxBg(taskId, i);
        }
    }
}

/**
 * Function to set the background-image for a subtask based on its state of being checked or not
 * @param {string} taskId
 * @param {integer} i
 */
async function getCheckboxBg(taskId, i) {
    let subtaskResponse = await loadData((path = `${PATH_TO_TASKS}${taskId}/subtasks/${i}/checked`));
    if (subtaskResponse === true) {
        document.getElementById(`checkboxLabel${i}`).style.background = 'url("../assets/icons/checkbox-checked.svg")';
    } else if (subtaskResponse === false) {
        document.getElementById(`checkboxLabel${i}`).style.background = 'url("../assets/icons/checkbox-not-checked.svg")';
    }
}

/**
 * Function to change the background-image of a checkbox based on its state of being checked or not
 * @param {integer} i
 * @param {string} taskId
 */
async function changeStateofCheckbox(i, taskId) {
    let isChecked = document.getElementById(`privacyCheckbox${i}`).checked;
    if (isChecked) {
        await updateData((path = PATH_TO_TASKS), (id = `${taskId}/subtasks/${i}`), (data = { checked: true }));
        document.getElementById(`checkboxLabel${i}`).style.background = 'url("../assets/icons/checkbox-checked.svg") no-repeat';
    } else {
        await updateData((path = PATH_TO_TASKS), (id = `${taskId}/subtasks/${i}`), (data = { checked: false }));
        document.getElementById(`checkboxLabel${i}`).style.background = 'url("../assets/icons/checkbox-not-checked.svg") no-repeat';
    }
    await updateBoardAfterChanges();
}

/**
 * Function to open the detailed view to edit a task
 * @param {string} taskTitle
 * @param {string} taskDescription
 * @param {string} taskDate
 * @param {string} taskPriority
 * @param {string} assignedUsers
 * @param {string} taskId
 * @param {string} decodedSubtasks
 */
async function openEditTaskBigView(taskTitle, taskDescription, taskDate, taskPriority, assignedUsers, taskId, decodedSubtasks) {
    editCheckedContactNamesAndColors = boardContactsAndColorsHelperArray.filter((contact) => {
        return assignedUsers.includes(contact.name);
    });
    editFilteredNamesAndColors = editCheckedContactNamesAndColors;
    document.getElementById("window-overlay").classList.remove("d-none");
    document.getElementById("task-big-container").outerHTML = "";
    document.getElementById("board-main").innerHTML += renderEditTaskBigView(taskId, taskTitle, taskDescription, taskDate);
    editTaskContactListContainer = document.getElementById("edit-task-contact-list-container");
    editNameCircleContainer = document.getElementById("edit-name-circle-container");
    document.getElementById("edit-task-title").value = taskTitle;
    document.getElementById("edit-task-description").value = taskDescription;
    document.getElementById("edit-task-due-date").value = taskDate;
    editTaskGetEmployeeInfo(assignedUsers);
    loadRightPriorityColor(taskPriority);
    editGetSubtaskInfo(decodedSubtasks);
    loadCardContactsInArray(taskId);
    await editGetAllContactsNames();
}

/**
 * Function to load all contacts from firebase and add them to the allContacts array
 * with added id`s, colors and and an array of tasks assigned to them
 */
async function editGetAllContactsNames() {
    editFilteredNamesAndColors = [];
    onlyLoadIfUserOrGuest();
    loadUserInitials();
    await loadAllContacts();
    let editContactsNamesAndColors = allContacts.map((entry) => ({
        name: entry.contact.name.replace(/[^a-zA-ZöüäÖÜÄ ]/g, ""),
        color: entry.color,
        id: entry.id,
        tasksAssignedTo: entry.tasksAssignedTo,
    }));
    editContactsNamesAndColors.forEach((contact) => {
        if (!editFilteredNamesAndColors.some((entry) => entry.id === contact.id)) {
            editFilteredNamesAndColors.push(contact);
        }
    });

    addContactNamesToList(editFilteredNamesAndColors, document.getElementById("edit-task-contacts-list"));
}

/**
 * Function to set the correct background-color to a priority-button in the detailed view to edit a task
 * @param {string} taskPriority
 */
function loadRightPriorityColor(taskPriority) {
    if (taskPriority == "urgent") {
        document.getElementById("edit-prio-urgent-btn").classList.add("active-urgent");
        taskPrio = "urgent";
    } else if (taskPriority == "medium") {
        document.getElementById("edit-prio-medium-btn").classList.add("active-medium");
        taskPrio = "medium";
    } else if (taskPriority == "low") {
        document.getElementById("edit-prio-low-btn").classList.add("active-low");
        taskPrio = "low";
    }
}

/**
 * Function to close the detailed view of a task
 */
function closeTaskBigView() {
    document.getElementById("window-overlay").classList.add("d-none");
    document.getElementById("profileBtn").style.backgroundColor = "white";
    document.getElementById("task-big-container").outerHTML = "";
    updateBoardAfterChanges();
}

/**
 * Function to close the detailed view of a task to edit
 */
function closeEditTaskBigView() {
    document.getElementById("window-overlay").classList.add("d-none");
    document.getElementById("profileBtn").style.backgroundColor = "white";
    document.getElementById("edit-task-big-container").outerHTML = "";
    updateBoardAfterChanges();
}

/**
 * Function to let the detailed view of a task to edit slide out of the screen in 300ms
 */
function editTaskSlideOut() {
    document.getElementById("edit-task-big-container").classList.add("slide-out-task-big");
    setTimeout(() => {
        closeEditTaskBigView();
    }, 300);
}

/**
 * Function to let the detailed view of a task slide out of the screen in 300ms
 */
function bigTaskSlideOut() {
    document.getElementById("task-big-container").classList.add("slide-out-task-big");
    setTimeout(() => {
        closeTaskBigView();
    }, 300);
}

/**
 * Function to add an eventlistener to container of the detailed view of a task so it can be slided out of the screen
 */
document.addEventListener("mouseup", function (e) {
    let bigTaskDiv = document.getElementById("task-big-container");
    if (bigTaskDiv && !bigTaskDiv.contains(e.target)) {
        bigTaskDiv.classList.add("slide-out-task-big");
        setTimeout(() => {
            closeTaskBigView();
        }, 300);
    }
});

/**
 * Function to set the displayed view to the board
 */
function navigateToBoard() {
    window.location.href = "board.html";
}

/**
 * Function to transfer the state of a new task based on the column of the board where it should be created in
 * @param {string} state
 */
function addNewTask(state) {
    window.location.href = `add-task.html?state=${state}`;
}

/**
 * Function to delete a task from the firebase database and to update the session storage
 * @param {string} taskId
 */
async function deleteTask(taskId) {
    await deleteData((path = PATH_TO_TASKS), (id = taskId));
    await setBackendJsonToSessionStorage();
    navigateToBoard();
}

/**
 * Function to write all task-cards to the board based on the informations stored in an array
 * @param {array} array
 */
function writeCardsToBoardSectionsFromArray(array) {
    for (let j = 0; j < array.length; j++) {
        let renderValuesObject = getObjectWithValuesNeededInBoardCard(array[j]);
        if (array[j].state === "toDo") {
            hideElementAndRenderAnother("todo", "board-to-do-section", renderValuesObject.task, renderValuesObject.subtaskState, renderValuesObject.prioImg, renderValuesObject.employeesName, progressBarCalc, renderValuesObject.color, j);
        } else if (array[j].state === "inProgress") {
            hideElementAndRenderAnother("inProgress", "board-in-progress-section", renderValuesObject.task, renderValuesObject.subtaskState, renderValuesObject.prioImg, renderValuesObject.employeesName, progressBarCalc, renderValuesObject.color, j);
        } else if (array[j].state === "awaitFeedback") {
            hideElementAndRenderAnother("awaitingFeedback", "board-await-feedback-section", renderValuesObject.task, renderValuesObject.subtaskState, renderValuesObject.prioImg, renderValuesObject.employeesName, progressBarCalc, renderValuesObject.color, j);
        } else if (array[j].state === "done") {
            hideElementAndRenderAnother("done", "board-done-section", renderValuesObject.task, renderValuesObject.subtaskState, renderValuesObject.prioImg, renderValuesObject.employeesName, progressBarCalc, renderValuesObject.color, j);
        }
    }
}

/**
 * Function to collect informations of a task in an object that provides the informations needed to render a task-card
 * @param {object} task
 * @returns object with needed values
 */
function getObjectWithValuesNeededInBoardCard(task) {
    let helperAssignedArray = [];
    if (!task.assignedTo) {
        task.assignedTo = helperAssignedArray;
    }
    return {
        task: task,
        subtaskState: getSubtaskStatus(task.subtasks),
        prioImg: getPriorityImage(task.priority),
        employeesName: createUserContainer(getArrayFromObject(task.assignedTo)),
        color: changeColorCardType(task.type),
    };
}

/**
 * Function to hide an element and to render another element in the same position with needed values to render a task-card
 * @param {HTML-element} elementToHide
 * @param {HTML-element} parentToRenderCardsIn
 * @param {string} renderParam_1
 * @param {string} renderParam_2
 * @param {string} renderParam_3
 * @param {string} renderParam_4
 * @param {string} renderParam_5
 * @param {string} renderParam_6
 * @param {integer} j
 */
function hideElementAndRenderAnother(elementToHide, parentToRenderCardsIn, renderParam_1, renderParam_2, renderParam_3, renderParam_4, renderParam_5, renderParam_6, j) {
    document.getElementById(elementToHide).classList.add("d-none");
    document.getElementById(parentToRenderCardsIn).innerHTML += taskCardTemplateToHtml(renderParam_1, renderParam_2, renderParam_3, renderParam_4, renderParam_5, renderParam_6, j);
}

/**
 * Function to prevent the default behavior of an event in the drag-and-drop-functionality
 * @param {event} event
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Function to update the state of a task in the firebase database and in the session storage and to update the board
 * @param {string} newState
 */
async function moveTaskToState(newState) {
    currentDraggedTask.state = newState;
    await updateData(PATH_TO_TASKS, currentDraggedTask.id, (data = currentDraggedTask));
    await updateSessionStorage();
    clearBoard();
    getAllTasksUsersAndContactsFromSessionStorage();
    checkSectionForChildNodes();
}

/**
 * Function to get the task-object and the task-card from the board based on the id of the task at the start of dragging
 * @param {event} event
 * @param {string} taskId
 */
function startDragging(event, taskId) {
    currentDraggedTask = allTasks.find((task) => task.id == taskId);
    draggedElement = event.target;
}

/**
 * Function to handle the drop of a task-card in the actual state of the board and to initialize the update of the task in the database
 * @param {event} event
 * @param {string} taskId
 */
function handleDropdownChange(event, taskId) {
    currentDraggedTask = allTasks.find((task) => task.id === taskId);
    const value = event.target.value;
    if (value) {
        moveTaskToState(value);
    }
}

/**
 * Updates the board after changes to the data in the database.
 * Gets the new data from the database, clears the board and renders the new data on the board.
 * The function is used after changes to the data were made, e.g. after a task was moved to another state.
 */
async function updateBoardAfterChanges() {
    await updateSessionStorage();
    clearBoard();
    getAllTasksUsersAndContactsFromSessionStorage();
}

/**
 * Function to update the informations stored in the session storge after updating the firebase database
 */
async function updateSessionStorage() {
    let response = await fetch(BASE_URL + ".json");
    let fetchedData = await response.json();
    sessionStorage.setItem("joinJson", JSON.stringify(fetchedData));
}

/**
 * Function to get all task-objects and user-objects from the session storage and to store them in arrays and to
 * add task-info-cards to the board
 */
function getAllTasksUsersAndContactsFromSessionStorage() {
    let sessionResponse = sessionStorage.getItem("joinJson");
    let sessionResponseJson = JSON.parse(sessionResponse);
    let tasks = sessionResponseJson["tasks"];
    allTasks = getArrayFromObject(tasks);
    let users = sessionResponseJson["users"];
    allTaskUsers = getArrayFromObject(users);
    let contacts = sessionResponseJson["contacts"];
    allTaskContacts = getArrayFromObject(contacts);
    writeCardsToBoardSectionsFromArray(allTasks);
}

/**
 * Function to clear the board from all task-cards
 */
function clearBoard() {
    let boardSections = document.getElementsByClassName("board-progress-state");
    for (let i = 0; i < boardSections.length; i++) {
        boardSections[i].innerHTML = "";
    }
}

/**
 * Function to check if a section of the board has child-nodes and to show the information
 * to the user if there is no card in a board-section
 */
function checkSectionForChildNodes() {
    let boardSections = document.getElementsByClassName("board-progress-state");
    for (let i = 0; i < boardSections.length; i++) {
        if (boardSections[i].children.length == 0) {
            if (i == 0) {
                document.getElementById("todo").classList.remove("d-none");
            } else if (i == 1) {
                document.getElementById("inProgress").classList.remove("d-none");
            } else if (i == 2) {
                document.getElementById("awaitingFeedback").classList.remove("d-none");
            } else if (i == 3) {
                document.getElementById("done").classList.remove("d-none");
            }
        }
    }
}

/**
 * Function to add a css-class to a board-section to give the user a feedback that a task can be dropped in this section
 * @param {string} id
 */
function highlight(id) {
    document.getElementById(id).classList.add("highlight-drag-area");
}

/**
 * Function to remove a css-class from a board-section to give the user a feedback that a task can be dropped in this section
 * @param {string} id
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("highlight-drag-area");
}
