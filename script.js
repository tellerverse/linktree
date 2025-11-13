const intro = document.getElementById('intro');
const centerText = intro.querySelector('.center-text');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const switchBtn = document.getElementById('switch');

const songs = [
  {
    title: "STANNI",
    artist: "Snake16",
    cover: "Assets/music/stannicover.jpg",
    src: "Assets/music/stanni.mp3",
    spotifyTrack: "https://open.spotify.com/track/4BMykUWuRBoX7yiIFPSFXH?si=927e3a4aa6074347",
    spotifyArtist: "https://open.spotify.com/artist/2fgyuNiQxXwzAoN8qLFCCf?si=EkNKiE61RaqVEoHUFUFUaw"
  },
  {
    title: "SAG VALLAH",
    artist: "Snake16",
    cover: "Assets/music/sagvallahcover.jpg",
    src: "Assets/music/sagvallah.mp3",
    spotifyTrack: "https://open.spotify.com/track/4GndsC4aWgsALl5sKq6dxY?si=aee1fb61de83427b",
    spotifyArtist: "https://open.spotify.com/artist/2fgyuNiQxXwzAoN8qLFCCf?si=EkNKiE61RaqVEoHUFUFUaw"
  }
];

let current = 0;
let currentSongIndex;
const total = cards.length;

// Cursor
function setCursor(fileName) {
  const path = `Assets/cursor/${fileName}`;
  document.body.style.cursor = `url('${path}'), auto`;
  document.querySelectorAll('a, button').forEach(el => el.style.cursor = `url('${path}'), pointer`);
}

// Intro Countdown
function startIntroCountdown() {
  let count = 3;
  centerText.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count > 0) centerText.textContent = count;
    else {
      clearInterval(interval);
      centerText.textContent = 'Click';
      intro.addEventListener('click', introClickHandler);
    }
  }, 1000);
}

// Intro Click
function introClickHandler() {
  intro.removeEventListener('click', introClickHandler);
  intro.style.opacity = 0;
  setTimeout(() => intro.style.display='none',1000);
  slider.classList.add('active');
  currentSongIndex = Math.floor(Math.random()*songs.length);
  loadSong(currentSongIndex);
  showCard(current);
  startAutoCounter();
}

// Switch / Cards
function showCard(index) {
  const cards = document.querySelectorAll('.card');
  const videos = document.querySelectorAll('.bg-video');
  const mediaPlayer = document.getElementById('media-player');
  const color = cards[index].getAttribute('data-color');
  const cursor = cards[index].getAttribute('data-cursor');
  const videoSrc = cards[index].getAttribute('data-video');

  // 1) Karten umschalten
  cards.forEach((c, i) => {
    c.classList.toggle('active', i === index);
  });

  // 2) Hintergrundvideo wechseln
  videos.forEach((v) => {
    if (v.getAttribute('src') === videoSrc) {
      v.classList.remove('hidden');
      v.play();
    } else {
      v.classList.add('hidden');
      v.pause();
    }
  });

  // 3) Farbe / Cursor
  document.documentElement.style.setProperty('--card-color', color);
  document.body.style.cursor = `url(${cursor}), auto`;

  // 4) Media Player positionieren je nach Gerät
  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  if (!isMobile) {
    // 💻 Desktop → Player IN Karte einfügen (wie bisher)
    if (mediaPlayer && cards[index] !== mediaPlayer.parentElement) {
      cards[index].appendChild(mediaPlayer);
    }
    mediaPlayer.style.position = 'absolute';
    mediaPlayer.style.bottom = '-78px';
    mediaPlayer.style.left = '50%';
    mediaPlayer.style.transform = 'translateX(-50%)';
  } else {
    // 📱 Mobile → Player bleibt im Slider (unterhalb aller Karten)
    const slider = document.getElementById('slider');
    if (mediaPlayer && slider && mediaPlayer.parentElement !== slider) {
      slider.appendChild(mediaPlayer);
    }
    mediaPlayer.style.position = 'relative';
    mediaPlayer.style.bottom = 'auto';
    mediaPlayer.style.left = 'auto';
    mediaPlayer.style.transform = 'none';
    mediaPlayer.style.margin = '100px auto 40px auto';
  }

  // 5) Player-Styling
  mediaPlayer.style.border = `2px solid ${color}`;
  mediaPlayer.style.boxShadow = `0 8px 30px ${color}33`;
}


switchBtn.addEventListener('click', ()=>{ current=(current+1)%total; showCard(current); });

// Media Player
const audio = new Audio();
const playerCover=document.getElementById("player-cover");
const playerTitle=document.getElementById("player-title");
const playerArtist=document.getElementById("player-artist");
const playPauseBtn=document.getElementById("play-pause-btn");
const nextBtn=document.getElementById("next-btn");
const volumeSlider=document.getElementById("volume-slider");

function loadSong(index){
  const song = songs[index];
  audio.src = song.src;
  playerCover.src = song.cover;
  playerTitle.textContent = song.title;
  playerTitle.href = song.spotifyTrack;
  playerArtist.textContent = song.artist;
  playerArtist.href = song.spotifyArtist;

  // Setze Play-Button Icon
  playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/play.svg')");
}

playPauseBtn.addEventListener("click", ()=>{
    if(audio.paused){
        audio.play();
        playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/pause.svg')");
    } else {
        audio.pause();
        playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/play.svg')");
    }
});

nextBtn.addEventListener("click", ()=>{
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/pause.svg')");
});

volumeSlider.addEventListener("input", e=>audio.volume=e.target.value/6);
[playerCover,playerTitle,playerArtist].forEach(el=>el.addEventListener("click",()=>window.open(songs[currentSongIndex].spotifyTrack,"_blank")));
audio.addEventListener("ended",()=>{ currentSongIndex=(currentSongIndex+1)%songs.length; loadSong(currentSongIndex); audio.play(); });

// Besucherzähler
function startAutoCounter(){
  const startDate=new Date('2025-11-01T00:00:00Z'); const dailyIncrease=10; const randomMax=30;
  const baseViews=[1200,200];
  const visitorElems=document.querySelectorAll(".visitor-count");
  const randomOffsets=Array.from(visitorElems).map(()=>Math.floor(Math.random()*randomMax)+1);
  function updateCounts(){
    const now=new Date();
    const daysPassed=Math.floor((now-startDate)/(1000*60*60*24));
    visitorElems.forEach((el,i)=>{ const count=(baseViews[i]||100)+randomOffsets[i]+Math.max(0,daysPassed)*dailyIncrease; el.textContent=count; });
  }
  updateCounts();
  setInterval(updateCounts,1000*60*60);
}

// Start Intro
startIntroCountdown();

const timeSlider = document.getElementById('time-slider');

// Aktualisiert den Slider während des Abspielens
audio.addEventListener('timeupdate', () => {
  const value = (audio.currentTime / audio.duration) * 100 || 0;
  timeSlider.value = value;
});

// Slider kann Audio spulen
timeSlider.addEventListener('input', (e) => {
  audio.currentTime = (e.target.value / 100) * audio.duration;
});