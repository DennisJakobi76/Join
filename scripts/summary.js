const TO_DO_COUNTER = document.getElementById("to-do-counter-span");
const DONE_COUNTER = document.getElementById("done-counter-span");
const URGENT_COUNTER = document.getElementById("urgent-counter-span");
const DUE_TIME_FIELD = document.getElementById("due-time-field");
const TASK_IN_BOARD_COUNTER = document.getElementById("task-in-board-counter-div");
const TASK_IN_PROGRESS_COUNTER = document.getElementById("task-in-progress-counter-div");
const AWAITING_FEEDBACK_COUNTER = document.getElementById("awaiting-feedback-counter-div");
let allTasks = [];
let toDoCount = 0;
let doneCount = 0;
let urgentCount = 0;
let taskInBoardCount = 0;
let taskInProgressCount = 0;
let awaitingFeedbackCount = 0;
let upcomimgDeadline = "";

/**
 * Function to get task-objects from session storage and save them to an array
 */
function getAllTasksFromStoredObject() {
    let storedObject = getJsonObjectFromSessionStorage();
    allTasks = getArrayFromObject(storedObject.tasks);
}

/**
 * Function to count how often a value is included in an array of objects
 * @param {array} array
 * @param {string} attribute
 * @param {string} value
 * @returns integer with count of values in array
 */
function getCountOfValuesInArray(array, attribute, value) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i][attribute] === value) {
            count++;
        }
    }
    return count;
}

/**
 * Function to count number of tasks that got the state "inProgress"
 * @returns integer with count of tasks in state inProgress
 */
function getCountOfTasksInProgress() {
    let inProgress = getCountOfValuesInArray(allTasks, "state", "inProgress");
    return inProgress;
}

/**
 * Function to count number of tasks that got the state "toDo"
 * @returns integer with count of tasks in state toDo
 */
function getCountOfToDo() {
    let toDo = getCountOfValuesInArray(allTasks, "state", "toDo");
    return toDo;
}

/**
 * Function to count number of tasks that got the state "done"
 * @returns integer with count of tasks in state done
 */
function getCountOfDone() {
    let done = getCountOfValuesInArray(allTasks, "state", "done");
    return done;
}

/**
 * Function to count number of tasks that got the state "awaitFeedback"
 * @returns integer with count of tasks in state awaitFeedback
 */
function getCountOfAwaitFeedback() {
    let awaitFeedback = getCountOfValuesInArray(allTasks, "state", "awaitFeedback");
    return awaitFeedback;
}

/**
 * Function to count number of tasks that got the prio "urgent"
 * @returns integer with count of tasks with prio urgent
 */
function getCountOfPrioUrgent() {
    let prioUrgent = getCountOfValuesInArray(allTasks, "priority", "urgent");
    return prioUrgent;
}

/**
 * Function to count number of tasks on the board
 * @returns integer with count of tasks on the board
 */
function getCountOfTaskInBoard() {
    let taskInBoard = toDoCount + taskInProgressCount + awaitingFeedbackCount + doneCount;
    return taskInBoard;
}

/**
 * Function to determine the upcoming deadline from all tasks.
 * It parses the due dates of tasks, calculates the date closest to today's date,
 * and returns it formatted as a string in "Month Day, Year" format.
 * @returns {string} - Formatted date string of the nearest deadline.
 */
function getUpcomingDeadline() {
    let today = new Date();
    let nearestDeadline = allTasks.map((task) => new Date(task.dueDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))).reduce((nearest, date) => (Math.abs(date - today) < Math.abs(nearest - today) ? date : nearest));
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(nearestDeadline);
}

/**
 * Function to collect needed values and save them to variables
 */
function setNeededValues() {
    taskInProgressCount = getCountOfTasksInProgress();
    toDoCount = getCountOfToDo();
    doneCount = getCountOfDone();
    awaitingFeedbackCount = getCountOfAwaitFeedback();
    urgentCount = getCountOfPrioUrgent();
    taskInBoardCount = getCountOfTaskInBoard();
    upcomimgDeadline = getUpcomingDeadline();
}

/**
 * Function to write collected values to the information cards in the summary
 */
function writeValuesToElements() {
    TO_DO_COUNTER.innerHTML = toDoCount;
    TASK_IN_PROGRESS_COUNTER.innerHTML = taskInProgressCount;
    AWAITING_FEEDBACK_COUNTER.innerHTML = awaitingFeedbackCount;
    DONE_COUNTER.innerHTML = doneCount;
    URGENT_COUNTER.innerHTML = urgentCount;
    DUE_TIME_FIELD.innerHTML = upcomimgDeadline;
    TASK_IN_BOARD_COUNTER.innerHTML = taskInBoardCount;
}

/**
 * Funbction to set the greeting information based on daytime and username
 */
function setGreetingInformations() {
    setGreetingTime();
    setGreetingName();
}

/**
 * Function to render the timebased greeting information to the screen
 */
function setGreetingTime() {
    const greetingText = getGreetingText();
    document.getElementById("summary-greeting").innerHTML = greetingText;
    document.getElementById("animation-greeting").innerHTML = greetingText;
}

/**
 * Function to render the namebased greeting information to the screen
 */
function setGreetingName() {
    const userName = getUserNameFromLocalStorage();
    document.getElementById("summary-user-name").innerHTML = userName;
    document.getElementById("animation-userName").innerHTML = userName;
}

/**
 * Function to initialize all needed functions on load of the summary page
 */
function initSummary() {
    enableGreetingAnimationOnFreshLogin();
    loadUserInitials();
    getJsonObjectFromSessionStorage();
    getAllTasksFromStoredObject();
    setNeededValues();
    writeValuesToElements();
    setGreetingInformations();
}

/**
 * Function to enable the greeting animation if freshlogin information is set to session storage
 */
function enableGreetingAnimationOnFreshLogin() {
    let freshLogin = checkIfFreshLogin();
    if (!freshLogin) {
        animationRef = document.getElementById("animation-greeting-container");
        animationRef.classList.add("d-none");
    }
    disableFreshLogin();
}

/**
 * Function to check if session storage contains information called freshLogin
 * @returns string if freshlogin is set to session storage
 */
function checkIfFreshLogin() {
    let freshLogin = sessionStorage.getItem("freshLogin");
    return freshLogin;
}

/**
 * Function to disable the fresh login by removing the data from session storage
 */
function disableFreshLogin() {
    sessionStorage.removeItem("freshLogin");
}
