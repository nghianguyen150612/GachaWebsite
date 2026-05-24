const signUpForm = document.querySelector("#SignUpForm");
const loginForm = document.querySelector("#LoginForm");
const logoutButton = document.querySelector("#LogoutButton");
const welcomeMessage = document.querySelector("#WelcomeMessage");
const wheel = document.querySelector("#wheel");
const spinBtn = document.querySelector("#spin-btn");
const modalOverlay = document.querySelector("#modal-overlay");
const closeModal = document.querySelector("#close-modal");
const claimBtn = document.querySelector("#claim-btn");
const prizeDisplay = document.querySelector("#prize-display");
const nameInput = document.querySelector("#Name");
const username = document.querySelector("#Username");
const email = document.querySelector("#Email");
const password = document.querySelector("#Password");
const confirmPassword = document.querySelector("#ConfirmPassword");
const errorMessage = document.querySelector("#FormError");

const REGISTERED_NAME_KEY = "registeredName";
const REGISTERED_USERNAME_KEY = "registeredUsername";
const REGISTERED_EMAIL_KEY = "registeredEmail";
const REGISTERED_PASSWORD_KEY = "registeredPassword";
const CURRENT_USERNAME_KEY = "currentUsername";

let currentRotation = 0;
let isSpinning = false;

const prizeConfig = {
  "Ô 1": "#ff5722",
  "Ô 2": "#4caf50",
  "Ô 3": "#2196f3",
  "Ô 4": "#9c27b0",
  "Ô 5": "#ffcd12"
};

if (signUpForm) {
  signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    if (!email.checkValidity()) {
      showError("Email khong hop le");
      return;
    }

    if (password.value !== confirmPassword.value) {
      showError("Mat khau xac nhan khong khop");
      return;
    }

    sessionStorage.setItem(REGISTERED_NAME_KEY, nameInput.value.trim());
    sessionStorage.setItem(REGISTERED_USERNAME_KEY, username.value.trim());
    sessionStorage.setItem(REGISTERED_EMAIL_KEY, email.value.trim());
    sessionStorage.setItem(REGISTERED_PASSWORD_KEY, password.value);
    window.location.href = "Login.html";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const loginUsername = document.querySelector("#LoginUsername").value.trim();
    const loginPassword = document.querySelector("#LoginPassword").value;
    const registeredUsername = sessionStorage.getItem(REGISTERED_USERNAME_KEY);
    const registeredPassword = sessionStorage.getItem(REGISTERED_PASSWORD_KEY);

    if (loginUsername !== registeredUsername || loginPassword !== registeredPassword) {
      showError("Username hoac mat khau khong dung");
      return;
    }

    sessionStorage.setItem(CURRENT_USERNAME_KEY, loginUsername);
    window.location.href = "MainPage.html";
  });
}

if (welcomeMessage) {
  const currentUsername = sessionStorage.getItem(CURRENT_USERNAME_KEY);

  if (!currentUsername) {
    window.location.href = "Login.html";
  } else {
    welcomeMessage.textContent = "Welcome, " + currentUsername + "!";
  }
}

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem(CURRENT_USERNAME_KEY);
    window.location.href = "Login.html";
  });
}

if (spinBtn && wheel && modalOverlay && prizeDisplay) {
  spinBtn.addEventListener("click", function () {
    if (isSpinning) {
      return;
    }

    isSpinning = true;

    const randomDegree = Math.floor(Math.random() * 360) + 1800;
    currentRotation += randomDegree;
    wheel.style.transform = "rotate(" + currentRotation + "deg)";

    setTimeout(function () {
      isSpinning = false;

      const actualDegree = currentRotation % 360;
      const prizeNumber = Math.floor(((360 - actualDegree) % 360) / 72) + 1;
      const prize = "Ô " + prizeNumber;

      prizeDisplay.textContent = prize;
      prizeDisplay.style.color = prizeConfig[prize];
      modalOverlay.classList.add("active");
    }, 4000);
  });
}

if (closeModal && modalOverlay) {
  closeModal.addEventListener("click", function () {
    modalOverlay.classList.remove("active");
  });
}

if (claimBtn && modalOverlay) {
  claimBtn.addEventListener("click", function () {
    modalOverlay.classList.remove("active");
  });
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

function clearError() {
  if (errorMessage) {
    errorMessage.textContent = "";
  }
}
