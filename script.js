const $ = (selector) => document.querySelector(selector);
const appRoot = new URL(".", document.currentScript.src);

const storageKeys = {
  name: "registeredName",
  username: "registeredUsername",
  email: "registeredEmail",
  password: "registeredPassword",
  currentUser: "currentUsername"
};

const prizes = [
  { name: "Buyer", color: "#ff5722", url: "Buyer/" },
  { name: "iTube", color: "#4caf50", url: "iTube/" },
  { name: "MusicListener", color: "#2196f3", url: "MusicListener/" },
  { name: "Stream", color: "#9c27b0", url: "Stream/" },
  { name: "YourTime", color: "#ffeb3b", textColor: "#333333", url: "YourTime/" }
];

const spinConfig = {
  rounds: 6,
  duration: 4000,
  redirectDelay: 1300,
  sliceDegree: 360 / prizes.length
};

let currentRotation = 0;
let isSpinning = false;

initSignUp();
initLogin();
initMainPage();
initWheel();

function initSignUp() {
  const form = $("#SignUpForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const name = $("#Name");
    const username = $("#Username");
    const email = $("#Email");
    const password = $("#Password");
    const confirmPassword = $("#ConfirmPassword");

    if (!email.checkValidity()) {
      showError("Invalid email address");
      return;
    }

    if (password.value !== confirmPassword.value) {
      showError("Password mismatch");
      return;
    }

    sessionStorage.setItem(storageKeys.name, name.value.trim());
    sessionStorage.setItem(storageKeys.username, username.value.trim());
    sessionStorage.setItem(storageKeys.email, email.value.trim());
    sessionStorage.setItem(storageKeys.password, password.value);
    navigateTo("Login/");
  });
}

function initLogin() {
  const form = $("#LoginForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const username = $("#LoginUsername").value.trim();
    const password = $("#LoginPassword").value;
    const savedUsername = sessionStorage.getItem(storageKeys.username);
    const savedPassword = sessionStorage.getItem(storageKeys.password);

    if (username !== savedUsername || password !== savedPassword) {
      showError("Username or password is incorrect");
      return;
    }

    sessionStorage.setItem(storageKeys.currentUser, username);
    navigateTo("MainPage/");
  });
}

function initMainPage() {
  const welcomeMessage = $("#WelcomeMessage");
  const logoutButton = $("#LogoutButton");

  if (welcomeMessage) {
    const currentUser = sessionStorage.getItem(storageKeys.currentUser);

    if (!currentUser) {
      navigateTo("Login/");
      return;
    }

    welcomeMessage.textContent = `Welcome, ${currentUser}!`;
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem(storageKeys.currentUser);
      navigateTo("Login/");
    });
  }
}

function initWheel() {
  const wheel = $("#wheel");
  const spinButton = $("#spin-btn");
  const closeModal = $("#close-modal");
  const modal = $("#modal-overlay");

  if (wheel) renderWheel(wheel);

  if (spinButton && wheel && modal) {
    spinButton.addEventListener("click", () => spinWheel(wheel, spinButton, modal));
  }

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => modal.classList.remove("active"));
  }
}

function renderWheel(wheel) {
  wheel.textContent = "";

  prizes.forEach((prize, index) => {
    const slice = document.createElement("div");
    const label = document.createElement("span");

    slice.className = "slice";
    slice.style.setProperty("--slice-color", prize.color);
    slice.style.setProperty("--slice-rotation", `${index * spinConfig.sliceDegree}deg`);
    slice.style.setProperty("--slice-text-color", prize.textColor || "#ffffff");

    label.textContent = prize.name;
    slice.appendChild(label);
    wheel.appendChild(slice);
  });
}

function spinWheel(wheel, spinButton, modal) {
  if (isSpinning) return;

  isSpinning = true;
  spinButton.disabled = true;

  const prizeIndex = Math.floor(Math.random() * prizes.length);
  const prize = prizes[prizeIndex];
  const targetRotation = normalizeDegree(-prizeIndex * spinConfig.sliceDegree);
  const extraRotation = spinConfig.rounds * 360 + normalizeDegree(targetRotation - normalizeDegree(currentRotation));

  currentRotation += extraRotation;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    spinButton.disabled = false;
    showPrize(prize, modal);

    setTimeout(() => {
      navigateTo(prize.url);
    }, spinConfig.redirectDelay);
  }, spinConfig.duration);
}

function showPrize(prize, modal) {
  const resultMessage = $("#result-message");

  if (resultMessage) {
    resultMessage.textContent = `You have spun "${prize.name}".`;
    resultMessage.style.color = prize.textColor || prize.color;
  }

  modal.classList.add("active");
}

function normalizeDegree(degree) {
  return ((degree % 360) + 360) % 360;
}

function navigateTo(path) {
  window.location.href = new URL(path, appRoot).href;
}

function showError(message) {
  const errorMessage = $("#FormError");

  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

function clearError() {
  showError("");
}
