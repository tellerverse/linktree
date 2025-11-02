const intro = document.getElementById('intro');
const centerText = intro.querySelector('.center-text');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const switchBtn = document.getElementById('switch');

const songs = [
  {title:"Song 1", artist:"Artist 1", cover:"Assets/cover1.jpg", src:"Assets/song1.mp3", spotifyTrack:"#", spotifyArtist:"#"},
  {title:"Song 2", artist:"Artist 2", cover:"Assets/cover2.jpg", src:"Assets/song2.mp3", spotifyTrack:"#", spotifyArtist:"#"},
  {title:"Song 3", artist:"Artist 3", cover:"Assets/cover3.jpg", src:"Assets/song3.mp3", spotifyTrack:"#", spotifyArtist:"#"}
];

let current=0;
const total=cards.length;

// Intro Countdown
function startIntroCountdown(){
  let count=3;
  centerText.textContent=count;
  const interval=setInterval(()=>{
    count--;
    if(count>0){centerText.textContent=count;}
    else{
      clearInterval(interval);
      centerText.textContent='Click';
      intro.addEventListener('click',introClickHandler);
    }
  },1000);
}

function introClickHandler(){
  intro.removeEventListener('click',introClickHandler);
  intro.style.opacity=0;
  setTimeout(()=>intro.style.display='none',1000);
  slider.classList.add('active');

  currentSongIndex=Math.floor(Math.random()*songs.length);
  loadSong(currentSongIndex);
  showCard(current);
}

// Cursor
function setCursor(fileName){
  document.body.style.cursor=`url('Assets/${fileName}'), auto`;
  document.querySelectorAll('a, button').forEach(el=>el.style.cursor=`url('Assets/${fileName}'), pointer`);
}

// Show Card
function showCard(index){
  cards.forEach((c,i)=>c.classList.toggle('active',i===index));
  const activeCard=cards[index];
  if(activeCard && !activeCard.contains(switchBtn)) activeCard.appendChild(switchBtn);
  const color=activeCard.dataset.color||'#ff66cc';
  activeCard.style.setProperty('--card-color',color);
  setCursor(activeCard.dataset.cursor||'cursor-default.cur');

  const newVideoSrc=activeCard.dataset.video;
  if(!bgVideoNext.querySelector('source').src.includes(newVideoSrc)){
    bgVideoNext.querySelector('source').src=newVideoSrc;
    bgVideoNext.load();
    bgVideoNext.classList.remove('hidden'); bgVideoNext.style.opacity=0;
    setTimeout(()=>{bgVideoNext.style.transition='opacity 1s ease'; bgVideoNext.style.opacity=1;},50);
    setTimeout(()=>{
      bgVideo.querySelector('source').src=newVideoSrc; bgVideo.load();
      bgVideoNext.classList.add('hidden'); bgVideoNext.style.transition=''; bgVideoNext.style.opacity=0;
    },1050);
  }

  // Media Player anpassen
  const mediaPlayer=document.getElementById('media-player');
  mediaPlayer.style.setProperty('--card-color',color);
  mediaPlayer.style.border=activeCard.style.border;
  mediaPlayer.style.borderRadius=activeCard.style.borderRadius;
  mediaPlayer.style.backdropFilter=activeCard.style.backdropFilter;
  mediaPlayer.style.background=activeCard.style.background;
  mediaPlayer.style.color=color;
}

switchBtn.addEventListener('click',()=>{current=(current+1)%total; showCard(current);});

// Visitor Counter
function startAutoCounter(){
  const startDate=new Date('2025-11-01T00:00:00Z'), dailyIncrease=10, randomMax=30, baseViews=[1200,200];
  const visitorElems=document.querySelectorAll(".visitor-count");
  const randomOffsets=Array.from(visitorElems).map(()=>Math.floor(Math.random()*randomMax)+1);

  function updateCounts(){
    const now=new Date(), daysPassed=Math.floor((now-startDate)/(1000*60*60*24));
    visitorElems.forEach((el,i)=>{
      el.textContent=(baseViews[i]||100)+randomOffsets[i]+Math.max(0,daysPassed)*dailyIncrease;
    });
  }
  updateCounts();
  setInterval(updateCounts,1000*60*60);
}
startAutoCounter();

// Media Player
let currentSongIndex;
const audio=new Audio();
const playerCover=document.getElementById("player-cover");
const playerTitle=document.getElementById("player-title");
const playerArtist=document.getElementById("player-artist");
const playPauseBtn=document.getElementById("play-pause-btn");
const nextBtn=document.getElementById("next-btn");
const seekSlider=document.getElementById("seek-slider");
const volumeSlider=document.getElementById("volume-slider");

function loadSong(index){
  const song=songs[index];
  audio.src=song.src;
  playerCover.src=song.cover;
  playerTitle.textContent=song.title;
  playerTitle.href=song.spotifyTrack;
  playerArtist.textContent=song.artist;
  playerArtist.href=song.spotifyArtist;
  playPauseBtn.textContent="▶️";
}

// Play/Pause
function playPause(){if(audio.paused){audio.play();playPauseBtn.textContent="⏸️";}else{audio.pause();playPauseBtn.textContent="▶️";}}
function nextSong(){currentSongIndex=(currentSongIndex+1)%songs.length; loadSong(currentSongIndex); audio.play(); playPauseBtn.textContent="⏸️";}

playPauseBtn.addEventListener("click",playPause);
nextBtn.addEventListener("click",nextSong);
volumeSlider.addEventListener("input", e=>audio.volume=e.target.value);

// Seek Slider
audio.addEventListener("timeupdate",()=>{seekSlider.value=(audio.currentTime/audio.duration)*100 || 0;});
seekSlider.addEventListener("input",()=>{audio.currentTime=(seekSlider.value/100)*audio.duration;});

// Spotify Links
playerCover.addEventListener("click",()=>window.open(songs[currentSongIndex].spotifyTrack,"_blank"));
playerTitle.addEventListener("click",()=>window.open(songs[currentSongIndex].spotifyTrack,"_blank"));
playerArtist.addEventListener("click",()=>window.open(songs[currentSongIndex].spotifyArtist,"_blank"));

// Start
startIntroCountdown();
