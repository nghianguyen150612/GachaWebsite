const tracks = [
  { title: "Music 1", file: "Music1.mp3" },
  { title: "Music 2", file: "Music2.mp3" },
  { title: "Music 3", file: "Music3.mp3" }
];

const audio = document.querySelector("#audioPlayer");
const trackTitle = document.querySelector("#trackTitle");
const playButton = document.querySelector("#playBtn");
const prevButton = document.querySelector("#prevBtn");
const nextButton = document.querySelector("#nextBtn");
const progressBar = document.querySelector("#progressBar");
const currentTime = document.querySelector("#currentTime");
const durationTime = document.querySelector("#durationTime");
const volumeBar = document.querySelector("#volumeBar");
const trackButtons = document.querySelectorAll(".track");

let currentTrackIndex = 0;

trackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    loadTrack(Number(button.dataset.index), true);
  });
});

playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

prevButton.addEventListener("click", () => {
  const previousIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(previousIndex, true);
});

nextButton.addEventListener("click", playNextTrack);

audio.addEventListener("play", () => {
  playButton.textContent = "Pause";
});

audio.addEventListener("pause", () => {
  playButton.textContent = "Play";
});

audio.addEventListener("loadedmetadata", updateDuration);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", playNextTrack);

progressBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
});

volumeBar.addEventListener("input", () => {
  audio.volume = Number(volumeBar.value) / 100;
});

function loadTrack(index, shouldPlay = false) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];

  audio.src = track.file;
  trackTitle.textContent = track.title;
  progressBar.value = 0;
  currentTime.textContent = "0:00";
  durationTime.textContent = "0:00";
  updateActiveTrack();

  if (shouldPlay) {
    audio.play();
  }
}

function playNextTrack() {
  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(nextIndex, true);
}

function updateProgress() {
  currentTime.textContent = formatTime(audio.currentTime);

  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
}

function updateDuration() {
  durationTime.textContent = formatTime(audio.duration);
}

function updateActiveTrack() {
  trackButtons.forEach((button, index) => {
    button.classList.toggle("active", index === currentTrackIndex);
  });
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}
