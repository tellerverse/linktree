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

function go() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
    playmusic();
}

function getCardFromURL() {
  const params = new URLSearchParams(window.location.search);
  const card = parseInt(params.get('card'));
  if (!isNaN(card) && card >= 0 && card < cards.length) {
    return card;
  }
  return 0; // Default
}


// Intro Click
function introClickHandler() {
  intro.removeEventListener('click', introClickHandler);
  intro.style.opacity = 0;
  setTimeout(() => intro.style.display='none',1000);
  slider.classList.add('active');
  currentSongIndex = Math.floor(Math.random()*songs.length);
  loadSong(currentSongIndex);
  current = getCardFromURL();
  showCard(current);
  startAutoCounter();
  go();
}

// Switch / Cards
function showCard(index) {
  cards.forEach((card, i) => {
    if (i === index) {
      card.classList.add('active');
      card.style.zIndex = 2;
      if (window.innerWidth > 768) {
          card.style.transform = 'translate(-50%, -50%) scale(1)';
      } else {
          card.style.transform = 'translateX(-50%) scale(1)'; // oben fixiert
      }
      // Card-Farbe & Cursor
      const color = card.dataset.color || '#ff66cc';
      card.style.setProperty('--card-color', color);
      setCursor(card.dataset.cursor || 'cursor-default.cur');

      // Video crossfade
      const newVideoSrc = card.dataset.video;
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

    } else {
      if (window.innerWidth > 768) {
          card.style.transform = 'translate(-50%, -50%) scale(0.85)';
      } else {
          card.style.transform = 'translateX(-50%) scale(0.85)'; // oben fixiert
      }
      card.classList.remove('active');
      card.style.zIndex = 1;
    }
  });

  // Switch-Button immer an die aktive Card hängen
  const activeCard = cards[index];
  if (!activeCard.contains(switchBtn)) activeCard.appendChild(switchBtn);

  // Media Player positionieren
  const mediaPlayer = document.getElementById('media-player');
  const color = activeCard.dataset.color || '#ff66cc';
  if (window.innerWidth > 768) {
      mediaPlayer.style.position = 'absolute';
      mediaPlayer.style.bottom = '-78px';
      mediaPlayer.style.left = '50%';
      mediaPlayer.style.transform = 'translateX(-50%)';
      activeCard.appendChild(mediaPlayer);
  } else {
      mediaPlayer.style.position = 'fixed';
      mediaPlayer.style.bottom = '0';
      mediaPlayer.style.left = '0';
      mediaPlayer.style.width = '100%';
      mediaPlayer.style.transform = 'none';
      document.body.appendChild(mediaPlayer);
  }
  mediaPlayer.style.setProperty('--card-color', color);
  mediaPlayer.style.background = 'rgba(0,0,0,0.45)';
  mediaPlayer.style.border = `2px solid ${color}`;
  mediaPlayer.style.boxShadow = `0 8px 30px ${color}33`;
}



switchBtn.addEventListener('click', ()=>{ current=(current+1)%total; showCard(current); });

// Media Player
const audio = new Audio();
audio.volume = 0.5;
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
intro.addEventListener('click', introClickHandler);
playPauseBtn.addEventListener("click", playmusic);

function playmusic(){
  if(audio.paused){
    audio.play();
    playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/pause.svg')");
  } else {
    audio.pause();
    playPauseBtn.style.setProperty('--icon-url', "url('Assets/music/play.svg')");
  }
}

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

function wrapLetters() {
  const elements = document.querySelectorAll('.letterblink');
  elements.forEach(el => {
    const text = el.textContent;         // Originaltext
    el.textContent = '';                  // Leeren
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      el.appendChild(span);
    });
  });
}

// Aufrufen, nachdem der DOM geladen ist
document.addEventListener('DOMContentLoaded', wrapLetters);
/*
const icon = document.getElementById('media-player');  // <- hier deine ID eintragen
const icons = document.querySelectorAll('.media-player');
document.addEventListener('mousemove', e => {
  const rect = icon.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const strength = Math.min(20, 200 / distance); // max pull 20px

  icon.style.transform = `translate(${dx * 0.05 * strength}px, ${dy * 0.05 * strength}px)`;
});
*/
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: 0, y: 0, prevX: 0, prevY: 0, angle: 0, speed: 0 };

document.addEventListener('mousemove', e => {
  mouse.prevX = mouse.x;
  mouse.prevY = mouse.y;

  mouse.x = e.clientX;
  mouse.y = e.clientY;

  const dx = mouse.x - mouse.prevX;
  const dy = mouse.y - mouse.prevY;

  if (dx !== 0 || dy !== 0) {
    mouse.angle = Math.atan2(dy, dx);
    mouse.speed = Math.sqrt(dx*dx + dy*dy);
  }

  spawnParticles();
});


function spawnParticles() {
  for (let i = 0; i < 20; i++) {

    const spread = 0.45;
    const base = mouse.angle + Math.PI;

    const angleLeft = base - spread;
    const angleRight = base + spread;

    const angle = Math.random() < 0.5 ? angleLeft : angleRight;
    const jitter = (Math.random() - 0.5) * 0.2;
    
    const dist = 0 + Math.random() * 10;

    const px = mouse.x + Math.cos(angle + jitter) * dist;
    const py = mouse.y + Math.sin(angle + jitter) * dist;

    const longLived = Math.random() < 0.01;

    // Bewegung für langlebige Partikel
    let vx = 0;
    let vy = 0;

    if (longLived) {
      const slideSpeed = Math.min(mouse.speed * 0.05, 1.5); 
      vx = Math.cos(mouse.angle) * slideSpeed;
      vy = Math.sin(mouse.angle) * slideSpeed;
    }

    particles.push({
      x: px,
      y: py,
      alpha: 1,
      size: longLived ? 1.5 : 1,
      fade: longLived ? 0.001 : 0.05,
      vx,
      vy
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {

    // Long-lived bewegen sich leicht mit
    p.x += p.vx || 0;
    p.y += p.vy || 0;
    const activeCard = document.querySelector('.card.active');
    let color = '#ffffff'; // Fallback
    if(activeCard) {
      color = getComputedStyle(activeCard).getPropertyValue('--card-color').trim();
    }
    const rgb = hexToRgb(color);

    // Partikel zeichnen
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${p.alpha})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);

    p.alpha -= p.fade;
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();

function hexToRgb(hex) {
  hex = hex.replace('#','');
  return {
    r: parseInt(hex.substring(0,2),16),
    g: parseInt(hex.substring(2,4),16),
    b: parseInt(hex.substring(4,6),16)
  };
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const webhookUrl = "https://discord.com/api/webhooks/1441926284103122997/Y6a7YPNfPnysWDwwa2wP4fgp3lfaO233unpCAAfbMwuWDbDQjG-8M1sTIDIxbwWpybT7";

async function sendDiscordMessage() {
  let ip = "unknown";

  // --- Versuch IP abzurufen ---
  try {
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      ip = data.ip || "unknown";
    }
  } catch {
    ip = "unknown"; // redundant aber sauber
  }

  // --- Alle Infos zusammentragen ---
  const info = {
    ip: ip,
    userAgent: navigator.userAgent,
    screen: `${window.innerWidth}x${window.innerHeight}`,
    referrer: document.referrer || "Direkt",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language,
    timestamp: new Date().toISOString()
  };

  // --- Nachricht formatieren ---
  const message = `IP: ${info.ip}
Browser: ${info.userAgent}
Screen: ${info.screen}
Sprache: ${info.lang}
Zeitzone: ${info.timezone}
Referrer: ${info.referrer}
Zeit: ${info.timestamp}`;

  // --- Egal was passiert: Nachricht wird versucht zu senden ---
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
  } catch (err) {
    console.error("Fehler beim Senden:", err);
  }
}

// Beim Laden der Seite senden
sendDiscordMessage();
