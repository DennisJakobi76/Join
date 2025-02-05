/**
 * Function to render a section in the contact list based on the first letter of the contact's prename
 * @param {char} letter
 * @returns html-string
 */
function renderContactSection(letter) {
    return `<div class="contactlist-category">
                    <span>${letter}</span>
                </div>
                <div class="contactlist-separator"></div>
				<div id="div-for-contacts-with-letter(${letter})"></div>`;
}

/**
 * Function to render a contact in the contact list
 * @param {object} contact
 * @param {string} initials
 * @param {string} id
 * @returns html-string
 */
function renderContactListContact(contact, initials, id) {
    return `<div id="${id}" onclick="contactBigView('${contact.name}','${contact.email}', '${contact.phone}','${initials}', '${id}', )" class="contactlist-contact contactlist-contact-hover">
                    <div id="profile-picture(${id})" class="profile-picture test-profile-picture-background">
                        <span>${initials}</span>
                    </div>
                    <div class="contactlist-name-and-email">
                        <span>${contact.name}</span>
                        <a href="mailto:${contact.email}">${contact.email}</a>
                    </div>
                </div>`;
}

/**
 * Function to render the detailed view of a contact
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @param {string} initials
 * @param {string} id
 * @param {string} color
 * @returns html-string
 */
function renderSingleContactView(name, email, phone, initials, id, color) {
    return ` 
            <div id="window-overlay" class="d-none window-overlay"></div>
                <div class="contact-head-container"
                    <div class="contact-container">
                        <div class="contact-head">
                            <div>
                                <h1>Contacts</h1>
                            </div>
                            <div class="arrow-position">
                                <img onclick="navigateToContactList()" class="" src="../assets/icons/blue-arrow-left.svg" alt="" />
                            </div>
                        </div>
                        <span class="border-left">Better with a team</span>
                    </div>
                <div class="contact-name">
                    <div id="profile-picture(${id})" class="contact-id profile-picture test-profile-picture-background" style="background-color: ${color};">
                        <span id="userInitials">${initials}</span>
                    </div>
                    
                    <div>
                    <h2 id="userName">${name}</h2>
                    <div class="edit-delete-wrapper" style="display: flex">
                    <div onclick="editBigView('${initials}', '${color}', '${id}', '${name}', '${email}', '${phone}')" class="option-container">
                        <div  class="option-edit"></div><span>Edit</span>
                    </div>
                    <div onclick="deleteContact('${id}')" class="option-container">
                        <div class="option-delete"></div><span>Delete</span>
                    </div>
                    </div>
                        
                    </div>
                    </div>
                    
                <div class="contact-information">
                    <span>Contact Information</span>
                    <span class="small-span"><b>Email</b></span>
                    <a id="userEmail" class="small-span" href="#">${email}</a>
                    <span class="small-span"><b>Phone</b></span>
                    <span id="userPhone" class="small-span">${phone}</span>
                </div>
                <div id="edit-delete-menu" class="edit-popup-container d-none">
                <div onclick="editBigView('${initials}', '${color}', '${id}', '${name}', '${email}', '${phone}')" class="option-container">
                    <div  class="option-edit"></div><span>Edit</span>
                </div>
                <div onclick="deleteContact('${id}')" class="option-container">
                    <div class="option-delete"></div><span>Delete</span>
                </div>
                </div>
                    <div id="option-circle" onclick="showEditDeleteMenu()" class="options-icon-container">
                        <img src="../assets/icons/options-logo.svg" alt="" />
                    </div>
            </div>`;
}

/**
 * Function to render the detailed edit view of a contact
 * @param {string} initials
 * @param {string} color
 * @param {string} id
 * @returns html-string
 */
function renderEditContactView(initials, color, id) {
    return `
<div id="editContactContainer" class="big-contact-container">
    <div class="add-contact-container">
        <div class="close-container">
            <img onclick="EditContactViewSlideDown()" src="../assets/icons/cross-white.svg" alt="">
        </div>
        <div class="add-contact-head">
            <h1 class="border-bottom">Edit contact</h1>
        </div>
    </div>
    <div class="desktop-view-contact-wrapper">
        <div class="placeholder-container">
            <div class="placeholder-contact" style="background-color: ${color};">
                ${initials}
            </div>
        </div>
        <div class="input-button-desktop-wrapper">
            <div class="create-contact-container">
                <div class="input-container">
                    <input id="newName" type="text" placeholder="Name">
                    <img src="../assets/icons/contact-person.svg" alt="User Icon" class="input-icon">
                </div>
                <div class="input-container">
                    <input id="newEmail" type="email" placeholder="Email">
                    <img src="../assets/icons/mail-icon.svg" alt="Mail Icon" class="input-icon">
                </div>
                <div class="input-container">
                    <input id="newPhone" type="tel" placeholder="Phone">
                    <img src="../assets/icons/phone-icon.svg" alt="Phone Icon" class="input-icon">
                </div>
                <div class="input-feedback-container" id="input-feedback-container"></div>
            </div>
            <div class="button-container">
                <div>
                    <button onclick="deleteContact('${id}')" class="delete-button">Delete</button>
                </div>
                <div>
                    <button onclick="getEditedUserData('${id}')" class="save-contact-button">
                        Save 
                        <img src="../assets/icons/check.svg" alt="">
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
}

/**
 *
 * @returns HTML-string to render the add contact view
 */
function renderAddContactView() {
    return `
<div id="addContactContainer" class="big-contact-container">
    <div>

        <div class="desktop-view-contact-wrapper">
            <div class="add-contact-container">
                <div class="close-container">
                    <img onclick="AddContactViewSlideDown()" src="../assets/icons/cross-white.svg" alt="">
                </div>
                <div class="add-contact-head">
                    <h1>Add Contact</h1>
                    <span class="border-bottom-add-contact">Tasks are better with a team!</span>
                </div>
            </div>
            <div class="placeholder-container">
                <div id="add-contact-placeholder" class="d-none">
                    <p id="add-contact-initials-paragraph"></p>
                </div>
                <img id="add-contact-placeholder-img" src="../assets/icons/contact-placeholder.svg" alt="" />
            </div>
            <form onsubmit="createContact(event)">
                <div class="input-button-desktop-wrapper">
                    <div class="create-contact-container">
                        <div class="input-container">
                            <input id="add-contact-name-input-field" type="text" placeholder="Name"
                                onblur="fillPlaceholderBubble()" onkeyup="resetNotFilledResponse(this)"/>
                            <img src="../assets/icons/contact-person.svg" alt="User Icon" class="input-icon">
                        </div>
                        <div class="input-container">
                            <input id="add-contact-email-input-field" type="text" placeholder="Email" onkeyup="resetNotFilledResponse(this)"/>
                            <img src="../assets/icons/mail-icon.svg" alt="Mail Icon" class="input-icon">
                        </div>
                        <div class="input-container">
                            <input id="add-contact-phone-input-field" type="text" placeholder="Phone" onkeyup="resetNotFilledResponse(this)"/>
                            <img src="../assets/icons/phone-icon.svg" alt="Phone Icon" class="input-icon">
                        </div>
                    </div>
                    <div class="input-feedback-container" id="input-feedback-container"></div>
                    <div class="button-container">
                        <button type="submit" class="create-contact-button">
                            Create contact
                            <img src="../assets/icons/check.svg" alt="">
                        </button>
                    </div>
            </form>
        </div>
    </div>
</div>
`;
}
