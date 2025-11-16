const intro = document.getElementById('intro');
const centerText = intro.querySelector('.center-text');
const slider = document.getElementById('slider');
const sites = document.querySelectorAll(".site");
let currentSite = 0;

// Songs (global Audio)
const songs=[
  {title:"STANNI",artist:"Snake16",cover:"Assets/music/stannicover.jpg",src:"Assets/music/stanni.mp3"},
  {title:"SAG VALLAH",artist:"Snake16",cover:"Assets/music/sagvallahcover.jpg",src:"Assets/music/sagvallah.mp3"}
];
let currentSongIndex=0;
const audio = new Audio();

// Cursor + Theme
function applySiteTheme(site){
    const color=site.dataset.color;
    const cursor=site.dataset.cursor;
    site.style.setProperty("--color",color);
    site.style.setProperty("--cursor",`url(${cursor}), auto`);
    site.querySelectorAll(".card").forEach(card=>{
        card.style.backgroundColor=color;
        card.style.cursor=`url(${cursor}), auto`;
    });
}
sites.forEach(site=>applySiteTheme(site));

// Intro Countdown
function startIntroCountdown(){
    let count=3;
    centerText.textContent=count;
    const interval=setInterval(()=>{
        count--;
        if(count>0) centerText.textContent=count;
        else{
            clearInterval(interval);
            centerText.textContent='Click';
            intro.addEventListener('click',introClickHandler);
        }
    },1000);
}

function introClickHandler(){
    intro.style.opacity=0;
    setTimeout(()=>intro.style.display='none',1000);
    slider.classList.add('active');
    sites[currentSite].classList.add('active');
    startAutoCounter();
}

// Site Switch
document.getElementById("switch").addEventListener("click",()=>{
    sites[currentSite].classList.remove("active");
    currentSite=(currentSite+1)%sites.length;
    sites[currentSite].classList.add("active");
    changeBackgroundVideo(sites[currentSite].dataset.video);
});

// Cards expandieren
document.addEventListener("click", e=>{
    const card=e.target.closest(".card");
    if(!card) return;
    const grid=card.closest(".card-grid");
    grid.querySelectorAll(".card").forEach(c=>{ if(c!==card) c.classList.remove("expanded"); });
    card.classList.toggle("expanded");
    card.scrollIntoView({behavior:"smooth",block:"center"});
});

// Video Background
const bgVideo=document.getElementById("bg-video");
const bgVideoNext=document.getElementById("bg-video-next");
function changeBackgroundVideo(src){
    if(bgVideo.querySelector("source").src.includes(src)) return;
    bgVideoNext.querySelector("source").src=src;
    bgVideoNext.load();
    bgVideoNext.classList.remove("hidden");
    bgVideoNext.style.opacity=0;
    setTimeout(()=>{ bgVideoNext.style.transition="opacity 1s ease"; bgVideoNext.style.opacity=1; },50);
    setTimeout(()=>{
        bgVideo.querySelector("source").src=src;
        bgVideo.load();
        bgVideoNext.classList.add("hidden");
        bgVideoNext.style.transition="";
        bgVideoNext.style.opacity=0;
    },1050);
}

// Media Player (ein Audio für alle Player Cards)
function loadSong(index){
    const song=songs[index];
    audio.src=song.src;
    document.querySelectorAll(".player-ui").forEach(ui=>{
        ui.querySelector(".player-cover").src=song.cover;
        ui.querySelector(".player-title").textContent=song.title;
        ui.querySelector(".player-artist").textContent=song.artist;
    });
}

// Play/Pause & Next
document.addEventListener("click", e=>{
    if(e.target.closest(".play-pause-btn")){
        if(audio.paused){ audio.play(); e.target.closest(".play-pause-btn").textContent="⏸"; }
        else{ audio.pause(); e.target.closest(".play-pause-btn").textContent="▶"; }
    }
    if(e.target.closest(".next-btn")){
        currentSongIndex=(currentSongIndex+1)%songs.length;
        loadSong(currentSongIndex);
        audio.play();
    }
});

// Volume & Time sliders
document.addEventListener("input", e=>{
    if(e.target.classList.contains("volume-slider")) audio.volume=e.target.value;
    if(e.target.classList.contains("time-slider")) audio.currentTime=(e.target.value/100)*audio.duration;
});
audio.addEventListener("timeupdate",()=>{
    document.querySelectorAll(".time-slider").forEach(s=>s.value=(audio.currentTime/audio.duration)*100||0);
});

// Besucherzähler (optional)
function startAutoCounter(){
  const visitorElems=document.querySelectorAll(".visitor-count");
  visitorElems.forEach(el=>el.textContent=Math.floor(Math.random()*5000));
}

// Intro starten
startIntroCountdown();
loadSong(currentSongIndex);
