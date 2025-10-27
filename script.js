const intro = document.getElementById('intro');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const bgMusic = document.getElementById('bg-music');
const switchBtn = document.getElementById('switch');

let current = 0;
let total = cards.length;

/* === Intro Klick === */
intro.addEventListener('click', () => {
  intro.style.opacity = 0;
  setTimeout(() => intro.style.display = 'none', 1000);
  slider.classList.add('active');
  bgMusic.volume = 0.4;
  bgMusic.play();
  showCard(0);
});

/* === Button Klick === */
switchBtn.addEventListener('click', () => {
  current = (current + 1) % total;
  showCard(current);
});

/* === Swipe Support === */
let startX = 0;
window.addEventListener('touchstart', e => startX = e.touches[0].clientX);
window.addEventListener('touchend', e => {
  let diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) {
    if (diff < 0) current = (current + 1) % total;
    else current = (current - 1 + total) % total;
    showCard(current);
  }
});

/* === Zeigt aktive Karte & Video-Wechsel === */
function showCard(index) {
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
document.querySelectorAll('.card').forEach(card => {
  const color = card.dataset.color || '#ff66cc';
  const root = card.style;
  root.setProperty('--accent', color);

  // Weiß*8 + Farbe*2 → 20% Farbanteil
  const mix = (c1, c2, p) => {
    const n = parseInt(c2.slice(1), 16),
          r = (n >> 16) & 255,
          g = (n >> 8) & 255,
          b = n & 255;
    return `rgba(${255 - (255 - r) * p}, ${255 - (255 - g) * p}, ${255 - (255 - b) * p}, 1)`;
  };
  root.setProperty('--accent-faint', mix('#ffffff', color, 0.2));
});
