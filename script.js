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
  const activeCard = cards[index];
  const mediaPlayer = document.getElementById('media-player');
  
  if (window.innerWidth > 768) {
    // Desktop / Tablet: Player in Card
    if (mediaPlayer && activeCard !== mediaPlayer.parentElement) {
      activeCard.appendChild(mediaPlayer);
      mediaPlayer.style.position = 'absolute';
    }
  } else {
    // Mobile: Player unten fixieren
    if (mediaPlayer && mediaPlayer.parentElement !== document.body) {
      document.body.appendChild(mediaPlayer);
      mediaPlayer.style.position = 'fixed';
    }
  }
  // 1) Card aktivieren
  cards.forEach((card, i) => card.classList.toggle('active', i === index));
  if (!activeCard) return;

  // 2) ensure switch button is inside active card
  if (!activeCard.contains(switchBtn)) activeCard.appendChild(switchBtn);

  // 3) set card color variable
  const color = activeCard.dataset.color || '#ff66cc';
  activeCard.style.setProperty('--card-color', color);

  // 4) cursor
  const cursorFile = activeCard.dataset.cursor || 'cursor-default.cur';
  setCursor(cursorFile);

  // 5) video crossfade
  const newVideoSrc = activeCard.dataset.video;
  const nextSource = bgVideoNext.querySelector('source');
  const mainSource = bgVideo.querySelector('source');
  if (!nextSource.src.includes(newVideoSrc)) {
    nextSource.src = newVideoSrc;
    bgVideoNext.load();
    bgVideoNext.classList.remove('hidden');
    bgVideoNext.style.opacity = 0;
    setTimeout(() => {
      bgVideoNext.style.transition = 'opacity 1s ease';
      bgVideoNext.style.opacity = 1;
    }, 50);
    setTimeout(() => {
      mainSource.src = newVideoSrc;
      bgVideo.load();
      bgVideoNext.classList.add('hidden');
      bgVideoNext.style.transition = '';
      bgVideoNext.style.opacity = 0;
    }, 1050);
  }

  // 6) move media player element INTO the active card, position absolute relative to it
  if (mediaPlayer && activeCard !== mediaPlayer.parentElement) {
    activeCard.appendChild(mediaPlayer);
  }

  // 7) style media player to match card color
  mediaPlayer.style.setProperty('--card-color', color);
  mediaPlayer.style.background = 'rgba(0,0,0,0.45)';
  mediaPlayer.style.border = `2px solid ${color}`;
  mediaPlayer.style.boxShadow = `0 8px 30px ${color}33`; // subtle colored glow

  // 8) ensure active card allows overflow so player is visible
  activeCard.style.overflow = 'visible';

  // 9) update slider thumbs if present so border matches color
  const timeSlider = document.getElementById('time-slider');
  const volumeSlider = document.getElementById('volume-slider');
  if (timeSlider) timeSlider.style.setProperty('--thumb-border', color);
  if (volumeSlider) volumeSlider.style.setProperty('--thumb-border', color);
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