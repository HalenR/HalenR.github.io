const overlay = document.getElementById('mode-overlay');
const loginMode = document.getElementById('login-mode');
const registerMode = document.getElementById('register-mode');

// Buttons that trigger modes
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');

function showMode(mode) {
  overlay.classList.remove('hidden');
  mode.classList.remove('hidden');
  document.body.classList.add('mode-open');
}

function hideModes() {
  overlay.classList.add('hidden');
  loginMode.classList.add('hidden');
  registerMode.classList.add('hidden');
  document.body.classList.remove('mode-open');
}

loginBtn.addEventListener('click', () => showMode(loginMode));
registerBtn.addEventListener('click', () => showMode(registerMode));

// Close buttons inside modes
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', hideModes);
});

// Close if user clicks outside the mode
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) hideModes();
});

// Optional: close with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideModes();
});