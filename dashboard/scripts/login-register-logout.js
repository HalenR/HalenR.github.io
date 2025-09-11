//const url = "https://website2.thermatechnology.com"; // Use this for production
const url = "http://localhost:5000"; // Use this for development

const registerForm = document.getElementById("register-Form");
const loginForm = document.getElementById("login-Form");
const logoutbtn = document.getElementById("logout-btn");


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

        console.log("Login Success");
        getDeviceList();
        console.log(result);
        hideModes();

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

        const result = await processResponse(response);
        if (!result) {
            return;
        }

        console.log("Logout Success:", result);

    } catch (error) {
        console.log("Error during logout:", error);
    }
});