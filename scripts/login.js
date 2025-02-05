const emailInputRef = document.getElementById("email");
const passwordInputRef = document.getElementById("password");

let users = [];
let user = {};

/**
 * Function to login a user and check if the user exists. If the user exists, the user is logged in.
 * If the user does not exist, a message is displayed to the user.
 */
async function userLogin() {
    if (!inputsFilled("email", "password")) {
        return;
    }
    if (!checkValidation("email", "email")) {
        return;
    }
    await fetchUsers();
    const userExists = checkIfUserExists();
    if (userExists) {
        initiateLogin();
    } else {
        visualizeNoLoginMatch();
    }
}

/**
 * Function to fetch all users from the database and store them in an array of user-objects.
 */
async function fetchUsers() {
    let response = await fetch(BASE_URL + PATH_TO_USERS + ".json");
    let fetchedUsers = await response.json();

    users.push(
        ...Object.entries(fetchedUsers).map(([id, data]) => ({
            id,
            user: Object.fromEntries(Object.entries(data.userData).map(([key, value]) => [key, value.replace(/['"]/g, "").trim()])),
        }))
    );
}

/**
 * Function to check if the user exists in an array of user-objects.
 * @returns {boolean} true if the user exists, false if the user does not exist.
 */
function checkIfUserExists() {
    let email = emailInputRef.value;
    let password = passwordInputRef.value;
    user = {};
    user = users.find((user) => user.user.email === email && user.user.password === password);
    if (user) {
        return true;
    }
}

/**
 * Function to initiate the login process. The user is logged in and the user's initials are stored in the local storage.
 * After login, the user is navigated to the summary page.
 */
async function initiateLogin() {
    userName = user.user.name;
    email = user.user.email;
    localStorage.setItem("userName", userName);
    userKey = user.id;
    getUserInitials(userName);
    setLoginInformationToSessionStorage(userName, email, password);
    rememberUser(userKey);
    await setBackendJsonToSessionStorage();
    navigateToSummary();
}

/**
 * Function to give visual feedback to the user if the login credentials do not match any user.
 */
function visualizeNoLoginMatch() {
    document.getElementById("input-feedback-container").innerHTML = "Check your email and password. Please try again.";
    passwordInputRef.style.border = "1px solid var(--icon-urgent-red)";
    emailInputRef.style.border = "1px solid var(--icon-urgent-red)";
}

/**
 * Function to set the user's initials in the based on his name
 * @param {string} userName
 */
function getUserInitials(userName) {
    if (userName.includes(" ")) {
        let firstName = userName.split(" ")[0].trim().charAt(0).toUpperCase();
        let secondName = userName.split(" ")[1].trim().charAt(0).toUpperCase();
        let userInitials = firstName + secondName;
        sessionStorage.setItem("userName", userInitials);
    } else {
        let firstNameInitial = userName.charAt(0).toUpperCase();
        sessionStorage.setItem("userName", firstNameInitial);
    }
}

/**
 * Function to set the user's login information to the session storage and local storage.
 * @param {string} userName
 * @param {string} userEmail
 * @param {string} userPassword
 */
function setLoginInformationToSessionStorage(userName, userEmail, userPassword) {
    userData = {
        name: userName,
        email: userEmail,
        password: userPassword,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("loginStatus", "user");
    sessionStorage.setItem("freshLogin", true);
}

/**
 * Function to set the user credentials to the local storage if the user checks the "remember me"-checkbox.
 * @param {string} userKey
 */
function rememberUser(userKey) {
    let key = userKey;
    let rememberMe = document.getElementById("privacyCheckbox").checked;
    if (rememberMe) {
        localStorage.setItem("userkey", key);
    } else {
        return;
    }
}

/**
 * Function to get the user credentials from the session storage.
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
 * Function to get the user credentials for legal pages from the session storage.
 */
function loadPrivacyAndLegalUserInitials() {
    let userInitials = sessionStorage.getItem("userName");
    let loginStatus = sessionStorage.getItem("loginStatus");
    if (!loginStatus) {
        document.getElementById("privacy-navbar").innerHTML = '<a class="login-navbar-style" href="../pages/index.html">Log In</a>';
    }
    if (loginStatus === "user") {
        document.getElementById("profileBtn").innerText = userInitials;
    } else {
        document.getElementById("profileBtn").innerText = "G";
    }
}

/**
 * Function to set the user's to session storage and local storage if the user logs in as a guest.
 */
async function setGuestToSessionStorage(event) {
    event.preventDefault();
    sessionStorage.setItem("loginStatus", "guest");
    sessionStorage.setItem("guest", true);
    sessionStorage.setItem("freshLogin", true);
    await setBackendJsonToSessionStorage();
    navigateToSummary();
}

/**
 * Function to set the displayed view to summary.html
 */
function navigateToSummary() {
    window.location.href = "summary.html";
}

/**
 * Function that resets the login warning message if the user starts typing in the input fields.
 */
function resetLoginWarning() {
    let pwInput = document.getElementById("password").value;
    if (pwInput === "") {
        document.getElementById("email").style.border = "1px solid #ccc";
        document.getElementById("password").style.border = "1px solid #ccc";
        document.getElementById("pw-state-message").innerHTML = "";
    }
}

/**
 * Function to remove user credentials from the session storage and local storage at logout.
 */
function userLogout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("loginStatus");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("guest");
    localStorage.removeItem("userkey");
    localStorage.removeItem("userName");
}

/**
 * Function to load the user credentials from the local storage if the user chose to be remembered.
 */
async function autoLogin() {
    let userKey = localStorage.getItem("userkey");
    let userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
        document.getElementById("email").value = userData.email;
        localStorage.removeItem("user");
    }
    if (userKey) {
        await fetchUsers();
        findUserByKey(userKey);
        initiateLogin();
    }
}

/**
 * Function to find the user in the array of user-objects by the user's key.
 * @param {string} userKey
 */
function findUserByKey(userKey) {
    user = users.find((u) => u.id === userKey);
}
