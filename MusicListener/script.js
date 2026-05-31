let songsStorage = [];   
let favoriteSongs = [];  
let albums = {};         
let currentSongIndex = -1;
let currentPlaylist = []; 

const audio = document.getElementById('mainAudio');
const audioUpload = document.getElementById('audioUpload');
const allSongsList = document.getElementById('allSongsList');
const favoriteSongsList = document.getElementById('favoriteSongsList');
const searchInput = document.getElementById('searchInput');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeText = document.getElementById('currentTime');
const durationTimeText = document.getElementById('durationTime');
const volumeBar = document.getElementById('volumeBar');
const playerTitle = document.getElementById('playerTitle');
const playerHeartBtn = document.getElementById('playerHeartBtn');

// Các phần tử phục vụ Modal Album tự chế
const albumModal = document.getElementById('albumModal');
const openAlbumModalBtn = document.getElementById('openAlbumModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const submitAlbumBtn = document.getElementById('submitAlbumBtn');
const newAlbumNameInput = document.getElementById('newAlbumNameInput');

// ==========================================
// KẾT NỐI INDEXEDDB (ĐỂ LƯU FILE NHẠC TRONG TRÌNH DUYỆT)
// ==========================================
let db;
const request = indexedDB.open("LocalMusicPlayerDB", 1);

request.onupgradeneeded = function(e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs", { keyPath: "id" });
    }
};

request.onsuccess = function(e) {
    db = e.target.result;
    loadSongsFromDB(); // Tự động load nhạc ra trang chủ khi mở web!
};

// Lưu nhạc vào cơ sở dữ liệu trình duyệt
function saveSongToDB(songObj) {
    const transaction = db.transaction(["songs"], "readwrite");
    const store = transaction.objectStore("songs");
    store.put(songObj);
}

// Lấy tất cả nhạc ra ngoài khi load trang
function loadSongsFromDB() {
    const transaction = db.transaction(["songs"], "readonly");
    const store = transaction.objectStore("songs");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function() {
        const savedSongs = getAllRequest.result;
        if(savedSongs && savedSongs.length > 0) {
            songsStorage = savedSongs.map(s => {
                // Chuyển đổi dữ liệu nhị phân (Blob) trở lại thành đường link URL để hát được
                s.url = URL.createObjectURL(s.fileBlob);
                return s;
            });
            currentPlaylist = [...songsStorage];
            favoriteSongs = songsStorage.filter(s => s.isLiked);
            
            // Đọc lại danh sách album từ localStorage cũ nếu có
            const savedAlbums = localStorage.getItem('music_albums');
            if(savedAlbums) albums = JSON.parse(savedAlbums);

            refreshAllLists();
        }
    };
}

// ==========================================
// TAB CONTROL & TÌM KIẾM
// ==========================================
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.menu-item.active').classList.remove('active');
        item.classList.add('active');
        document.querySelector('.tab-content.active').classList.remove('active');
        const target = item.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        if(target !== 'albums-tab') {
            document.getElementById('albumGrid').style.display = 'grid';
            document.getElementById('albumSongsList').style.display = 'none';
            document.getElementById('currentAlbumTitle').textContent = "Danh sách Album";
        }
    });
});

searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const filtered = songsStorage.filter(s => s.name.toLowerCase().includes(keyword));
    renderSongList(filtered, allSongsList);
});

// ==========================================
// TẢI FILE VÀ XỬ LÝ NHẠC TRANG CHỦ
// ==========================================
audioUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    let loadedCount = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileURL = URL.createObjectURL(file);
        
        const songObj = {
            id: 'song_' + Date.now() + '_' + Math.floor(Math.random() * 100000),
            name: file.name.replace(/\.[^/.]+$/, ""),
            isLiked: false,
            fileBlob: file // Lưu trực tiếp file nhị phân vào DB
        };

        songsStorage.push({ ...songObj, url: fileURL });
        saveSongToDB(songObj); // Cất vào két sắt trình duyệt
    }
    currentPlaylist = [...songsStorage];
    refreshAllLists();
});

function renderSongList(songs, containerElement) {
    if (songs.length === 0) {
        containerElement.innerHTML = `<p class="empty-msg">Danh sách trống.</p>`;
        return;
    }
    containerElement.innerHTML = '';
    songs.forEach((song, index) => {
        const div = document.createElement('div');
        div.className = `song-item ${currentSongIndex !== -1 && currentPlaylist[currentSongIndex]?.id === song.id ? 'playing' : ''}`;
        
        let albumOptions = `<option value="">+ Vào Album...</option>`;
        Object.keys(albums).forEach(name => {
            albumOptions += `<option value="${name}">${name}</option>`;
        });

        div.innerHTML = `
            <div class="song-left" onclick="playSongFromPlaylist('${song.id}', ${JSON.stringify(songs).replace(/"/g, '&quot;')})">
                <span class="song-index">${index + 1}</span>
                <span class="song-title-text">${song.name}</span>
            </div>
            <div>
                <button class="song-item-heart ${song.isLiked ? 'liked' : ''}" onclick="toggleLike('${song.id}')">
                    <i class="${song.isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <select class="add-to-album-select" onchange="addSongToAlbum(this, '${song.id}')">
                    ${albumOptions}
                </select>
            </div>
        `;
        containerElement.appendChild(div);
    });
}

// ==========================================
// BỘ ĐIỀU KHIỂN PLAYER CHUẨN
// ==========================================
function playSongFromPlaylist(songId, playlist) {
    currentPlaylist = playlist;
    currentSongIndex = currentPlaylist.findIndex(s => s.id === songId);
    const song = currentPlaylist[currentSongIndex];
    audio.src = song.url;
    audio.play();
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    playerTitle.textContent = song.name;
    if(song.isLiked) playerHeartBtn.classList.add('liked');
    else playerHeartBtn.classList.remove('liked');
    refreshActiveHighlight();
}

playBtn.addEventListener('click', () => {
    if (audio.src === '') return;
    if (audio.paused) { audio.play(); playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`; }
    else { audio.pause(); playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`; }
});

nextBtn.addEventListener('click', () => {
    if (currentSongIndex === -1 || currentPlaylist.length <= 1) return;
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSongFromPlaylist(currentPlaylist[currentSongIndex].id, currentPlaylist);
});

prevBtn.addEventListener('click', () => {
    if (currentSongIndex === -1 || currentPlaylist.length <= 1) return;
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSongFromPlaylist(currentPlaylist[currentSongIndex].id, currentPlaylist);
});

audio.addEventListener('ended', () => { nextBtn.click(); });

audio.addEventListener('timeupdate', () => {
    if(isNaN(audio.duration)) return;
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeText.textContent = formatTime(audio.currentTime);
    durationTimeText.textContent = formatTime(audio.duration);
});

progressBar.addEventListener('input', () => {
    if(audio.src === '') return;
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeBar.addEventListener('input', () => { audio.volume = volumeBar.value / 100; });
function formatTime(secs) {
    let m = Math.floor(secs / 60); let s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function toggleLike(songId) {
    const song = songsStorage.find(s => s.id === songId);
    if(song) {
        song.isLiked = !song.isLiked;
        favoriteSongs = songsStorage.filter(s => s.isLiked);
        
        // Lưu cập nhật trạng thái yêu thích vào két DB
        const {url, ...cleanObj} = song; // Tách url ảo ra trước khi lưu
        saveSongToDB(cleanObj);

        if(currentSongIndex !== -1 && currentPlaylist[currentSongIndex].id === songId) {
            if(song.isLiked) playerHeartBtn.classList.add('liked');
            else playerHeartBtn.classList.remove('liked');
        }
        refreshAllLists();
    }
}

playerHeartBtn.addEventListener('click', () => {
    if (currentSongIndex !== -1) toggleLike(currentPlaylist[currentSongIndex].id);
});

// ==========================================
// ĐIỀU KHIỂN MODAL TẠO ALBUM TỰ CHẾ (CUSTOM UI)
// ==========================================
openAlbumModalBtn.addEventListener('click', () => {
    albumModal.classList.add('show'); // Hiện hộp thoại riêng lên
    newAlbumNameInput.focus();
});

closeModalBtn.addEventListener('click', () => {
    albumModal.classList.remove('show'); // Ẩn hộp thoại đi
    newAlbumNameInput.value = "";
});

submitAlbumBtn.addEventListener('click', executeCreateAlbum);
newAlbumNameInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') executeCreateAlbum();
});

function executeCreateAlbum() {
    const albumName = newAlbumNameInput.value.trim();
    if (!albumName) return;
    
    if (albums[albumName]) {
        alert("Album này đã có sẵn rồi!");
        return;
    }
    
    albums[albumName] = [];
    localStorage.setItem('music_albums', JSON.stringify(albums)); // Lưu thông tin album
    
    albumModal.classList.remove('show');
    newAlbumNameInput.value = "";
    
    refreshAllLists();
}

function addSongToAlbum(selectElement, songId) {
    const albumName = selectElement.value;
    if(albumName === "") return;
    
    if (!albums[albumName].includes(songId)) {
        albums[albumName].push(songId);
        localStorage.setItem('music_albums', JSON.stringify(albums));
        alert(`Đã xếp vào album [${albumName}]`);
    } else {
        alert("Bài hát đã có trong album này!");
    }
    selectElement.value = "";
    refreshAllLists();
}

function renderAlbums() {
    const albumGrid = document.getElementById('albumGrid');
    const sidebarAlbumList = document.getElementById('sidebarAlbumList');
    albumGrid.innerHTML = ''; sidebarAlbumList.innerHTML = '';
    
    Object.keys(albums).forEach(name => {
        const sideDiv = document.createElement('div');
        sideDiv.className = 'sidebar-album-item';
        sideDiv.innerHTML = `<i class="fa-solid fa-compact-disc"></i> ${name}`;
        sideDiv.onclick = () => openAlbumDetails(name);
        sidebarAlbumList.appendChild(sideDiv);

        const card = document.createElement('div');
        card.className = 'album-card';
        card.innerHTML = `
            <i class="fa-solid fa-compact-disc"></i>
            <h3>${name}</h3>
            <p style="color: #b3b3b3; font-size: 0.8rem; margin-top:5px;">${albums[name].length} bài hát</p>
        `;
        card.onclick = () => openAlbumDetails(name);
        albumGrid.appendChild(card);
    });
}

function openAlbumDetails(name) {
    document.querySelector('.menu-item.active').classList.remove('active');
    document.querySelector('[data-target="albums-tab"]').classList.add('active');
    document.querySelector('.tab-content.active').classList.remove('active');
    document.getElementById('albums-tab').classList.add('active');

    document.getElementById('albumGrid').style.display = 'none';
    document.getElementById('albumSongsList').style.display = 'block';
    document.getElementById('currentAlbumTitle').textContent = `Album: ${name}`;

    const songIdsInAlbum = albums[name] || [];
    const songsInAlbum = songsStorage.filter(s => songIdsInAlbum.includes(s.id));
    renderSongList(songsInAlbum, document.getElementById('albumSongsContainer'));
}

document.getElementById('backToAlbumsBtn').addEventListener('click', () => {
    document.getElementById('albumGrid').style.display = 'grid';
    document.getElementById('albumSongsList').style.display = 'none';
    document.getElementById('currentAlbumTitle').textContent = "Danh sách Album";
});

// Làm mới giao diện
function refreshAllLists() {
    renderSongList(songsStorage, allSongsList);
    renderSongList(favoriteSongs, favoriteSongsList);
    renderAlbums();
}

function refreshActiveHighlight() {
    const playingItems = document.querySelectorAll('.song-item');
    playingItems.forEach(item => {
        const titleText = item.querySelector('.song-title-text').textContent;
        if(currentSongIndex !== -1 && currentPlaylist[currentSongIndex].name === titleText) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}