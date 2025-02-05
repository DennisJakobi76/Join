let responseContainer = document.getElementById("input-feedback-container");

const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phonenumber: /^(?:\+49|0)[1-9]\d{1,14}$/,
};

/**
 * Function to validate the input of a form field based on a given validation type.
 * Shows an error message if the input is invalid and adds a "not-valid" class to the input field.
 * @param {string} validationType - The type of validation that should be used. Currently supported types are "email" and "phonenumber"
 * @param {string} inputfieldId - The id of the input field that should be validated
 * @returns {boolean} - true if the input is valid, false if not
 */
function checkValidation(validationType, inputfieldId) {
    setResponseContainer();
    const inputfield = document.getElementById(inputfieldId);
    let valid = validationPatterns[validationType].test(inputfield.value);
    if (!valid && inputfield.value.length > 0) {
        responseContainer.innerHTML = inputfield.value + " is not a valid " + validationType + "!";
        inputfield.classList.add("not-valid");
        return false;
    }
    return true;
}

/**
 * Function to set the global responseContainer variable to the element with id "input-feedback-container".
 */

function setResponseContainer() {
    responseContainer = document.getElementById("input-feedback-container");
}

/**
 * Function to check if all input fields are filled. If not, it adds a "not-valid" class to the input field and shows an error message.
 * @param {...string} inputs - The id's of the input fields that should be checked
 * @returns {boolean} - true if all input fields are filled, false if not
 */
function inputsFilled(...inputs) {
    setResponseContainer();
    let filled = true;
    for (let i = 0; i < inputs.length; i++) {
        const input = document.getElementById(inputs[i]);
        if (!input.value && input.value === "") {
            filled = false;
            input.classList.add("not-valid");
            responseContainer.innerHTML = "Inputs must be filled!";
        }
    }
    return filled;
}

/**
 * Resets the input field to its original state and removes any error messages.
 * @param {HTMLInputElement} element - The input element to reset
 */
function resetNotFilledResponse(element) {
    setResponseContainer();
    const input = element;
    input.classList.remove("not-valid");
    responseContainer.innerHTML = "";
}
