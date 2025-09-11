const deviceListDiv = document.getElementById("device-list-devices");
const deviceInfoArea = document.getElementById("device-info");

const clearAreas = () => {
    deviceListDiv.innerHTML = "";
    const listAreaClearMessage = document.createElement("p");
    clearInfoArea();
    deviceListDiv.appendChild(listAreaClearMessage);
};
const clearChart = () => {
    const graphArea = document.getElementById("graph-area");
    if (!graphArea) {
        return;
    }
    const graphCanvas = graphArea.querySelector("canvas");
    const existingChart = Chart.getChart(graphCanvas); // or Chart.getChart("graph-area")

    if (existingChart) {
        existingChart.destroy();
    }
}
const clearInfoArea = (message) => {
    clearChart();

    const areaMessage = message || "Please Select a Device"
    deviceInfoArea.innerHTML = "";
    const infoAreaClearMessage = document.createElement("p");
    infoAreaClearMessage.textContent = areaMessage;
    deviceInfoArea.appendChild(infoAreaClearMessage);
};


export { clearAreas, clearInfoArea, clearChart };