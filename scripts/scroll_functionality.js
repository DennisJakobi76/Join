const SCROLL_MARGIN = 5;
const SCROLL_SPEED = 15;
let scrollInterval;
let currentDraggedTask;
let draggedElement;
let isScrolling = false;
let scrollDirection = { x: 0, y: 0 };

/**
 * Function to enable the scrolling by dragging a task-card on the board to the edge of the screen
 * @param {event} event
 */
function enableScrollByDragging(event) {
    if (!event.clientX || !event.clientY) return;
    const boardContainer = document.getElementById("board-main");
    const boardWidth = boardContainer.offsetWidth;
    const boardHeight = boardContainer.offsetHeight;

    if (event.clientY > boardHeight - SCROLL_MARGIN) {
        startScrolling(0, SCROLL_SPEED);
    } else if (event.clientY < SCROLL_MARGIN) {
        startScrolling(0, -SCROLL_SPEED);
    } else if (event.clientX > boardWidth - SCROLL_MARGIN) {
        startScrolling(SCROLL_SPEED, 0);
    } else if (event.clientX < SCROLL_MARGIN) {
        startScrolling(-SCROLL_SPEED, 0);
    } else {
        stopScrolling();
    }
}

/**
 * Function to start scrolling in a specific direction based on the position of the dragged task-card
 * @param {integer} x
 * @param {integer} y
 */
function startScrolling(x, y) {
    scrollDirection = { x, y };
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(scrollStep);
    }
}

/**
 * Function to scroll the board as long as isScrolling is true
 */
function scrollStep() {
    let boardContainer = document.getElementById("board-main");
    boardContainer.scrollBy(scrollDirection.x, scrollDirection.y);
    if (isScrolling) {
        requestAnimationFrame(scrollStep);
    }
}

/**
 * Function to stop the scrolling
 */
function stopScrolling() {
    isScrolling = false;
}

/**
 * Function to rotate the dragged task-card and set a drag-ghost to the cursor that is rotated, too
 * @param {event} event
 */
function rotate(event) {
    event.target.classList.add("rotate-on-drag");
    if (event.dataTransfer) {
        let dragGhost = event.target.cloneNode(true);
        dragGhost.style.transform = "rotate(5deg)";
        dragGhost.style.position = "absolute";
        dragGhost.style.top = "-9999px";
        document.body.appendChild(dragGhost);
        event.dataTransfer.setDragImage(dragGhost, dragGhost.offsetWidth / 2, dragGhost.offsetHeight / 2);
        setTimeout(() => document.body.removeChild(dragGhost), 0);
    }
}

/**
 * Function to remove the rotation of the dragged task-card
 */
function removeRotations() {
    let rotatedCards = document.getElementsByClassName("rotate-on-drag");
    for (let j = 0; j < rotatedCards.length; j++) {
        rotatedCards[j].classList.remove("rotate-on-drag");
    }
}
