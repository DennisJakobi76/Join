const CONTACT_LIST_CONTAINER = document.getElementById("contact-list-container");
let allContacts = [];
let firstLetters = [];
let cardId = "";
let activeContactId = null;

/**
 * Function to get all contact-objects from the session storage and add the color property and firebase-id to each object
 * @returns an array of all contact-objects with the added color property and firebase-id
 */
function loadAllContacts() {
    let fullObjectInSessionStorage = getJsonObjectFromSessionStorage();
    let contactsKeysArray = Object.keys(fullObjectInSessionStorage.contacts);
    for (let i = 0; i < contactsKeysArray.length; i++) {
        allContacts.push({
            id: contactsKeysArray[i],
            contact: fullObjectInSessionStorage.contacts[contactsKeysArray[i]],
            color: getRandomColor(),
        });
    }
    return allContacts;
}

/**
 * Function to get the correct board-section to render the contacts in based on the first letter of the contact's name
 */
function getListSection() {
    allContacts.sort((a, b) => a.contact.name.localeCompare(b.contact.name));
    let firstLetters = [...new Set(allContacts.map((c) => c.contact.name[0].toUpperCase()))];

    firstLetters.forEach((letter) => {
        CONTACT_LIST_CONTAINER.innerHTML += renderContactSection(letter);
        allContacts
            .filter((c) => c.contact.name.startsWith(letter))
            .forEach((c) => {
                document.getElementById(`div-for-contacts-with-letter(${letter})`).innerHTML += renderContactListContact(c.contact, getContactInitials(c.contact.name), c.id);
                setColorById(`profile-picture(${c.id})`, c.color);
            });
    });
}

/**
 * Function to start all needed actions on onload of the contactlist.html
 */
async function initializeContactsList() {
    loadUserInitials();
    await setBackendJsonToSessionStorage();
    loadAllContacts();
    getListSection();
}

/**
 * Function to set the displayed view to the contact list
 */
function navigateToContactList() {
    window.location.href = "contactlist.html";
}

/**
 * Function to render the detailed view of a contact
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @param {string} initials
 * @param {string} id
 * @param {string} contact
 */
function contactBigView(name, email, phone, initials, id, contact) {
    if (activeContactId !== null) {
        let prevElement = document.getElementById(`${activeContactId}`);
        if (prevElement) {
            prevElement.style.backgroundColor = "";
            prevElement.style.color = "";
        }
    }
    let newActiveElement = document.getElementById(`${id}`);
    newActiveElement.style.backgroundColor = "var(--dark-background)";
    newActiveElement.style.color = "white";
    activeContactId = id;
    let color = allContacts.find((e) => e.id == id).color;
    document.getElementById("single-contact-view").innerHTML = renderSingleContactView(name, email, phone, initials, id, color, contact);
    document.getElementById("single-contact-view").style.display = "block";
    document.getElementById("add-contact-button").style.display = "none";
}

/**
 * Function to render the edit view of a contact
 * @param {string} initials
 * @param {string} color
 * @param {string} id
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 */
function editBigView(initials, color, id, name, email, phone) {
    document.getElementById("edit-delete-menu").style.display = "none";
    document.getElementById("profileBtn").style.backgroundColor = "white";
    document.getElementById("window-overlay").classList.remove("d-none");
    document.getElementById("main-content").innerHTML += renderEditContactView(initials, color, id);
    document.getElementById("newName").value = name;
    document.getElementById("newEmail").value = email;
    document.getElementById("newPhone").value = phone;
}

/**
 * Function to close the edit view of a contact
 */
function closeEditContactView() {
    document.getElementById("edit-delete-menu").style.display = "flex";
    document.getElementById("window-overlay").classList.add("d-none");
    document.getElementById("profileBtn").style.backgroundColor = "white";
    document.getElementById("editContactContainer").classList.add("d-none");
    document.getElementById("editContactContainer").outerHTML = "";
}

/**
 * Function to close the add view of a contact
 */
function closeAddContactView() {
    document.getElementById("profileBtn").style.backgroundColor = "white";
    document.getElementById("window-overlay").classList.add("d-none");
    document.getElementById("addContactContainer").classList.add("d-none");
    document.getElementById("single-contact-view").style.display = "none";
    document.getElementById("addContactContainer").outerHTML = "";
}

/**
 * Function to let the detailed view to edit a contact slide down in 300ms
 */
function EditContactViewSlideDown() {
    document.getElementById("editContactContainer").classList.add("hidden");
    setTimeout(() => {
        closeEditContactView();
    }, 300);
}

/**
 * Function to ad an event listener to a html-element to prepare the closing the edit view of a contact
 */
document.addEventListener("mouseup", function (e) {
    let editContactDiv = document.getElementById("editContactContainer");
    if (editContactDiv && !editContactDiv.contains(e.target)) {
        editContactDiv.classList.add("hidden");
        setTimeout(() => {
            closeEditContactView();
        }, 300);
    }
});

/**
 * Function to open the add view of a contact
 */
function openAddContactView() {
    document.getElementById("profileBtn").style.backgroundColor = "white";
    document.getElementById("window-overlay").classList.remove("d-none");
    document.getElementById("main-content").innerHTML += renderAddContactView();
    document.getElementById("single-contact-view").style.display = "block";
}

/**
 * Function to ad an event listener to a html-element to prepare the closing the add view of a contact
 */
document.addEventListener("mouseup", function (e) {
    let addContactDiv = document.getElementById("addContactContainer");
    if (addContactDiv && !addContactDiv.contains(e.target)) {
        addContactDiv.classList.add("hidden");
        setTimeout(() => {
            closeAddContactView();
        }, 300);
    }
});

/**
 * Function to let the detailed view to add a contact slide down in 300ms
 */
function AddContactViewSlideDown() {
    document.getElementById("addContactContainer").classList.add("hidden");
    setTimeout(() => {
        closeAddContactView();
    }, 300);
}

let submenuVisible = false;

/**
 * Function to show the submenu
 */
function showSubmenu() {
    let submenu = document.getElementById("submenu");
    submenu.classList.remove("d-none", "hidden");
    submenuVisible = true;
}

/**
 * Function to ad an event listener to a html-element to prepare the closing the submenu
 */
document.addEventListener("mouseup", function (e) {
    let submenuDiv = document.getElementById("submenu");
    if (submenuVisible && !submenuDiv.contains(e.target)) {
        submenuDiv.classList.add("hidden");
        setTimeout(() => {
            submenuDiv.classList.add("d-none");
            submenuVisible = false;
        }, 100);
    }
});

let editDeleteMenuVisible = false;

/**
 * Function to show the edit and delete menu
 */
function showEditDeleteMenu() {
    let editDeleteMenu = document.getElementById("edit-delete-menu");
    document.getElementById("option-circle").classList.add("d-none");
    editDeleteMenu.classList.remove("d-none", "hidden");
    editDeleteMenuVisible = true;
}

/**
 * Function to ad an event listener to a html-element to prepare the closing the edit and delete menu
 */
document.addEventListener("mouseup", function (e) {
    let editDeleteMenuDiv = document.getElementById("edit-delete-menu");
    if (editDeleteMenuVisible && !editDeleteMenuDiv.contains(e.target)) {
        editDeleteMenuDiv.classList.add("hidden");
        setTimeout(() => {
            editDeleteMenuDiv.classList.add("d-none");
            document.getElementById("option-circle").classList.remove("d-none");
            editDeleteMenuVisible = false;
        }, 100);
    }
});

/**
 * Function to get the data from the input fields of an edited contact
 * @param {string} id
 */
function getEditedUserData(id) {
    const inputsValid = checkEditInputs();
    if (inputsValid) {
        let newName = document.getElementById("newName").value;
        let newEmail = document.getElementById("newEmail").value;
        let newPhone = document.getElementById("newPhone").value;
        saveEditedUserData(newName, newEmail, newPhone, id);
    }
}

/**
 * Function to check if all input fields for editing a contact are filled and valid
 * @returns {boolean} - true if all inputs are filled and valid, false if not
 */
function checkEditInputs() {
    const allInputsFilled = inputsFilled("newName", "newEmail", "newPhone");
    const emailValid = checkValidation("email", "newEmail");
    const phonenumberValid = checkValidation("phonenumber", "newPhone");
    if (allInputsFilled) {
        if (emailValid && phonenumberValid) {
            return true;
        } else if (!emailValid && !phonenumberValid) {
            let responseEditContainer = document.getElementById("input-feedback-container");
            responseEditContainer.innerHTML = "No Valid Email and Phonenumber!";
        }
    }
}

/**
 * Function to save the edited data of a contact in the firebase database
 * @param {string} newName
 * @param {string} newEmail
 * @param {string} newPhone
 * @param {string} id
 */
async function saveEditedUserData(newName, newEmail, newPhone, id) {
    document.getElementById("userName").innerHTML = newName;
    document.getElementById("userEmail").innerHTML = newEmail;
    document.getElementById("userPhone").innerHTML = newPhone;
    document.getElementById("userName").innerHTML = newName;
    document.getElementById("userEmail").innerHTML = newEmail;
    document.getElementById("userPhone").innerHTML = newPhone;
    updateData((path = PATH_TO_CONTACTS), (id = id), (data = { email: newEmail, name: newName, phone: newPhone }));
    EditContactViewSlideDown();
    await setBackendJsonToSessionStorage();
    setTimeout(() => {
        navigateToContactList();
    }, 1500);
}

/**
 * Function to delete a contact from the firebase and update the session storage
 * @param {string} id
 */
async function deleteContact(id) {
    await deleteData((path = PATH_TO_CONTACTS), (id = id));
    await setBackendJsonToSessionStorage();
    navigateToContactList();
}
