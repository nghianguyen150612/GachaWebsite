const signUpForm = document.querySelector("#SignUpForm");
const loginForm = document.querySelector("#LoginForm");
const logoutButton = document.querySelector("#LogoutButton");
const welcomeMessage = document.querySelector("#WelcomeMessage");
const wheel = document.querySelector("#wheel");
const spinBtn = document.querySelector("#spin-btn");
const modalOverlay = document.querySelector("#modal-overlay");
const closeModal = document.querySelector("#close-modal");
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

const SPIN_ROUNDS = 6;
const SLICE_DEGREE = 72;
const SPIN_DURATION = 4000;
const REDIRECT_DELAY = 1200;

const prizeConfig = {
  1: {
    label: "Ô 1",
    color: "#ff5722",
    url: "./Buyer/index.html"
  },
  2: {
    label: "Ô 2",
    color: "#4caf50",
    url: "./iTube/index.html"
  },
  3: {
    label: "Ô 3",
    color: "#2196f3",
    url: "./MusicListener/index.html"
  },
  4: {
    label: "Ô 4",
    color: "#9c27b0",
    url: "./Stream/index.html"
  },
  5: {
    label: "Ô 5",
    color: "#ffcd12",
    url: "./YourTime/index.html"
  }
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
    spinBtn.disabled = true;

    const prizeNumber = Math.floor(Math.random() * Object.keys(prizeConfig).length) + 1;
    const prize = prizeConfig[prizeNumber];
    const currentNormalizedRotation = normalizeDegree(currentRotation);
    const targetRotation = normalizeDegree(-(prizeNumber - 1) * SLICE_DEGREE);
    const extraRotation = SPIN_ROUNDS * 360 + normalizeDegree(targetRotation - currentNormalizedRotation);

    currentRotation += extraRotation;
    wheel.style.transform = "rotate(" + currentRotation + "deg)";

    setTimeout(function () {
      isSpinning = false;
      spinBtn.disabled = false;

      prizeDisplay.textContent = prize.label;
      prizeDisplay.style.color = prize.color;
      modalOverlay.classList.add("active");

      setTimeout(function () {
        window.location.href = prize.url;
      }, REDIRECT_DELAY);
    }, SPIN_DURATION);
  });
}

if (closeModal && modalOverlay) {
  closeModal.addEventListener("click", function () {
    modalOverlay.classList.remove("active");
  });
}

function normalizeDegree(degree) {
  return ((degree % 360) + 360) % 360;
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
