const intro = document.getElementById('intro');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const bgMusic = document.getElementById('bg-music');
const switchBtn = document.getElementById('switch');

let current = 0;
let total = cards.length;

/* Intro Klick */
intro.addEventListener('click', () => {
  intro.style.opacity = 0;
  setTimeout(() => intro.style.display='none', 1000);
  slider.classList.add('active');
  bgMusic.volume = 0.4; bgMusic.play();
  showCard(0);
});

/* Switch Button */
switchBtn.addEventListener('click', () => {
  current = (current+1)%total;
  showCard(current);
});

/* Swipe Support */
let startX=0;
window.addEventListener('touchstart', e => startX=e.touches[0].clientX);
window.addEventListener('touchend', e=>{
  let diff=e.changedTouches[0].clientX-startX;
  if(Math.abs(diff)>50){
    current = diff<0 ? (current+1)%total : (current-1+total)%total;
    showCard(current);
  }
});

/* Zeigt Karte & Video-Wechsel, setzt Farbe */
function showCard(index){
  cards.forEach((card,i)=>card.classList.toggle('active',i===index));
  const activeCard=cards[index];
  if(activeCard&&!activeCard.contains(switchBtn)) activeCard.appendChild(switchBtn);

  // Dynamische Farbe setzen
  const color = activeCard.dataset.color || '#ff66cc';
  activeCard.style.setProperty('--card-color', color);

  // Hintergrundvideo wechseln
  const newVideoSrc=activeCard.dataset.video;
  if(bgVideoNext.querySelector('source').src.includes(newVideoSrc)) return;
  bgVideoNext.querySelector('source').src=newVideoSrc;
  bgVideoNext.load();
  bgVideoNext.classList.remove('hidden');
  bgVideoNext.style.opacity=0;
  setTimeout(()=>{ bgVideoNext.style.transition='opacity 1s ease'; bgVideoNext.style.opacity=1; },50);
  setTimeout(()=>{
    bgVideo.querySelector('source').src=newVideoSrc;
    bgVideo.load();
    bgVideoNext.classList.add('hidden');
    bgVideoNext.style.transition='';
    bgVideoNext.style.opacity=0;
  },1050);
}
