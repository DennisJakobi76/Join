/**
 * Function to render a single contact from the contact list
 * @param {string} name
 * @param {string} email
 * @param {string} initials
 * @param {string} id
 * @param {string} color
 * @param {string} phone
 * @returns html string of a single contact
 */
function renderNewContact(name, email, initials, id, color, phone) {
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
