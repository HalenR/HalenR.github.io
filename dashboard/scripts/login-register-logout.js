import { displayMessageResponse, processResponse } from "./status-message.js";
import { renderDeviceList } from "./dashboard-list.js";
import { clearAreas } from "./clearing-data.js";

const url = "https://website.thermatechnology.com"; // Use this for production
//const url = "http://localhost:5000"; // Use this for development

const registerForm = document.getElementById("register-Form");
const loginForm = document.getElementById("login-Form");
const logoutbtn = document.getElementById("logout-btn");
const loginScreen = document.getElementById("login-mode");
const overlay = document.getElementById('mode-overlay');


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
    event.preventDefault();
    console.log("Login form submitted");

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        // Send login request
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

        // Check HTTP status first
        if (!response.ok) {
            console.error("❌ Login failed with HTTP status:", response.status);
            displayMessageResponse({ message: "Login failed" }, response.status);
            return;
        }

        // Safely parse response JSON
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            console.error("Failed to parse login response JSON:", parseError);
            displayMessageResponse({ message: "Error parsing server response" }, 0);
            return;
        }

        const loginSuccessful =
            result.success === true || result.message?.toLowerCase().includes("login successful");

        if (!loginSuccessful) {
            console.error("❌ Login failed according to server response:", result);
            displayMessageResponse({ message: result.message || "Login failed" }, response.status);
            return;
        }

        // ✅ Login successful
        console.log("✅ Login successful, hiding login screen...");
        loginScreen.classList.add("hidden");
        overlay.classList.add('hidden');

        // Optional helpers (safe with ?. in case not defined)
        renderDeviceList?.();

    } catch (error) {
        // Only triggered for network/JS errors
        console.error("Error during login:", error);
        displayMessageResponse({ message: "Error Logging In" }, error.status || 0);
    }
});


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