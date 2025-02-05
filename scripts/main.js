/**
 * Function to get the user`s initials based on the user name
 * @param {string} contactName
 * @returns string with initials of contact name
 */
function getContactInitials(contactName) {
    return contactName
        .split(" ")
        .map((name) => name[0].toUpperCase())
        .join("");
}

/**
 * Function to get an array of values that fit the input
 * @param {array} sourceArray
 * @param {string} input
 * @returns array of values that fit the input
 */
function filterInputFromArray(sourceArray, input) {
    return sourceArray.filter((entry) => entry.name.toLowerCase().includes(input.toLowerCase()));
}

/**
 * Function to get a random color-code from an array of colors
 * @returns one random color-code
 */
function getRandomColor() {
    let colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];
    return colors[Math.floor(Math.floor(Math.random() * colors.length))];
}

/**
 * Function to set a color to a profile picture by its id
 * @param {string} id
 * @param {string} color
 */
function setColorById(id, color) {
    let profilePicture = document.getElementById(id);
    profilePicture.style.backgroundColor = color;
}

/**
 * Function to get a contact from an array by its id
 * @param {array} array
 * @param {string} id
 * @returns one contact object from an array of contacts based on its id
 */
function getContactFromArrayById(array, id) {
    return array.find((entry) => entry.id == id);
}

/**
 * Function to get data from the backend and set it to the session storage
 */
async function setBackendJsonToSessionStorage() {
    let response = await fetch(BASE_URL + ".json");
    let fetchedData = await response.json();
    sessionStorage.setItem("joinJson", JSON.stringify(fetchedData));
}

/**
 * Function to get the initials of the user and set it to the profile button and set it to "G" if the user is a guest
 */
function loadUserInitials() {
    onlyLoadIfUserOrGuest();
    let userInitials = sessionStorage.getItem("userName");
    let loginStatus = sessionStorage.getItem("loginStatus");
    if (loginStatus === "user") {
        document.getElementById("profileBtn").innerText = userInitials;
    } else {
        document.getElementById("profileBtn").innerText = "G";
    }
}

/**
 * Function to get an object with all data from the session storage
 * @returns an object with all data from the session storage
 */
function getJsonObjectFromSessionStorage() {
    let completeJson = sessionStorage.getItem("joinJson");
    let completeObject = JSON.parse(completeJson);
    return completeObject;
}

/**
 * Function to get an array with all values from an object plus its firebase id
 * @param {object} object
 * @returns an array with all values from the object
 */
function getArrayFromObject(object) {
    let allKeys = Object.keys(object);
    let array = [];
    for (let i = 0; i < allKeys.length; i++) {
        object[allKeys[i]].id = allKeys[i];
        array.push(object[allKeys[i]]);
    }
    return array;
}

/**
 * Function to get the correct greeting text based on the time of the day and the users name
 * @returns string with greeting text
 */
function getGreetingText() {
    const timeText = getGreetingTextByTime();
    const guest = checkForGuestLogin();
    let greetingText = "";
    if (guest) {
        greetingText = timeText + "!";
    } else {
        greetingText = timeText + ",";
    }
    return greetingText;
}

/**
 * Function to get the greeting text based on the time of the day
 * @returns string with greeting text based on the time of the day
 */
function getGreetingTextByTime() {
    let greetingTimeText = "";
    let date = new Date();
    let time = date.getHours();
    if (time >= 5 && time <= 11) {
        greetingTimeText = "Good morning";
    } else if (time >= 11 && time <= 18) {
        greetingTimeText = "Good afternoon";
    } else {
        greetingTimeText = "Good evening";
    }
    return greetingTimeText;
}

/**
 * Function to check if the user is a guest
 * @returns true if the user is a guest
 */
function checkForGuestLogin() {
    const loginStatus = sessionStorage.getItem("loginStatus");
    if (loginStatus === "guest") {
        return true;
    }
}

/**
 * Function to get the user`s name from the local storage
 * @returns string with the users name
 */
function getUserNameFromLocalStorage() {
    let userName = "";
    userName = localStorage.getItem("userName");
    if (!userName) {
        userName = "";
    }
    return userName;
}
