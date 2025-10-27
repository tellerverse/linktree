const intro = document.getElementById('intro');
const slider = document.getElementById('slider');
const music = document.getElementById('bg-music');
const cards = document.querySelectorAll('.card');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');

let current = 0;
const total = cards.length;

// Zeige Karte + Hintergrundvideo
function showCard(index){
  cards.forEach((c,i)=>{
    c.classList.remove('active');
    if(i===index) c.classList.add('active');
  });

  const newVideoSrc = cards[index].dataset.video;
  bgVideoNext.querySelector('source').src = newVideoSrc;
  bgVideoNext.load();
  bgVideoNext.classList.remove('hidden');
  bgVideoNext.style.opacity = 0;

  setTimeout(()=>{
    bgVideoNext.style.transition = 'opacity 1s ease';
    bgVideoNext.style.opacity = 1;
  }, 50);

  setTimeout(()=>{
    bgVideo.src = newVideoSrc;
    bgVideo.load();
    bgVideoNext.classList.add('hidden');
    bgVideoNext.style.transition = '';
    bgVideoNext.style.opacity = 0;
  }, 1050);
}

const switchBtn = document.getElementById('switch');

// Nächste Karte beim Klick
switchBtn.addEventListener('click', () => {
  current = (current + 1) % total;
  showCard(current);
});

// Swipe auf Mobile bleibt gleich:
let startXX = 0;
slider.addEventListener('touchstart', e => { startXX = e.touches[0].clientX; });
slider.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  if (startXX - endX > 50) switchBtn.click(); // nach rechts wischen = nächste Karte
  else if (endX - startXX > 50) { // optional rückwärts?
    current = (current - 1 + total) % total;
    showCard(current);
  }
});


// Swipe für Mobile
let startX=0;
slider.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; });
slider.addEventListener('touchend', e=>{
  let endX = e.changedTouches[0].clientX;
  if(endX-startX>50) prevBtn.click();
  else if(startX-endX>50) nextBtn.click();
});

// Intro Click
intro.addEventListener('click', ()=>{
  intro.style.opacity='0';
  setTimeout(()=>{
    intro.style.display='none';
    slider.classList.remove('hidden');
    showCard(current); // erste Karte direkt anzeigen
  },800);

  music.play().catch(()=>{ console.warn('Autoplay blockiert'); });
});
