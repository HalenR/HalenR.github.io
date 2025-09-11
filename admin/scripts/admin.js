//const url = "https://website2.thermatechnology.com"; // Use this for production
const url = "http://localhost:5000"; // Use this for development

const loginForm = document.getElementById("login-Form");
const logoutbtn = document.getElementById("logout-btn");
const createDeviceForm = document.getElementById("create-device-form");
const deleteDeviceBtn = document.getElementById("delete-device-btn");
const addDeviceToAccountForm = document.getElementById("add-device-user-form");
const removeDeviceFromAccountForm = document.getElementById("remove-device-user-form");


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

createDeviceForm.addEventListener("submit", async (event) => {
    console.log("Create Device form submitted");
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${url}/device`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                deviceName: data.name,
                password: data.password,
                deviceKey: data.key,
                location: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Device Creation failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Device Creation Success");
        console.log(result);

    } catch (error) {
        console.log("Error during device creation:", error);
    }
});


deleteDeviceBtn.addEventListener("click", async () => {
    const device_id = document.getElementById("delete-device-id").value;
    if (!device_id) {
        console.log("Please enter a device ID");
        return;
    }

    try {
        const response = await fetch(`${url}/device?device_id=${encodeURIComponent(device_id)}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Deleting Device failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Deleting Device success:");
        console.log(result);

    } catch (error) {
        console.log("Error during Deleting Device:", error);
    }
});


addDeviceToAccountForm.addEventListener("submit", async (event) => {
    console.log("Add Device To Account form submitted");
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${url}/admin`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: data.name,
                device_id: data.device_id,
                user_id: data.user_id,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Add Device To Account failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Add Device To Account Success");
        console.log(result);

    } catch (error) {
        console.log("Error during Add Device To Account:", error);
    }
});


removeDeviceFromAccountForm.addEventListener("submit", async (event) => {
    console.log("Remove Device From Account form submitted");
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Constructing query parameters
    const query = new URLSearchParams({
        device_id: data.device_id,
        user_id: data.user_id,
    }).toString();

    console.log("Query Parameters:", query);
    try {
        const response = await fetch(`${url}/admin?${query}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Remove Device From Account failed:", error);
            return;
        }

        const result = await response.json();
        console.log("Remove Device From Account Success");
        console.log(result);

    } catch (error) {
        console.log("Error during Remove Device From Account:", error);
    }
});