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
  cards.forEach((c,i)=>c.classList.toggle('active', i===index));
  const activeCard = cards[index];
  if(activeCard && !activeCard.contains(switchBtn)) activeCard.appendChild(switchBtn);
  const color = activeCard.dataset.color || '#ff66cc';
  activeCard.style.setProperty('--card-color', color);
  const cardColor = activeCard.dataset.color || '#ff66cc';
    const player = document.getElementById('media-player');
    player.style.background = `rgba(0,0,0,0.5)`; // halbtransparent
    player.style.border = `2px solid ${cardColor}`;
    player.style.boxShadow = `0 0 20px ${cardColor}`;
  const cursorFile = activeCard.dataset.cursor || 'cursor-default.cur';
  setCursor(cursorFile);
  const newVideoSrc = activeCard.dataset.video;
  if(!bgVideoNext.querySelector('source').src.includes(newVideoSrc)){
    bgVideoNext.querySelector('source').src=newVideoSrc; bgVideoNext.load();
    bgVideoNext.classList.remove('hidden'); bgVideoNext.style.opacity=0;
    setTimeout(()=>{bgVideoNext.style.transition='opacity 1s ease'; bgVideoNext.style.opacity=1},50);
    setTimeout(()=>{bgVideo.querySelector('source').src=newVideoSrc; bgVideo.load(); bgVideoNext.classList.add('hidden'); bgVideoNext.style.transition=''; bgVideoNext.style.opacity=0},1050);
  }
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
  audio.src=song.src;
  playerCover.src=song.cover;
  playerTitle.textContent=song.title;
  playerTitle.href=song.spotifyTrack;
  playerArtist.textContent=song.artist;
  playerArtist.href=song.spotifyArtist;
  playPauseBtn.textContent="▶️";
}

playPauseBtn.addEventListener("click",()=>{ audio.paused? (audio.play(),playPauseBtn.textContent="⏸️"):(audio.pause(),playPauseBtn.textContent="▶️") });
nextBtn.addEventListener("click",()=>{ currentSongIndex=(currentSongIndex+1)%songs.length; loadSong(currentSongIndex); audio.play(); playPauseBtn.textContent="⏸️"; });
volumeSlider.addEventListener("input", e=>audio.volume=e.target.value);
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