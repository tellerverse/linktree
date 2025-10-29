const intro = document.getElementById('intro');
const centerText = intro.querySelector('.center-text');
const slider = document.getElementById('slider');
const cards = document.querySelectorAll('.card');
const bgVideo = document.getElementById('bg-video');
const bgVideoNext = document.getElementById('bg-video-next');
const bgMusic = document.getElementById('bg-music');
const switchBtn = document.getElementById('switch');

let current = 0;
const total = cards.length;

/* -------- URL Parameter für Karte -------- */
const params = new URLSearchParams(window.location.search);
const paramCard = parseInt(params.get('card'));
if (!isNaN(paramCard) && paramCard >= 0 && paramCard < total) {
    current = paramCard;
}

/* -------- Cursor Handling -------- */
function setCursor(fileName) {
    const path = `Assets/${fileName}`;
    document.body.style.cursor = `url('${path}'), auto`;
    document.querySelectorAll('a, button').forEach(el => {
        el.style.cursor = `url('${path}'), pointer`;
    });
}

/* -------- Intro Countdown -------- */
function startIntroCountdown() {
    let count = 3;
    centerText.textContent = count;
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            centerText.textContent = count;
        } else {
            clearInterval(interval);
            centerText.textContent = 'Click';
            intro.addEventListener('click', introClickHandler);
        }
    }, 1000);
}

/* -------- Intro Klick Handler -------- */
function introClickHandler() {
    intro.removeEventListener('click', introClickHandler);
    intro.style.opacity = 0;
    setTimeout(() => intro.style.display = 'none', 1000);

    slider.classList.add('active');
    bgMusic.volume = 0.4;
    bgMusic.play();

    showCard(current);
}

/* -------- Switch Button -------- */
switchBtn.addEventListener('click', () => {
    current = (current + 1) % total;
    showCard(current);
});

/* -------- Swipe Support -------- */
let startX = 0;
window.addEventListener('touchstart', e => startX = e.touches[0].clientX);
window.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
        current = diff < 0 ? (current + 1) % total : (current - 1 + total) % total;
        showCard(current);
    }
});

/* -------- Zeigt Karte & Video-Wechsel -------- */
function showCard(index) {
    cards.forEach((card, i) => card.classList.toggle('active', i === index));
    const activeCard = cards[index];
    if (activeCard && !activeCard.contains(switchBtn)) activeCard.appendChild(switchBtn);

    // Farbe setzen
    const color = activeCard.dataset.color || '#ff66cc';
    activeCard.style.setProperty('--card-color', color);

    // Cursor wechseln
    const cursorFile = activeCard.dataset.cursor || 'cursor-default.cur';
    setCursor(cursorFile);

    // Video wechseln
    const newVideoSrc = activeCard.dataset.video;
    if (!bgVideoNext.querySelector('source').src.includes(newVideoSrc)) {
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
}

// -------- Intro Countdown starten --------
startIntroCountdown();
