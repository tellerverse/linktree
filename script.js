const intro = document.getElementById('intro');
const linktree = document.getElementById('linktree');
const glassBox = document.querySelector('.glass-box');
const music = document.getElementById('bg-music');

intro.addEventListener('click', () => {
  // Intro ausblenden
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    linktree.classList.add('show');

    // Glas-Box einblenden
    setTimeout(() => {
      glassBox.classList.add('visible');
    }, 300);
  }, 800);

  // Musik starten
  music.play().catch(() => {
    console.warn('Autoplay blockiert – Musik startet nach Klick.');
  });
});
