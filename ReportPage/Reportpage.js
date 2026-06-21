const reportForm = document.getElementById("reportForm");
const successMessage = document.getElementById("successMessage");
const clearBtn = document.getElementById("clearBtn");

reportForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  successMessage?.classList.add("show");
  setTimeout(() => successMessage?.classList.remove("show"), 4000);

  reportForm.reset();
});

clearBtn?.addEventListener("click", () => reportForm?.reset());
