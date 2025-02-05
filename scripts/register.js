const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const userNameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordFeedbackRef = document.getElementById("input-feedback-container");
const signupPopup = document.getElementById("register-popup");

/**
 * Function to give feedback to the user if the passwords match or not.
 */
function visualizeIfPasswordsMatch() {
    const passwordInputValue = getPasswordInput();
    const isEmpty = checkIfpasswordFieldsEmpty(passwordInputValue);
    if (isEmpty) {
        removePasswordFeedbackStyle();
    } else {
        PasswordsMatch(passwordInputValue) ? setPasswordFeedbackStyle("matching") : setPasswordFeedbackStyle("notMatching");
    }
}

/**
 * Function to get the password and confirm password input values
 * @returns an object with the password and confirm password input values
 */
function getPasswordInput() {
    password = passwordInput.value;
    confirmPassword = confirmPasswordInput.value;
    return { password: password, confirmPassword: confirmPassword };
}

/**
 * Function to check if the password fields are empty
 * @param {string} inputToTest
 * @returns true if the password fields are empty
 */
function checkIfpasswordFieldsEmpty(inputToTest) {
    return inputToTest.password === "" || inputToTest.confirmPassword === "";
}

/**
 * Function to remove the feedback style from the password fields
 */
function removePasswordFeedbackStyle() {
    passwordInput.style.border = "";
    confirmPasswordInput.style.border = "";
    removeFeedbackText();
}

/**
 * Function to remove the feedback text from the screen
 */
function removeFeedbackText() {
    passwordFeedbackRef.classList.add("d-none");
}

/**
 * Function to check if the passwords match
 * @param {string} inputToTest
 * @returns true if the passwords match
 */
function PasswordsMatch(inputToTest) {
    return checkIfPasswordsMatch(inputToTest);
}

/**
 * Function to check if the password and the confirm password match
 * @param {string} inputToTest
 * @returns true if the passwords match
 */
function checkIfPasswordsMatch(inputToTest) {
    return inputToTest.password === inputToTest.confirmPassword;
}

/**
 * Function to set the password feedback style
 */
const PasswordFeedbackStyles = {
    matching: {
        text: "Passwords match!",
        colorcode: "--icon-low-green",
    },
    notMatching: {
        text: "Your passwords don't match. Please try again.",
        colorcode: "--icon-urgent-red",
    },
};

/**
 * Function to set the password feedback style based on the current state to password fields
 * @param {string} currentState
 */
function setPasswordFeedbackStyle(currentState) {
    passwordFeedbackRef.innerHTML = PasswordFeedbackStyles[currentState].text;
    passwordFeedbackRef.classList.remove("d-none");
    passwordInput.style.border = "1px solid var(" + PasswordFeedbackStyles[currentState].colorcode + ")";
    confirmPasswordInput.style.border = "1px solid var(" + PasswordFeedbackStyles[currentState].colorcode + ")";
    passwordFeedbackRef.classList.toggle("pw-match-green", currentState === "matching");
}

/**
 * Function to process the sign up form
 */
async function processSignUp() {
    if (!checkValidation("email", "email") || !inputsFilled("username", "email", "password", "confirmPassword")) {
        return;
    }
    if (await emailExists()) {
        setEmailExistsFeedback();
    } else {
        removeFeedbackText();
        addNewProfileToServer();
        showSignUpPopUp();
        setTimeout(navigateToLogin, 800);
    }
}

/**
 * Function to call a function to check if the email exists
 * @returns true if the email exists
 */
async function emailExists() {
    return await checkIfEmailExists();
}

/**
 * Function to check if the email exists
 * @returns true if the email exists
 */
async function checkIfEmailExists() {
    await fetchUsers();
    emailToSearch = emailInput.value;
    return !!users.find((user) => user.user.email === emailToSearch);
}

/**
 * Function to set visual feedback if the email already exists
 */
function setEmailExistsFeedback() {
    passwordFeedbackRef.innerHTML = "This email already exists.";
    passwordFeedbackRef.classList.remove("pw-match-green");
    passwordFeedbackRef.classList.remove("d-none");
}

/**
 * Function to show the sign up pop up as visual feedback to the user
 */
function showSignUpPopUp() {
    signupPopup.classList.remove("d-none");
}

/**
 * Function to save the new user to the firebase database
 */
function addNewProfileToServer() {
    let userData = {
        name: `"${userNameInput.value}"`,
        email: `"${emailInput.value}"`,
        password: `"${passwordInput.value}"`,
    };
    postData((path = "users/"), (data = { userData }));
    postData((path = "contacts/"), (data = { name: `${userNameInput.value}`, email: `${emailInput.value}`, phone: "" }));
}

/**
 * Function to set the displayed view to the login page
 */
function navigateToLogin() {
    window.location.href = "index.html";
}

/**
 * Function to toggle the visibility icon of the password field
 * @param {html-element} element
 * @param {string} imgId
 */
function togglePasswordVisibilityIcon(element, imgId) {
    inputRefValue = element.value;
    lockImgRef = document.getElementById("password-lock-" + imgId);
    visibilityImgRef = document.getElementById("password-visibility-" + imgId);
    lockImgRef.classList.toggle("d-none", !(inputRefValue.length === 0));
    visibilityImgRef.classList.toggle("d-none", inputRefValue.length === 0);
}

/**
 * Function to change the visibility of the password in the input field
 * @param {string} inputfieldId
 * @param {html-element} imgElement
 */
function changePasswordVisibility(inputfieldId, imgElement) {
    visibleImgRef = imgElement;
    inputfieldRef = document.getElementById(inputfieldId);
    if (inputfieldRef.type == "text") {
        inputfieldRef.type = "password";
        visibleImgRef.src = "../assets/icons/visibility_off.svg";
    } else {
        inputfieldRef.type = "text";
        visibleImgRef.src = "../assets/icons/visibility_on.svg";
    }
}

/**
 * Toggles the sign-up button's disabled state based on the privacy checkbox.
 * Enables the sign-up button if the privacy checkbox is checked, otherwise disables it.
 */
function toggleSignUpButton() {
    const checkbox = document.getElementById("privacyCheckbox");
    const signUpButton = document.getElementById("submitBtn");
    checkbox.checked ? (signUpButton.disabled = false) : (signUpButton.disabled = true);
}
