const $ = (selector) => document.querySelector(selector);
const appRoot = new URL(".", document.currentScript.src);

const storageKeys = {
  name: "registeredName",
  username: "registeredUsername",
  email: "registeredEmail",
  password: "registeredPassword",
  currentUser: "currentUsername"
};

const spinConfig = {
  rounds: 6,
  duration: 4000,
  redirectDelay: 1300
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
  const modal = $("#modal-overlay");

  const prizes = getWheelPrizes(wheel);

  if (spinButton && wheel && modal && prizes.length > 0) {
    spinButton.addEventListener("click", () => spinWheel(wheel, spinButton, modal, prizes));
  }

}

function getWheelPrizes(wheel) {
  if (!wheel) return [];

  return Array.from(wheel.querySelectorAll(".slice")).map((slice) => ({
    name: slice.dataset.name,
    url: slice.dataset.url
  }));
}

function spinWheel(wheel, spinButton, modal, prizes) {
  if (isSpinning) return;

  isSpinning = true;
  spinButton.disabled = true;

  const prizeIndex = Math.floor(Math.random() * prizes.length);
  const sliceDegree = 360 / prizes.length;
  const prize = prizes[prizeIndex];
  const targetRotation = normalizeDegree(-prizeIndex * sliceDegree);
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
