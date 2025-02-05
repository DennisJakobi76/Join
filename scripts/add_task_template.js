/**
 * Function to render a subtask in thhe add task form that is editable and deleteable
 * @param {string} subtaskTitle
 * @returns html string of a single subtask
 */
function renderSubtask(subtaskTitle) {
    return `<li>
				<div class="subtask-text-img-container">
					<span onblur="removeEditClass(event)">${subtaskTitle}</span>
					<div class="subtask-img-container">
						<img 
							src="../assets/icons/edit-symbol.svg"
							alt="pencil icon"
							onclick="editContent(event)"
						/>
						<img
							id="sub-task-icon-vector"
							src="../assets/icons/subtask-vektor.svg"
							alt="vector icon"
						/>
						<img
							src="../assets/icons/trashcan.svg"
							alt="trashcan-logo"
							onclick="deleteSubtask(event, '${subtaskTitle}')"
						/>
					</div>
				</div>
			</li>`;
}

/**
 * Function to render a contact in the add task form with initial-circle and name
 * @param {string} name
 * @param {string} id
 * @returns html string of a single contact
 */
function renderAssignContact(name, id) {
    return `<div id="check-box-assign-contact-id(${id})" data-id="${id}" class="assign-contact-li-container" onclick="checkContact(event, this.dataset)">
				<div class="contact-circle-and-name-container">
					<div id="name-circle(${id})" class="name-circle">${getContactInitials(name)}</div>
					<li>${name}</li>
				</div>
				<img src="../assets/icons/checkbox-not-checked.svg" alt="unchecked checkbox"/>
			</div>`;
}

/**
 * Function to render an initial-circle in the add task form with initials processed from the name
 * @param {string} name
 * @param {string} id
 * @returns html string of a single contact
 */
function renderNameCircle(name, id) {
    return `<div id="contact-name-circle(${id})" class="name-circle">${getContactInitials(name)}</div>`;
}
