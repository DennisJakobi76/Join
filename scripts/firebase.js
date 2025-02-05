const BASE_URL = "https://join-10cdc-default-rtdb.europe-west1.firebasedatabase.app/";
const PATH_TO_CONTACTS = "contacts/";
const PATH_TO_TASKS = "tasks/";
const PATH_TO_USERS = "users/";

/**
 * Function to write new data to the database
 * @param {string} path
 * @param {object} data
 * @returns an JSON-object with actual data
 */
async function postData(path = "", data = {}) {
    let response = await fetch(`${BASE_URL}${path}.json`, {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseToJson = await response.json();
    return responseToJson;
}

/**
 * Function to read data from the database
 * @param {string} path
 * @returns JSON-object with data
 */
async function loadData(path = "") {
    let response = await fetch(`${BASE_URL}${path}.json`);
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Function to update data in the database
 * @param {string} path
 * @param {string} id
 * @param {object} data
 * @returns an JSON-object with actual data
 */
async function updateData(path = "", id = "", data = {}) {
    let response = await fetch(`${BASE_URL}${path}${id}.json`, {
        method: "PATCH",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Function to delete data from the database
 * @param {string} path
 * @param {string} id
 * @returns an JSON-object with actual data
 */
async function deleteData(path = "", id = "") {
    let response = await fetch(`${BASE_URL}${path}${id}.json`, {
        method: "DELETE",
    });
    return (responseToJson = await response.json());
}
