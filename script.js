const openBtn = document.getElementById('openLinktree');
const linktree = document.getElementById('linktree');
const music = document.getElementById('bg-music');

openBtn.addEventListener('click', () => {
  linktree.classList.remove('hidden');
  openBtn.style.display = 'none';
  music.play().catch(() => {
    console.log('Autoplay blockiert – Musik startet nach Interaktion.');
  });
});
