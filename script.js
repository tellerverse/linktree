const intro = document.getElementById('intro');
const centerText = intro.querySelector('.center-text');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const switchBtn = document.getElementById('switch');

const songs = [
  {title:"STANNI",artist:"Snake16",cover:"Assets/music/stannicover.jpg",src:"Assets/music/stanni.mp3",spotifyTrack:"https://open.spotify.com/track/4BMykUWuRBoX7yiIFPSFXH?si=927e3a4aa6074347",spotifyArtist:"https://open.spotify.com/artist/2fgyuNiQxXwzAoN8qLFCCf?si=EkNKiE61RaqVEoHUFUFUaw"},
  {title:"SAG VALLAH",artist:"Snake16",cover:"Assets/music/sagvallahcover.jpg",src:"Assets/music/sagvallah.mp3",spotifyTrack:"https://open.spotify.com/track/4GndsC4aWgsALl5sKq6dxY?si=aee1fb61de83427b",spotifyArtist:"https://open.spotify.com/artist/2fgyuNiQxXwzAoN8qLFCCf?si=EkNKiE61RaqVEoHUFUFUaw"}
];

let current=0,currentSongIndex, total=cards.length;
const audio=new Audio();
const playerCover=document.getElementById("player-cover");
const playerTitle=document.getElementById("player-title");
const playerArtist=document.getElementById("player-artist");
const playPauseBtn=document.getElementById("play-pause-btn");
const nextBtn=document.getElementById("next-btn");
const currentTimeEl=document.getElementById("current-time");
const totalTimeEl=document.getElementById("total-time");
const timeSlider=document.getElementById("time-slider");
const volumeContainer = document.getElementById('volume-container');
const volumeIcon = document.getElementById('volume-icon');
const volumeSlider = document.getElementById('volume-slider');

// Volume Slider außerhalb body
document.body.appendChild(volumeSlider);
function positionVolumeSlider(){
  const rect=volumeIcon.getBoundingClientRect();
  volumeSlider.style.left=`${rect.right + 10}px`;
  volumeSlider.style.top=`${rect.top}px`;
}
positionVolumeSlider();
window.addEventListener('resize',positionVolumeSlider);
function showSlider(){volumeSlider.style.opacity=1;}
function hideSlider(){if(!volumeSlider.matches(':hover'))volumeSlider.style.opacity=0;}
volumeContainer.addEventListener('mouseenter',showSlider);
volumeContainer.addEventListener('mouseleave',hideSlider);
volumeSlider.addEventListener('mouseenter',showSlider);
volumeSlider.addEventListener('mouseleave',hideSlider);

volumeIcon.addEventListener('click', () => {
  audio.muted = !audio.muted;
  volumeIcon.classList.toggle('muted', audio.muted);
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  audio.muted = volumeSlider.value == 0;
  volumeIcon.classList.toggle('muted', audio.muted);
});

function updatePlayerUI(song){
  playerCover.src=song.cover;
  playerTitle.href=song.spotifyTrack;
  playerTitle.textContent=song.title;
  playerArtist.href=song.spotifyArtist;
  playerArtist.textContent=song.artist;
}

function playSong(){
  audio.play();
  playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/pause.svg')");
}
function pauseSong(){
  audio.pause();
  playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/play.svg')");
}

playPauseBtn.addEventListener('click',()=>{
  audio.paused?playSong():pauseSong();
});
nextBtn.addEventListener('click',()=>{
  current=(current+1)%songs.length;
  audio.src=songs[current].src;
  updatePlayerUI(songs[current]);
  playSong();
});

audio.addEventListener('timeupdate',()=>{
  const cur=Math.floor(audio.currentTime);
  const dur=Math.floor(audio.duration);
  currentTimeEl.textContent=`${Math.floor(cur/60)}:${('0'+cur%60).slice(-2)}`;
  totalTimeEl.textContent=`${Math.floor(dur/60)}:${('0'+dur%60).slice(-2)}`;
  timeSlider.value=(cur/dur)*100||0;
});

timeSlider.addEventListener('input',()=>{
  audio.currentTime=(timeSlider.value/100)*audio.duration;
});

// Intro Countdown
let count=3;
const countdown=setInterval(()=>{
  centerText.textContent=count;
  count--;
  if(count<0){clearInterval(countdown); intro.style.display='none'; slider.classList.add('active');}
},1000);

// Card Switch
cards.forEach((card,i)=>card.addEventListener('click',()=>{
  cards[current].classList.remove('active');
  card.classList.add('active');
  current=i;
  const videoSrc=card.dataset.video;
  const color=card.dataset.color;
  const cursor=card.dataset.cursor;
  bgVideo.src=videoSrc;
  document.documentElement.style.setProperty('--card-color',color);
  document.body.style.cursor=`url('${cursor}'), auto`;
}));

cards[0].classList.add('active');
bgVideo.src=cards[0].dataset.video;

// Switch Button
switchBtn.addEventListener('click',()=>{
  cards[current].classList.remove('active');
  current=(current+1)%cards.length;
  cards[current].classList.add('active');
  const videoSrc=cards[current].dataset.video;
  const color=cards[current].dataset.color;
  const cursor=cards[current].dataset.cursor;
  bgVideo.src=videoSrc;
  document.documentElement.style.setProperty('--card-color',color);
  document.body.style.cursor=`url('${cursor}'), auto`;
});
