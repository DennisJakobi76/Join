/**
 * Function to toggle css-classes at elements with 1 to n id`s
 * @param {string} className
 * @param  {...any} IDs
 */
function toggleClassById(className, ...IDs) {
    for (let i = 0; i < IDs.length; i++) {
        currentElement = document.getElementById(IDs[i]);
        currentElement?.classList.toggle(className);
    }
}

/**
 * Function to set the displayed view to the last view in the window history
 */
function getBackToPreviousSite() {
    window.history.back();
}

/**
 * Function to protect views from being loaded to screen by unauthorized viewers
 * @returns true if user is known or guest
 */
function onlyLoadIfUserOrGuest() {
    user = localStorage.getItem("user");
    guest = sessionStorage.getItem("guest");
    if (guest || user) {
        return true;
    } else {
        window.location.href = "index.html";
    }
}
