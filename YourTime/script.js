// ==========================================
// 1. CHỨC NĂNG CHẠY ĐỒNG HỒ LOCAL
// ==========================================
function updateClock() {
    const now = new Date();
    const digitalClock = document.getElementById('digitalClock');
    const dateDisplay = document.getElementById('dateDisplay');

    if (digitalClock && dateDisplay) {
        digitalClock.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        dateDisplay.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        updateTimeZoneRow(now, 'America/New_York', 'newYorkTime', 'newYorkDiff');
        updateTimeZoneRow(now, 'Europe/London', 'londonTime', 'londonDiff');
    }
}
updateClock();
setInterval(updateClock, 1000);

function updateTimeZoneRow(now, timeZone, timeElementId, diffElementId) {
    const timeElement = document.getElementById(timeElementId);
    const diffElement = document.getElementById(diffElementId);

    if (!timeElement || !diffElement) {
        return;
    }

    timeElement.textContent = now.toLocaleTimeString('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const hourDiff = getHourDifferenceFromLocal(now, timeZone);
    diffElement.textContent = formatTimeDifference(hourDiff);
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
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const parts = {};

    formatter.formatToParts(date).forEach(part => {
        if (part.type !== 'literal') {
            parts[part.type] = Number(part.value);
        }
    });

    return parts;
}

function formatTimeDifference(hourDiff) {
    if (hourDiff === 0) {
        return 'Same as local time';
    }

    const absoluteHours = Math.abs(hourDiff);
    const unit = absoluteHours === 1 ? 'hour' : 'hours';
    const direction = hourDiff > 0 ? 'ahead of' : 'behind';

    return `${absoluteHours} ${unit} ${direction} local time`;
}


// ==========================================
// 2. CHỨC NĂNG CHUYỂN ĐỔI TAB (TABS SWITCHER)
// ==========================================
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.menu-item.active').classList.remove('active');
        item.classList.add('active');

        document.querySelector('.tab-content.active').classList.remove('active');
        const targetTabId = item.getAttribute('data-target');
        document.getElementById(targetTabId).classList.add('active');
    });
});


// ==========================================
// 3. CHỨC NĂNG TIMER (HẸN GIỜ ĐẾM NGƯỢC)
// ==========================================
let timerInterval = null;
let timerSeconds = 300; // Mặc định thử nghiệm là 5 phút (5 * 60 giây)
let isTimerRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const startTimerBtn = document.getElementById('startTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');

function updateTimerDisplay() {
    let m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    let s = String(timerSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

startTimerBtn.addEventListener('click', () => {
    if (!isTimerRunning) {
        // Bắt đầu chạy đếm ngược
        isTimerRunning = true;
        startTimerBtn.textContent = 'Pause';
        
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                // Khi đếm về 0
                clearInterval(timerInterval);
                alert("Hết giờ rồi!");
                isTimerRunning = false;
                startTimerBtn.textContent = 'Start';
                timerSeconds = 300;
                updateTimerDisplay();
            }
        }, 1000);
    } else {
        // Tạm dừng (Pause)
        clearInterval(timerInterval);
        isTimerRunning = false;
        startTimerBtn.textContent = 'Start';
    }
});

resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 300; // Reset về lại 5 phút
    updateTimerDisplay();
    startTimerBtn.textContent = 'Start';
});


// ==========================================
// 4. CHỨC NĂNG STOPWATCH (BẤM GIỜ TIẾN)
// ==========================================
let stopwatchInterval = null;
let stopwatchElapsedTime = 0; // Đơn vị: mili giây
let isStopwatchRunning = false;

const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const startStopwatchBtn = document.getElementById('startStopwatchBtn');
const resetStopwatchBtn = document.getElementById('resetStopwatchBtn');

function updateStopwatchDisplay() {
    let totalSeconds = stopwatchElapsedTime / 1000;
    let m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    let s = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
    // Lấy 2 số đầu của mili giây (ms / 10)
    let ms = String(Math.floor((stopwatchElapsedTime % 1000) / 10)).padStart(2, '0');
    
    stopwatchDisplay.textContent = `${m}:${s}.${ms}`;
}

startStopwatchBtn.addEventListener('click', () => {
    if (!isStopwatchRunning) {
        // Bắt đầu bấm giờ
        isStopwatchRunning = true;
        startStopwatchBtn.textContent = 'Pause';
        
        let startTime = Date.now() - stopwatchElapsedTime;
        
        stopwatchInterval = setInterval(() => {
            stopwatchElapsedTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10); // Cập nhật sau mỗi 10 mili giây để số nhảy mượt
    } else {
        // Tạm dừng
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        startStopwatchBtn.textContent = 'Start';
    }
});

resetStopwatchBtn.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    stopwatchElapsedTime = 0;
    updateStopwatchDisplay();
    startStopwatchBtn.textContent = 'Start';
});
