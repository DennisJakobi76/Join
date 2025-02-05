let initials = "";
let newColor = getRandomColor();

/**
 * Function to get the initials of a contact, set a new color and fill the placeholder bubble at the add contact form
 */
function fillPlaceholderBubble() {
    const PLACEHOLDER_CIRCLE = document.getElementById("add-contact-placeholder");
    const CONTACT_INITIALS = document.getElementById("add-contact-initials-paragraph");
    const CONTACT_PLACEHOLDER_IMG = document.getElementById("add-contact-placeholder-img");
    const NAME_INPUT = document.getElementById("add-contact-name-input-field");
    if (NAME_INPUT.value) {
        handleValidInputAtFillPlaceHolderBubble(PLACEHOLDER_CIRCLE, newColor, CONTACT_PLACEHOLDER_IMG, CONTACT_INITIALS, NAME_INPUT);
    } else {
        PLACEHOLDER_CIRCLE.classList.add("d-none");
        CONTACT_PLACEHOLDER_IMG.classList.remove("d-none");
    }
}

/**
 * Handles the logic when a valid input is given at the fillPlaceHolderBubble function
 * @param {HTML-Element} circleElement - The circle element that holds the initials
 * @param {string} color - The color that the new contact should have
 * @param {HTML-Element} imageElement - The element that displays the image of the contact
 * @param {HTML-Element} intialsElement - The element that displays the initials of the contact
 * @param {HTML-Element} inputElement - The input field where the user gives the input
 */
function handleValidInputAtFillPlaceHolderBubble(circleElement, color, imageElement, intialsElement, inputElement) {
    circleElement.classList.remove("d-none");
    initials = getContactInitials(inputElement.value);
    setColorById("add-contact-placeholder", color);
    imageElement.classList.add("d-none");
    intialsElement.innerHTML = initials;
}

/**
 * Function to clear all input fields of the add contact form
 */
function clearAllInput() {
    location.reload();
}

/**
 * Function to get all contact-id's in firebase
 * @returns an array of all contact-id's in firebase
 */
async function getIdOfNewContact() {
    let response = await loadData(PATH_TO_CONTACTS);
    let contactsKeysArray = Object.keys(response);
    return contactsKeysArray[contactsKeysArray.length - 1];
}

/**
 * Function to create a new contact in firebase by collecting the input values of the add contact form
 * and pushing them to the allContacts array before giving feedback to the user
 * @param {event} event
 */
async function createContact(event) {
    event.preventDefault();
    const inputsValid = checkAddContactInputs();
    if (!inputsValid) {
        return;
    }
    const EMAIL_INPUT = document.getElementById("add-contact-email-input-field");
    const PHONE_INPUT = document.getElementById("add-contact-phone-input-field");
    const NAME_INPUT = document.getElementById("add-contact-name-input-field");
    let newContact = createNewContactObject(EMAIL_INPUT, NAME_INPUT, PHONE_INPUT);
    if (!newContact.email || !newContact.name || !newContact.phone) return;
    handleValidContactObject(newContact);
}

/**
 * Handles the logic after a new contact object has been created and validated.
 * It posts the new contact object to the contacts path in firebase, updates the session storage,
 * adds the new contact to the allContacts array, renders the new contact in the single contact view,
 * hides the add contact container and shows a success message to the user.
 * @param {object} newContactObject - The new contact object that has been created and validated.
 */
async function handleValidContactObject(newContactObject) {
    try {
        await postData(PATH_TO_CONTACTS, newContactObject);
        await setBackendJsonToSessionStorage();
        let newId = await getIdOfNewContact();
        allContacts.push({ id: newId, contact: newContactObject, color: newColor });
        document.getElementById("single-contact-view").innerHTML = renderNewContact(newContactObject.name, newContactObject.email, initials, newId, newColor, newContactObject.phone);
        ["addContactContainer", "window-overlay"].forEach((id) => document.getElementById(id).classList.add("d-none"));
        showSuccessToUser();
    } catch (error) {
        console.error("Fehler beim Erstellen des Kontaktes:", error);
    }
}

/**
 * Shows a success message to the user after a new contact has been created.
 * The message slides up and down and then disappears after 2 seconds.
 * After that, the user is navigated to the contact list.
 */
function showSuccessToUser() {
    let successDiv = document.getElementById("add-contact-success-div");
    successDiv.classList.remove("d-none", "slide-down-success");
    successDiv.classList.add("slide-up-success");
    setTimeout(() => {
        successDiv.classList.replace("slide-up-success", "slide-down-success");
        setTimeout(() => successDiv.classList.add("d-none"), 500);
        navigateToContactList();
    }, 1500);
}

/**
 * Creates a new contact object with the given input field values.
 * @param {HTMLInputElement} emailInputElement
 * @param {HTMLInputElement} nameInputElement
 * @param {HTMLInputElement} phoneInputElement
 * @returns {object} newContactObject
 */
function createNewContactObject(emailInputElement, nameInputElement, phoneInputElement) {
    let newContactObject = {
        email: emailInputElement.value,
        name: nameInputElement.value,
        phone: phoneInputElement.value,
    };
    return newContactObject;
}

/**
 * function to ckeck if all Add Contact Card Inputs are filled and valid
 */
function checkAddContactInputs() {
    const allInputsFilled = inputsFilled("add-contact-name-input-field", "add-contact-email-input-field", "add-contact-phone-input-field");
    const emailValid = checkValidation("email", "add-contact-email-input-field");
    const phonenumberValid = checkValidation("phonenumber", "add-contact-phone-input-field");
    if (allInputsFilled) {
        if (emailValid && phonenumberValid) {
            return true;
        } else if (!emailValid && !phonenumberValid) {
            let responseEditContainer = document.getElementById("input-feedback-container");
            responseEditContainer.innerHTML = "Not a valid Email and Phonenumber!";
        }
    }
}
