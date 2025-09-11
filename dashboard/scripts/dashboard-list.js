import { displayMessageResponse, processResponse } from "./status-message.js";
import { renderDeviceInfo } from "./dashboard-info.js";
import { clearAreas, clearInfoArea } from "./clearing-data.js";

const url = "https://website.thermatechnology.com"; // Use this for production
//const url = "http://localhost:5000"; // Use this for development


const refreshDevicesbtn = document.getElementById("refresh-devices");
const deviceListDiv = document.getElementById("device-list-devices");


let selectedDevice = null; // needed to hold selection




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
        displayMessageResponse({message: "Error Getting Devices"}, 400);
        return null;
    }
};



// renders the device list
const renderDeviceList = async () => {
    // gets the current device list, or null if error
    clearAreas();
    const devices = await getDeviceList();

    // Say "Please log in" if theres an error or it isn't an array
    if (!devices || !Array.isArray(devices)) {
        return;
    }

    // Say "no devices" if their list is empty
    if (devices.length === 0) {
        // Length of list is 0, there are no devices linked to this users accound
        clearInfoArea();
        const noDevices = document.createElement("div");
        noDevices.textContent = "No Devices Added to your Account";
        deviceListDiv.appendChild(noDevices);
        return;
    }
    

    // Render each device

    devices.forEach(device => {
        const deviceItem = document.createElement("div");
        deviceItem.textContent = device.name;
        deviceItem.style.padding = "8px";
        deviceItem.style.borderBottom = "1px solid #ddd";
        deviceItem.style.cursor = "pointer";
        deviceItem.addEventListener("click", () => {
            if (selectedDevice) {
                selectedDevice.classList.remove("selected-device");
            }

            // Add highlight to current
            deviceItem.classList.add("selected-device");
            selectedDevice = deviceItem;

            renderDeviceInfo(device.device, device.name, device.location);
        });
        deviceListDiv.appendChild(deviceItem);
    });
}
refreshDevicesbtn.addEventListener("click", renderDeviceList);
renderDeviceList();

export {renderDeviceList};