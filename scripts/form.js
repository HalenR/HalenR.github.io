const request_button = document.getElementById("main-requestdemo-button");
const exit_form_button = document.getElementById("main-requestdemo-form-exit");
const form = document.getElementById("main-requestdemo-form");
const body = document.body;

request_button.onclick = () => {
    form.classList.add("show-overlay-form");
    form.classList.remove("hide-overlay-form");
    body.classList.add("scrollbar-stop");
}
exit_form_button.onclick = () => {
    form.classList.add("hide-overlay-form")
    form.classList.remove("show-overlay-form");
    body.classList.remove("scrollbar-stop");
}