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

function showCard(index) {
  cards.forEach((c,i)=>{
    c.classList.remove('active');
    if(i===index) c.classList.add('active');
  });
  // Hintergrundvideo wechseln
  const newVideo = cards[index].dataset.video;
  bgVideoNext.querySelector('source').src = newVideo;
  bgVideoNext.load();
  bgVideoNext.classList.remove('hidden');
  setTimeout(()=>{
    bgVideo.classList.add('hidden');
    bgVideoNext.id='bg-video';
    bgVideo.id='bg-video-next';
  }, 50);
}

// Navigation
nextBtn.addEventListener('click', ()=>{
  current = (current+1)%total;
  showCard(current);
});
prevBtn.addEventListener('click', ()=>{
  current = (current-1+total)%total;
  showCard(current);
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
    showCard(current);
  }, 800);
  music.play().catch(()=>{ console.warn('Autoplay blockiert'); });
});
