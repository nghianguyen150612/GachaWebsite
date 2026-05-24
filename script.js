const websites = [
  { name: "Buyer", url: "./Buyer/index.html" },
  { name: "iTube", url: "./iTube/index.html" },
  { name: "MusicListener", url: "./MusicListener/index.html" },
  { name: "Stream", url: "./Stream/index.html" },
  { name: "YourTime", url: "./YourTime/index.html" }
];

const form = document.querySelector("#SignUpForm");
const email = document.querySelector("#Email");
const password = document.querySelector("#Password");
const confirmPassword = document.querySelector("#ConfirmPassword");
const errorMessage = document.querySelector("#FormError");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!email.checkValidity()) {
    showError("Email khong hop le");
    return;
  }

  if (password.value !== confirmPassword.value) {
    showError("Mat khau xac nhan khong khop");
    return;
  }

  goToRandomWebsite();
});

function goToRandomWebsite() {
  const resultIndex = Math.floor(Math.random() * websites.length);
  window.location.href = websites[resultIndex].url;
}

function showError(message) {
  errorMessage.textContent = message;
}
