import { displayMessageResponse, processResponse } from "./status-message.js";
import { clearInfoArea, clearChart } from "./clearing-data.js";

const url = "https://website.thermatechnology.com"; // Use this for production
//const url = "http://localhost:5000"; // Use this for development



const deviceInfoArea = document.getElementById("device-info");


const logFormatTimeInfo = {
    0: "Last Month", // by day
    1: "Last 6 Months", // by week
    2: "Last 2 Years" // by month
}

const logFormatFloatsInfo = {
    0: "Value 1",
    1: "Value 2",
    2: "Value 3",
    3: "Value 4",
    4: "Value 5",
    5: "Value 6",
    6: "Value 7",
};


const exampleLogs1 = Array.from({ length: 30 }, (_, i) => ({
    createdAt: `2025-06-${String(i + 1).padStart(2, '0')}T00:00:00.000+00:00`,
    floats: [i, i+1, i+2, i*1.5, i*.5, i**.5, i**1.5],
}));
const exampleLogs2 = Array.from({ length: 30 }, (_, i) => ({
    createdAt: `2025-06-${String(i + 1).padStart(2, '0')}T00:00:00.000+00:00`,
    floats: [i+5, i+1, i+2, i*1.5, i*.5, i**.5, i**1.5],
}));
const exampleLogs3 = Array.from({ length: 30 }, (_, i) => ({
    createdAt: `2025-06-${String(i + 1).padStart(2, '0')}T00:00:00.000+00:00`,
    floats: [i+10, i+1, i+2, i*1.5, i*.5, i**.5, i**1.5],
}));



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
        return result.logs || null;

    } catch (error) {
        displayMessageResponse({message: "Error Getting Logs"}, 400);
        return null;
    }
};

// returns null if failure to rename
const rename = async (new_name, device_id) => {
    try {
        const response = await fetch(`${url}/user/devices/rename`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: new_name,
                device_id: device_id,
            })
        });

        const result = await processResponse(response);

        return result || null;

    } catch (error) {
        displayMessageResponse({message: "Error During Rename"}, 400);
        return null;
    }
}




const renderDeviceInfo_title = (name, device_id) => {
    // should include rename functionality later
    // First the title: ${name} AC Unit
    // then edit button
    // if clicked, can edit input area and save or cancel
    const titleDiv = document.createElement("div");
    const titletxt = document.createElement("p");
    titletxt.textContent = `Device name: ${name}`;
    titleDiv.appendChild(titletxt);
    titleDiv.id = "info-title"
    deviceInfoArea.appendChild(titleDiv);


};


const renderDeviceInfo_location = (location) => {
    // just the Location: AC Unit at ${location}
    const locationDiv = document.createElement("div");
    locationDiv.textContent = `Location: ${location}`;
    locationDiv.id = "info-location";
    deviceInfoArea.appendChild(locationDiv);
};

const createButtons = (container, range, func, mapping) => {
  for (let i = 0; i <= range; i++) {
    const button = document.createElement("button");
    button.textContent = mapping[i] || "Unknown";
    button.dataset.value = i;

    button.classList.add("button-selection");
    if (i === 0) button.classList.add("selected");

    button.addEventListener("click", () => {
      [...container.children].forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");

      func(); // No args needed
    });

    container.appendChild(button);
  }
}

const renderDeviceInfo_graphArea = (logs) => {
    const graphAreaDiv = document.createElement("div");
    graphAreaDiv.id = "info-graph"
    const floatSelection = document.createElement('div');
    floatSelection.id = "float-selection"
    const graphAndTime = document.createElement('div');
    graphAndTime.id = "graph-and-time";
    const graphArea = document.createElement('div');
    graphArea.id = "graph-area";
    const timeSelection = document.createElement('div');
    timeSelection.id = "time-selection";
    const graph = document.createElement("canvas");


    graphArea.appendChild(graph);
    graphAndTime.appendChild(graphArea);
    graphAndTime.appendChild(timeSelection);
    graphAreaDiv.appendChild(floatSelection);
    graphAreaDiv.appendChild(graphAndTime);
    deviceInfoArea.appendChild(graphAreaDiv);

    const createGraph = generate_graph_function(logs);
    createButtons(document.getElementById("float-selection"), 6, createGraph, logFormatFloatsInfo);
    createButtons(document.getElementById("time-selection"), 2, createGraph, logFormatTimeInfo);
    // create intial graph
    createGraph()



  

    // Then the graphing stuff
    // 3 time graphs, days (30), weeks (26), months (24)
    // obviously left side graph should be start while right is end, no matter the amount of data
    // also 7 float values to choose from

    //graph_generation_function(); // should generate the first graph
    //graph_generation_function();
};

const generate_graph_function = (logs) => {
    return () => {
        // Create an early exit if there is no div for holding the graph
        const graphArea = document.getElementById("graph-area");
        const graphCanvas = graphArea.querySelector("canvas");
        const floatIndex = parseInt(document.querySelector('#float-selection .selected').dataset.value);
        const timeRangeIndex = parseInt(document.querySelector('#time-selection .selected').dataset.value);
        console.log(floatIndex, timeRangeIndex);

        if (!graphCanvas) {
            clearInfoArea("Error");
            return;
        }

        const range_data = logs[timeRangeIndex];
        if (!Array.isArray(range_data)) {
            clearInfoArea("Error");
            return;
        }

        const data = range_data.map(element => {
            const float = element.floats[floatIndex];
            const safeFloat = Number.isFinite(float) ? float : null;

            // float will either be a number or null
            return {
                createdAt: element.createdAt,
                float: parseFloat(safeFloat)
            };
        })
        generateGraph(data, floatIndex);
    }
}

const generateGraph = (data, index) => {
    const graphArea = document.getElementById("graph-area");
    const graphCanvas = graphArea.querySelector("canvas");
    if (!graphCanvas) {
        clearInfoArea("Error");
        return;
    }
    clearChart();

    const chartData = data.map(log => ({
        x: new Date(log.createdAt),
        y: log.float
    }));
    console.log(chartData);
    // put the graph in the graph-area div
    new Chart(graphCanvas, {
        type: 'line',
        data: {
            datasets: [{
                label: logFormatFloatsInfo[index] || 'Float Values',
                data: chartData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'MMM dd, yyyy',
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    min: chartData[0]?.x,
                    max: chartData[chartData.length - 1]?.x,
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: logFormatFloatsInfo[index] || 'Float Value'
                    }
                }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { mode: 'nearest', intersect: false }
            }
        }
    });
};


const renderDeviceInfo = async (device_id, name, location) => {
    if (!device_id || !name || !location) {
        clearInfoArea("Error getting logs");
        return;
    }

    console.log("getting device info for", device_id, name, location);
    const logs = await getLogs(device_id) || null;

    // Some of the data missing or not an array
    if (!Array.isArray(logs)) {
        clearInfoArea("Error getting logs");
        return;
    }

    // Clear the area and start putting stuff in it
    deviceInfoArea.innerHTML = "";

    // We render the title, then location, then graph area
    renderDeviceInfo_title(name, device_id);
    renderDeviceInfo_location(location);
    renderDeviceInfo_graphArea(logs);
    
    return;
}



clearInfoArea();



export { renderDeviceInfo };



