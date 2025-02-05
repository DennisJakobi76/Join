let data = [];
let contentRef = document.getElementById("search-task-result-main-container");
let progressBarCalc = "";

/**
 * Function to get all firebase information that are allready written to session storage
 * and save them to an array
 */
async function getDataFromSessionStorage() {
    let sessionResponse = sessionStorage.getItem("joinJson");
    let sessionResponseJson = JSON.parse(sessionResponse);
    let tasks = sessionResponseJson["tasks"];
    data = getArrayFromObject(tasks);
}
getDataFromSessionStorage();

/**
 * Function to filter task-cards by value in searchbar when the input has a minimum length of 4 characters
 * @param {event} event
 */
function searchTask(event) {
    let searchInput = event.target.value.toLowerCase();
    if (searchInput.length < 4) {
        return;
    }
    let results = data.filter((entry) => entry.title.toLowerCase().includes(searchInput));
    contentRef.innerHTML = "";
    results.forEach((task) => {
        renderSearchResultCard(task);
    });
}

/**
 * Function to render one task-card to the board
 * @param {object} task
 */
function renderSearchResultCard(task) {
    const subtaskState = getSubtaskStatus(task.subtasks);
    const priorityImg = getPriorityImage(task.priority);
    const employeesName = createUserContainer(task.assignedTo);
    const cardTypeColor = changeColorCardType(task.type);
    const searchResultContainer = document.getElementById("search-task-result-main-container");
    const boardContentMainContainer = document.getElementById("board-content-container");
    boardContentMainContainer.classList.add("d-none");
    searchResultContainer.style.display = "flex";
    contentRef.innerHTML += taskCardTemplateToHtml(task, subtaskState, priorityImg, employeesName, progressBarCalc, cardTypeColor);
}

/**
 * Function to change the first letters of words in a string to capitalized letters
 * @param {string} string
 * @returns string with capitalized words
 */
function capitalizeFirstLetter(string) {
    if (string.length === 0) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Function to show assigned users initial circles in task-card
 * @param {array} assignedUsers
 */
function createUserContainer(assignedUsers) {
    moreUserTemplate = "";
    if (!assignedUsers) {
        return "";
    }
    if (assignedUsers.length > 3) {
        moreUserTemplate = `<div class="more-users"><span>...</span></div>`;
    }
    assignedUsers = createUserBubbles(assignedUsers);
    assignedUsers = assignedUsers + moreUserTemplate;
    return assignedUsers;
}

/**
 * function to create userbubbles with initials
 * @param {array} assignedUsers
 * @returns html user bubbles
 */
function createUserBubbles(assignedUsers) {
    let assignedUserBubbles = assignedUsers
        .slice(0, 3)
        .map((user) => {
            const userContainer = document.createElement("div");
            userContainer.className = "user";
            const userName = checkUserFolder(user);
            userContainer.style.backgroundColor = getColorFromArrayByName(boardContactsAndColorsHelperArray, userName);
            const initials = getEmployeesInitials(userName);
            userContainer.innerHTML = initials;
            return userContainer.outerHTML;
        })
        .join("");
    return assignedUserBubbles;
}

/**
 * Function to get a color-code fitting to a contact-name
 * @param {array} array
 * @param {string} nameOfUser
 * @returns {string} containing a color-code
 */
function getColorFromArrayByName(array, nameOfUser) {
    let colorCode;
    if (array.length > 0 && nameOfUser) {
        const entry = array.find((entry) => entry.name === nameOfUser);
        colorCode = entry.color;
    } else {
        colorCode = getRandomColor();
    }

    return colorCode;
}

/**
 * Function to check for assigned users
 * @param {array} assignedUser
 * @returns an array of contact obejcts or an empty string
 */
function checkUserFolder(assignedUser) {
    if (assignedUser && assignedUser.name) {
        return assignedUser.name;
    } else if (typeof assignedUser === "string") {
        return assignedUser;
    } else {
        return "";
    }
}

/**
 * Function to get the correct icon based on the priority of a task
 * @param {string} priority
 * @returns string with priority icon
 */
function getPriorityImage(priority) {
    if (priority === "urgent") {
        return "../assets/icons/prio-urgent.svg";
    } else if (priority === "medium") {
        return "../assets/icons/prio-media-orange.svg";
    } else if (priority === "low") {
        return "../assets/icons/prio-low.svg";
    } else {
        return "../assets/icons/prio-low.svg";
    }
}

/**
 * Function to reload the board if the searchbar has no input
 */
function checkUserSearchInputAndRedirect() {
    let userInput = document.getElementById("user-search-input");
    if (userInput.value.trim() !== "") {
        return;
    } else {
        document.getElementById("board-content-container").classList.remove("d-none");
        document.getElementById("search-task-result-main-container").style.display = "none";
    }
}

/**
 * Function to get the checked or unchecked state of the subtask of a task
 * @param {array} subtasks
 * @returns html-string with state of subtasks of a task
 */
function getSubtaskStatus(subtasks) {
    let completedSubtasks = 0;
    let totalSubtasks = subtasks ? subtasks.length : 0;
    if (totalSubtasks === 0) {
        statusProgressBar(completedSubtasks, totalSubtasks);
        return "";
    }
    completedSubtasks = subtasks.filter((subtask) => subtask.checked).length;
    statusProgressBar(completedSubtasks, totalSubtasks);
    return `<span id="state">${completedSubtasks}/${totalSubtasks} ${totalSubtasks === 1 ? "Subtask" : "Subtasks"}</span>`;
}

/**
 * Function to get initials of an assigned user of a task based on its name
 * @param {string} EmployeesName
 * @returns string with initials based on contacts name
 */
function getEmployeesInitials(EmployeesName) {
    if (typeof EmployeesName !== "string") {
        throw new Error("EmployeesName must be a string");
    }
    if (EmployeesName != "") {
        return EmployeesName.split(" ")
            .map((name) => name[0].toUpperCase())
            .join("");
    }
}

/**
 * Function to set the progressbar of subtasks in a task-card
 * @param {integer} completedSubtasks
 * @param {integer} totalSubtasks
 * @returns html-string with a progreesbar to display the status of subtasks of a task
 */
function statusProgressBar(completedSubtasks, totalSubtasks) {
    if (totalSubtasks === 0) {
        progressBarCalc = "";
        return;
    }
    if (!completedSubtasks) {
        progressBarPercent = "0%";
        progressBarCalc = `<div class="progress-bar-wrapper"><div class="progress-bar" role="progressbar" style="width: ${progressBarPercent}"></div></div>`;
    }
    let percent = completedSubtasks / totalSubtasks;
    percent = Math.round(percent * 100);
    progressBarPercent = `${percent}%`;
    progressBarCalc = `<div class="progress-bar-wrapper"><div class="progress-bar" role="progressbar" style="width: ${progressBarPercent}"></div></div>`;
}

/**
 * Function to set the background-color of a div that contains the information about the type of a task
 * based on the type
 * @param {string} taskType
 * @returns string with background-color based on taskType
 */
function changeColorCardType(taskType) {
    if (taskType === "technicalTask") {
        return "background-color:rgba(31,215,193,1)";
    }
    if (taskType === "userStory") {
        return "background-color:rgba(0,56,255,1)";
    }
}

/**
 * Function to stop the propagation of an event
 * @param {event} event
 */
function stopEventBubbling(event) {
    event.stopPropagation();
}
