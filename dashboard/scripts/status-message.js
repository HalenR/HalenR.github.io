
// Quick function to display a message based on the response status

const displayMessageResponse = (response, status) => {
    const displayAll = false;
    const messageTimeOut = 5 * 1000; // 5 seconds
    const fadeOutTime = .5 * 1000; // 0.5 seconds
    if (status === 200 && !displayAll) {
        console.log("Response is OK, not displaying message");
        return;
    }
    console.log("Response is not ok status:", status);
    const message = response.message || 'An error occurred';
    const alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.style.position = 'fixed';
    alertBox.style.top = '15px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.width = '30%';
    alertBox.style.backgroundColor = '#f44336'; // red
    alertBox.style.color = 'white';
    alertBox.style.padding = '16px';
    alertBox.style.textAlign = 'center';
    alertBox.style.fontSize = '16px';
    alertBox.style.zIndex = '10000';
    alertBox.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    alertBox.style.borderRadius = '8px';
    alertBox.style.opacity = '1';
    alertBox.style.transition = `opacity ${fadeOutTime / 1000}s ease`;
    document.body.prepend(alertBox);

    // Start fade-out after timeout
    setTimeout(() => {
        alertBox.style.opacity = '0';

        // Wait for transition to finish before removing
        setTimeout(() => {
            alertBox.remove();
        }, fadeOutTime);
    }, messageTimeOut);
};


// Processes server responses and displays errors or statuses if needed, returns the result or "Success" when successful
const processResponse = async (response) => {
    const result = await response.json();
    displayMessageResponse(result, response.status);
    if (!(response.status === 200)) {
        return null;
    }
    return result || "Success";
}
 
export { displayMessageResponse, processResponse };