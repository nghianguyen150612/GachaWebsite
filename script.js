const selectElement = (selector, root = document) => root.querySelector(selector);
const USERS_KEY = "users_list";
const basePath = new URL(".", document.currentScript.src);

let currentRotation = 0;
let isSpinning = false;

initSignUp();
initLogin();
initSpinWheel();

function getUsersList() {
  const storedData = localStorage.getItem(USERS_KEY);
  if (!storedData) return [];

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.warn("Không đọc được danh sách người dùng:", error);
    return [];
  }
}

function saveUsersList(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function initSignUp() {
  const form = selectElement("#SignUpForm");
  if (form) form.addEventListener("submit", handleSignUp);
}

function handleSignUp(event) {
  event.preventDefault();
  clearError();

  const fullName = selectElement("#Name").value.trim();
  const username = selectElement("#Username").value.trim();
  const email = selectElement("#Email");
  const confirmEmail = selectElement("#ConfirmEmail").value.trim();
  const password = selectElement("#Password").value;
  const confirmPassword = selectElement("#ConfirmPassword").value;

  if (!email.checkValidity()) {
    showError("Email bạn nhập không đúng định dạng rồi.");
    return;
  }

  if (email.value.trim() !== confirmEmail) {
    showError("Email xác nhận không khớp với email ban đầu.");
    return;
  }

  if (password !== confirmPassword) {
    showError("Mật khẩu xác nhận không khớp.");
    return;
  }

  const users = getUsersList();
  const usernameExists = users.some((user) => user.username === username);
  if (usernameExists) {
    showError("Tên đăng nhập này đã có người dùng rồi.");
    return;
  }

  users.push({
    fullName,
    username,
    email: email.value.trim(),
    password,
  });

  saveUsersList(users);
  navigateTo("Login/LogIn.html");
}

function initLogin() {
  const form = selectElement("#LoginForm");
  if (form) form.addEventListener("submit", handleLogin);
}

function handleLogin(event) {
  event.preventDefault();
  clearError();

  const username = selectElement("#LoginUsername").value.trim();
  const password = selectElement("#LoginPassword").value;
  const user = getUsersList().find((item) => item.username === username);

  if (!user || user.password !== password) {
    showError("Sai tên đăng nhập hoặc mật khẩu rồi bạn ơi.");
    return;
  }

  navigateTo("MainPage/MainPage.html");
}

function initSpinWheel() {
  const wheel = selectElement("#wheel");
  const spinButton = selectElement("#spin-btn");
  const modal = selectElement("#modal-overlay");

  if (!wheel || !spinButton || !modal) return;

  const sites = Array.from(wheel.querySelectorAll(".slice")).map((slice) => ({
    name: selectElement("span", slice)?.textContent.trim() || slice.dataset.name,
    url: slice.dataset.url,
  }));

  spinButton.addEventListener("click", () => {
    if (isSpinning) return;

    const siteIndex = Math.floor(Math.random() * sites.length);
    const selectedSite = sites[siteIndex];

    isSpinning = true;
    spinButton.disabled = true;

    currentRotation += 2160 - siteIndex * 72 - (currentRotation % 360);
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      isSpinning = false;
      spinButton.disabled = false;

      const resultMessage = selectElement("#result-message");
      if (resultMessage) {
        resultMessage.textContent = `You have spun "${selectedSite.name}"!`;
      }

      modal.classList.add("active");
      setTimeout(() => navigateTo(selectedSite.url), 1500);
    }, 4000);
  });
}

function navigateTo(path) {
  window.location.href = new URL(path, basePath).href;
}

function showError(message) {
  const errorElement = selectElement("#FormError");
  if (errorElement) errorElement.textContent = message;
}

function clearError() {
  showError("");
}
