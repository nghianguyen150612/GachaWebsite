const LOCALE = "vi-VN";
const DEFAULT_TIMER_SECONDS = 300;
const getElement = (id) => document.getElementById(id);

const timeZones = [
  {
    zone: "America/New_York",
    timeId: "newYorkTime",
    diffId: "newYorkDiff",
  },
  {
    zone: "Europe/London",
    timeId: "londonTime",
    diffId: "londonDiff",
  },
];

let timerInterval = null;
let timerSeconds = DEFAULT_TIMER_SECONDS;
let isTimerRunning = false;

let stopwatchInterval = null;
let stopwatchElapsedTime = 0;
let isStopwatchRunning = false;

const timerDisplay = getElement("timerDisplay");
const startTimerBtn = getElement("startTimerBtn");
const resetTimerBtn = getElement("resetTimerBtn");
const stopwatchDisplay = getElement("stopwatchDisplay");
const startStopwatchBtn = getElement("startStopwatchBtn");
const resetStopwatchBtn = getElement("resetStopwatchBtn");

updateClock();
updateTimerDisplay();
updateStopwatchDisplay();

setInterval(updateClock, 1000);
startTimerBtn?.addEventListener("click", toggleTimer);
resetTimerBtn?.addEventListener("click", resetTimer);
startStopwatchBtn?.addEventListener("click", toggleStopwatch);
resetStopwatchBtn?.addEventListener("click", resetStopwatch);

function updateClock() {
  const now = new Date();
  const digitalClock = getElement("digitalClock");
  const dateDisplay = getElement("dateDisplay");

  if (!digitalClock || !dateDisplay) return;

  digitalClock.textContent = now.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  dateDisplay.textContent = now.toLocaleDateString(LOCALE, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  timeZones.forEach(({ zone, timeId, diffId }) => {
    updateTimeZoneRow(now, zone, timeId, diffId);
  });
}

function updateTimeZoneRow(now, timeZone, timeElementId, diffElementId) {
  const timeElement = getElement(timeElementId);
  const diffElement = getElement(diffElementId);

  if (!timeElement || !diffElement) return;

  timeElement.textContent = now.toLocaleTimeString(LOCALE, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  diffElement.textContent = formatTimeDifference(
    getHourDifferenceFromLocal(now, timeZone)
  );
}

function getHourDifferenceFromLocal(date, timeZone) {
  const localTime = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
  const zoneParts = getTimeZoneParts(date, timeZone);
  const zoneTime = Date.UTC(
    zoneParts.year,
    zoneParts.month - 1,
    zoneParts.day,
    zoneParts.hour,
    zoneParts.minute
  );

  return Math.round((zoneTime - localTime) / 3600000);
}

function getTimeZoneParts(date, timeZone) {
  const parts = {};
  const formatter = new Intl.DateTimeFormat(LOCALE, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  formatter.formatToParts(date).forEach((part) => {
    if (part.type !== "literal") parts[part.type] = Number(part.value);
  });

  return parts;
}

function formatTimeDifference(hourDiff) {
  if (hourDiff === 0) return "Trùng giờ địa phương";

  const direction = hourDiff > 0 ? "nhanh hơn" : "chậm hơn";
  return `${Math.abs(hourDiff)} giờ ${direction} giờ địa phương`;
}

function toggleTimer() {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    startTimerBtn.textContent = "Bắt đầu";
    return;
  }

  isTimerRunning = true;
  startTimerBtn.textContent = "Tạm dừng";
  timerInterval = setInterval(() => {
    if (timerSeconds <= 0) {
      showToast("Hết giờ rồi!");
      resetTimer();
      return;
    }

    timerSeconds--;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  if (!timerDisplay) return;
  timerDisplay.textContent = formatTimerSeconds(timerSeconds);
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = DEFAULT_TIMER_SECONDS;
  updateTimerDisplay();
  if (startTimerBtn) startTimerBtn.textContent = "Bắt đầu";
}

function formatTimerSeconds(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const restSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${restSeconds}`;
}

function toggleStopwatch() {
  if (isStopwatchRunning) {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    startStopwatchBtn.textContent = "Bắt đầu";
    return;
  }

  const startTime = Date.now() - stopwatchElapsedTime;
  isStopwatchRunning = true;
  startStopwatchBtn.textContent = "Tạm dừng";
  stopwatchInterval = setInterval(() => {
    stopwatchElapsedTime = Date.now() - startTime;
    updateStopwatchDisplay();
  }, 10);
}

function updateStopwatchDisplay() {
  if (!stopwatchDisplay) return;

  const totalSeconds = stopwatchElapsedTime / 1000;
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
  const milliseconds = String(Math.floor((stopwatchElapsedTime % 1000) / 10)).padStart(2, "0");

  stopwatchDisplay.textContent = `${minutes}:${seconds}.${milliseconds}`;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  isStopwatchRunning = false;
  stopwatchElapsedTime = 0;
  updateStopwatchDisplay();
  if (startStopwatchBtn) startStopwatchBtn.textContent = "Bắt đầu";
}

function showToast(message) {
  const toast = document.createElement("div");

  toast.className = "toast-message";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
