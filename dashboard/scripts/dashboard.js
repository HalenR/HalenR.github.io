import { displayMessageResponse } from "./status-message.js";

//const url = "https://website2.thermatechnology.com"; // Use this for production
const url = "http://localhost:5000"; // Use this for development


const refreshDevicesbtn = document.getElementById("refresh-devices");
const renameForm = document.getElementById("rename-device-form");




// Processes server responses and displays errors or statuses if needed, returns the result or "Success" when successful
const processResponse = async (response) => {
    const result = await response.json();
    displayMessageResponse(result, response.status);
    if (!(response.status === 200)) {
        return null;
    }
    return result || "Success";
}

// Retrieve device list from server, and then returns it, null if error
const getDeviceList = async () => {
    try {
        const response = await fetch(`${url}/user/devices`, {
            method: "GET",
            credentials: "include",
        });

        const result = await processResponse(response);

        // return the devices if they exist or null
        return result?.devices || null;

    } catch (error) {
        displayMessageResponse({message: "Error Getting Devices"}, response.status);
        return null;
    }
};

// Returns the current logs, or null if error
const getLogs = async (device_id) => {
    console.log("Getting logs for Device ID:", device_id);
    if (!device_id) {
        console.log("Missing Device Id");
        return null;
    }

    try {
        const response = await fetch(`${url}/log?device_id=${encodeURIComponent(device_id)}`, {
            method: "GET",
            credentials: "include",
        });

        const result = await processResponse(response);

        // return the devices if they exist or null
        return result || null;

    } catch (error) {
        console.log("Error during getting logs");
        return null;
    }
};



refreshDevicesbtn.addEventListener("click", () => {});
getLogsbtn.addEventListener("click", async () => {
    const device_id = document.getElementById("device-id").value;
    await getLogs();
});
renameForm.addEventListener("submit", async (event) => {
    console.log("Rename form submitted");
    event.preventDefault();

    const formData = new FormData(renameForm);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${url}/user/devices/rename`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: data.new_name,
                device_id: data.device_id,
            })
        });

        const result = await processResponse(response);
        if (!result) {
            return;
        }

        console.log("Rename Success");
        console.log(result);

    } catch (error) {
        console.log("Error during rename:", error);
    }
});



const deviceListDiv = document.getElementById("device-list-devices");
const renderDeviceList = async () => {
    // gets the current device list, or null if error
    const devices = await getDeviceList();

    // Clear the device list
    deviceListDiv.innerHTML = "";

    if (deviceList.length === 0) {
        // Length of list is 0, Either there was an error or the user hasn't added any to their accound, just make sure div is empty
    }
    

    // Make the container scrollable if needed
    deviceListDiv.style.overflowY = "auto";
    deviceListDiv.style.maxHeight = "300px"; // or whatever you want
    // Render each device
    deviceList.forEach(device => {
        const deviceItem = document.createElement("div");
        deviceItem.textContent = device.name;
        deviceItem.style.padding = "8px";
        deviceItem.style.borderBottom = "1px solid #ddd";
        deviceItem.style.cursor = "pointer";
        deviceItem.addEventListener("click", () => {
            renderDeviceInfo(device.id, device.name, device.location);
        });
        deviceListDiv.appendChild(deviceItem);
    });
    // otherwise there must be at least one device on the users account
    // The user must be able to click on each device and when its clicked the function
    // renderDeviceInfo(device_id, device_name, device_location) will be called
    // Also if there are too many devices the list should be scrollable
    // The element in the list should just display the devices name
}

const renderDeviceInfo = async (id, name, location) => {
    return;
}