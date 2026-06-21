const videoCards = document.querySelectorAll(".video-card");
const modal = document.getElementById("videoModal");
const closeBtn = document.getElementById("closeModal");
const videoPlayer = document.getElementById("videoPlayer");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const baseDir = new URL(".", window.location.href).href;
const videoSources = ["video1", "video2", "video3", "video4"].map(
  (name) => new URL(`videos/${name}.mp4`, baseDir).href
);

document.querySelectorAll(".video-thumbnail img").forEach((image) => {
  const src = image.getAttribute("src");
  if (src && isLocalPath(src)) image.src = new URL(src, baseDir).href;
});

videoCards.forEach((card) => {
  card.addEventListener("click", () => openVideo(card));
});

closeBtn?.addEventListener("click", closeVideoModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeVideoModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("active")) {
    closeVideoModal();
  }
});

function openVideo(card) {
  if (!modal || !videoPlayer || !modalTitle || !modalDescription) return;

  const videoId = Number(card.dataset.videoId);
  modalTitle.textContent = card.dataset.title;
  modalDescription.textContent = card.dataset.description;
  videoPlayer.src = videoSources[videoId];

  modal.classList.add("active");
  videoPlayer.play();
}

function closeVideoModal() {
  modal?.classList.remove("active");
  videoPlayer?.pause();
}

function isLocalPath(path) {
  return !path.startsWith("http") && !path.startsWith("file") && !path.startsWith("/");
}
