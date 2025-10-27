const intro = document.getElementById('intro');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const bgMusic = document.getElementById('bg-music');
const switchBtn = document.getElementById('switch');

let current = 0;
let total = cards.length;

/* ===========================
   === Intro Klick Event ===
   =========================== */
intro.addEventListener('click', () => {
  intro.style.opacity = 0;
  setTimeout(() => intro.style.display = 'none', 1000);

  slider.classList.add('active');

  bgMusic.volume = 0.4;
  bgMusic.play();

  showCard(0);
});

/* ===========================
   === Button Klick Event ===
   =========================== */
switchBtn.addEventListener('click', () => {
  current = (current + 1) % total;
  showCard(current);
});

/* ===========================
   === Swipe Support ===
   =========================== */
let startX = 0;

window.addEventListener('touchstart', e => startX = e.touches[0].clientX);

window.addEventListener('touchend', e => {
  let diff = e.changedTouches[0].clientX - startX;

  if (Math.abs(diff) > 50) {
      if (diff < 0) {
          current = (current + 1) % total;
      } else {
          current = (current - 1 + total) % total;
      }
      showCard(current);
  }
});

/* ===========================
   === Zeigt aktive Karte & Video-Wechsel ===
   =========================== */
function showCard(index) {
  // Aktive Karte markieren
  cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
  });

  // Button an die aktive Karte anhängen
  const activeCard = cards[index];
  if (activeCard && !activeCard.contains(switchBtn)) {
      activeCard.appendChild(switchBtn);
  }

  // Crossfade des Hintergrundvideos
  const newVideoSrc = cards[index].dataset.video;
  if (bgVideoNext.querySelector('source').src.includes(newVideoSrc)) return;

  bgVideoNext.querySelector('source').src = newVideoSrc;
  bgVideoNext.load();
  bgVideoNext.classList.remove('hidden');
  bgVideoNext.style.opacity = 0;

  // Fade-in Animation starten
  setTimeout(() => {
      bgVideoNext.style.transition = 'opacity 1s ease';
      bgVideoNext.style.opacity = 1;
  }, 50);

  // Alten Hintergrund ersetzen
  setTimeout(() => {
      bgVideo.querySelector('source').src = newVideoSrc;
      bgVideo.load();
      bgVideoNext.classList.add('hidden');
      bgVideoNext.style.transition = '';
      bgVideoNext.style.opacity = 0;
  }, 1050);
}
// === Dynamische Farben pro Karte ===
document.querySelectorAll('.card').forEach(card => {
  const color = card.dataset.color || "#ff66cc";

  // Farbe in RGB konvertieren
  const hexToRgb = hex => {
    const n = parseInt(hex.replace('#',''),16);
    return [(n>>16)&255, (n>>8)&255, n&255];
  };
  const [r,g,b] = hexToRgb(color);

  // CSS-Variablen setzen
  card.style.setProperty('--accent', color);
  card.style.setProperty('--accent-rgb', `${r},${g},${b}`);
});