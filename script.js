const intro = document.getElementById('intro');
const centerText = intro.querySelector('.center-text');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const switchBtn = document.getElementById('switch');

const songs = [
  {
    title: "Song 1",
    artist: "Artist 1",
    cover: "Assets/cover1.jpg",
    src: "Assets/song1.mp3",
    spotifyTrack: "https://open.spotify.com/track/...",
    spotifyArtist: "https://open.spotify.com/artist/..."
  },
  {
    title: "Song 2",
    artist: "Artist 2",
    cover: "Assets/cover2.jpg",
    src: "Assets/song2.mp3",
    spotifyTrack: "https://open.spotify.com/track/...",
    spotifyArtist: "https://open.spotify.com/artist/..."
  },
  {
    title: "Song 3",
    artist: "Artist 3",
    cover: "Assets/cover3.jpg",
    src: "Assets/song3.mp3",
    spotifyTrack: "https://open.spotify.com/track/...",
    spotifyArtist: "https://open.spotify.com/artist/..."
  }
];

// ---------------- Slider / Karten ----------------
let current = 0;
const total = cards.length;

// URL Parameter für Karte
const params = new URLSearchParams(window.location.search);
const paramCard = parseInt(params.get('card'));
if (!isNaN(paramCard) && paramCard >= 0 && paramCard < total) {
    current = paramCard;
}

// Cursor setzen
function setCursor(fileName) {
    const path = `Assets/${fileName}`;
    document.body.style.cursor = `url('${path}'), auto`;
    document.querySelectorAll('a, button').forEach(el => {
        el.style.cursor = `url('${path}'), pointer`;
    });
}

// Intro Countdown
function startIntroCountdown() {
    let count = 3;
    centerText.textContent = count;
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            centerText.textContent = count;
        } else {
            clearInterval(interval);
            centerText.textContent = 'Click';
            intro.addEventListener('click', introClickHandler);
        }
    }, 1000);
}

// Intro Klick-Handler
// Intro Klick-Handler
function introClickHandler() {
    intro.removeEventListener('click', introClickHandler);
    intro.style.opacity = 0;
    setTimeout(() => intro.style.display = 'none', 1000);

    slider.classList.add('active');

    // Zufälligen Song auswählen und laden
    currentSongIndex = Math.floor(Math.random() * songs.length);
    loadSong(currentSongIndex);

    showCard(current);

    // -------- Auto Counter starten --------
    startAutoCounter();
}


// Switch Button
switchBtn.addEventListener('click', () => {
    current = (current + 1) % total;
    showCard(current);
});

// Swipe Support
let startX = 0;
window.addEventListener('touchstart', e => startX = e.touches[0].clientX);
window.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
        current = diff < 0 ? (current + 1) % total : (current - 1 + total) % total;
        showCard(current);
    }
});

// Zeigt Karte & Video-Wechsel
function showCard(index) {
    cards.forEach((card, i) => card.classList.toggle('active', i === index));
    const activeCard = cards[index];
    if (activeCard && !activeCard.contains(switchBtn)) activeCard.appendChild(switchBtn);

    const color = activeCard.dataset.color || '#ff66cc';
    activeCard.style.setProperty('--card-color', color);

    const cursorFile = activeCard.dataset.cursor || 'cursor-default.cur';
    setCursor(cursorFile);

    const newVideoSrc = activeCard.dataset.video;
    if (!bgVideoNext.querySelector('source').src.includes(newVideoSrc)) {
        bgVideoNext.querySelector('source').src = newVideoSrc;
        bgVideoNext.load();
        bgVideoNext.classList.remove('hidden');
        bgVideoNext.style.opacity = 0;
        setTimeout(() => {
            bgVideoNext.style.transition = 'opacity 1s ease';
            bgVideoNext.style.opacity = 1;
        }, 50);
        setTimeout(() => {
            bgVideo.querySelector('source').src = newVideoSrc;
            bgVideo.load();
            bgVideoNext.classList.add('hidden');
            bgVideoNext.style.transition = '';
            bgVideoNext.style.opacity = 0;
        }, 1050);
    }
}

// ---------------- Besucher-Zähler ----------------

// Auto Counter
function startAutoCounter() {
  const startDate = new Date('2025-11-01T00:00:00Z');
  const dailyIncrease = 10;
  const randomMax = 30;
  const baseViews = [1200, 200];

  const visitorElems = document.querySelectorAll(".visitor-count");
  const randomOffsets = Array.from(visitorElems).map(() => Math.floor(Math.random() * randomMax) + 1);

  function updateCounts() {
    const now = new Date();
    const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

    visitorElems.forEach((el, i) => {
      const count = (baseViews[i] || 100) + randomOffsets[i] + Math.max(0, daysPassed) * dailyIncrease;
      el.textContent = count;
    });
  }

  updateCounts();
  setInterval(updateCounts, 1000 * 60 * 60); // jede Stunde aktualisieren
}

startAutoCounter();

// ---------------- Media Player ----------------
let currentSongIndex;
const audio = new Audio();
const playerCover = document.getElementById("player-cover");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  playerCover.src = song.cover;
  playerTitle.textContent = song.title;
  playerTitle.href = song.spotifyTrack;
  playerArtist.textContent = song.artist;
  playerArtist.href = song.spotifyArtist;
  playPauseBtn.textContent = "▶️"; // Start-Button
}

// Play/Pause
function playPause() {
  if(audio.paused){
    audio.play();
    playPauseBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  }
}

// Nächster / Vorheriger Song
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playPauseBtn.textContent = "⏸️";
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playPauseBtn.textContent = "⏸️";
}

// Event Listener
playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
volumeSlider.addEventListener("input", e => audio.volume = e.target.value);

// Klick auf Cover/Title/Artist öffnet Spotify-Links
playerCover.addEventListener("click", () => window.open(songs[currentSongIndex].spotifyTrack, "_blank"));
playerTitle.addEventListener("click", () => window.open(songs[currentSongIndex].spotifyTrack, "_blank"));
playerArtist.addEventListener("click", () => window.open(songs[currentSongIndex].spotifyArtist, "_blank"));

// Song automatisch weiterspielen
audio.addEventListener("ended", nextSong);

// ---------------- Start Intro ----------------
startIntroCountdown();
