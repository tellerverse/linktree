const intro = document.getElementById('intro');
const linktree = document.getElementById('linktree');
const music = document.getElementById('bg-music');

intro.addEventListener('click', () => {
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    linktree.classList.remove('hidden');
  }, 600);

  music.play().catch(() => {
    console.warn('Autoplay blockiert – Musik startet nach Nutzerinteraktion.');
  });
});
