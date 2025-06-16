const url = "https://website2.thermatechnology.com"; // Use this for production


const registerForm = document.getElementById("register-Form");
const loginForm = document.getElementById("login-Form");
const getDevicesbtn = document.getElementById("get-devices");
const getLogsbtn = document.getElementById("get-logs-btn");
const logoutbtn = document.getElementById("logout-btn");
const renameForm = document.getElementById("rename-device-form");



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

        if (!response.ok) {
            const error = await response.json();
            console.log("Registration failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Registration Success:", result);

    } catch (error) {
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

        if (!response.ok) {
            const error = await response.json();
            console.log("Login failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Login Success");
        console.log(result);

    } catch (error) {
        console.log("Error during login:", error);
    }
});


getDevicesbtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${url}/user/devices`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Getting device failed:", error);
            return;
        }

        const result = await response.json();
        console.log("getting device success:", result);

    } catch (error) {
        console.log("Error during getting device:", error);
    }
});


getLogsbtn.addEventListener("click", async () => {
    const device_id = document.getElementById("device-id").value;
    console.log("Device ID:", device_id);
    if (!device_id) {
        console.log("Please enter a device ID");
        return;
    }

    try {
        const response = await fetch(`${url}/log?device_id=${encodeURIComponent(device_id)}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Getting logs failed:", error);
            return;
        }

        const result = await response.json();
        console.log("getting logs success:");
        console.log(result);

    } catch (error) {
        console.log("Error during getting logs:", error);
    }
});


logoutbtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${url}/user/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Logout failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Logout Success:", result);

    } catch (error) {
        console.log("Error during logout:", error);
    }
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

        if (!response.ok) {
            const error = await response.json();
            console.log("Rename failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Rename Success");
        console.log(result);

    } catch (error) {
        console.log("Error during rename:", error);
    }
});
