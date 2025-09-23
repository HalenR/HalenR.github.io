import { displayMessageResponse, processResponse } from "./status-message.js";
import { renderDeviceList } from "./dashboard-list.js";
import { clearAreas } from "./clearing-data.js";

const url = "https://website.thermatechnology.com"; // Use this for production
//const url = "http://localhost:5000"; // Use this for development

const registerForm = document.getElementById("register-Form");
const loginForm = document.getElementById("login-Form");
const logoutbtn = document.getElementById("logout-btn");
const loginScreen = document.getElementById("login-mode");


registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${url}/user/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            })
        });

        const result = await processResponse(response);
        if (!result) {
            return;
        }

        console.log("Registration Success:", result);
        hideModes();

    } catch (error) {
        displayMessageResponse({message: "Error Registering"}, response.status);
        console.log("Error during registration:", error);
    }
});

loginForm.addEventListener("submit", async (event) => {
    console.log("Login form submitted");
    event.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${url}/user/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            })
        });

        const result = await processResponse(response);
        if (!result) {
            return;
        }
        // loginScreen.classList.add('hidden');
        hideModes();

        // Assuming you successfully logged in, we should render the users device list
        renderDeviceList();

        if (result) {
            console.log("✅ Login successful, hiding login screen...");
            loginScreen.classList.add("hidden");   // <hides the whole box
            hideModes?.();
            renderDeviceList?.();
        }


    } catch (error) {
    console.error("Error during login:", error);

    // use error, not response
    displayMessageResponse(
        { message: "Error Logging In" },
        error.status || 0
    );
};

logoutbtn.addEventListener("click", async () => {
    clearAreas();
    try {
        const response = await fetch(`${url}/user/logout`, {
            method: "POST",
            credentials: "include",
        });

        const result = await processResponse(response);
        if (!result) {
            return;
        }

        console.log("Logout Success:", result);

    } catch (error) {
        console.log("Error during logout:", error);
    }
});