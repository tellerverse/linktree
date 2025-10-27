document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const slider = document.getElementById("slider");
  const bgVideo = document.getElementById("bg-video");
  const bgVideoNext = document.getElementById("bg-video-next");
  const cards = document.querySelectorAll(".card");
  const switchBtn = document.getElementById("switch");

  let currentIndex = 0;
  let isTransitioning = false;

  // Alle Videos dürfen Ton haben, aber starten stumm (Browser-Sicherheitsrichtlinie)
  bgVideo.muted = true;
  bgVideoNext.muted = true;

  // === Intro: Klick zum Start ===
  intro.addEventListener("click", () => {
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.style.display = "none";
      slider.classList.add("active");
      bgVideo.muted = false;
      bgVideo.play().catch(() => {}); // Startversuch
    }, 800);
  });

  // === Hilfsfunktionen ===
  const fadeAudio = (video, targetVolume, duration) => {
    const step = (targetVolume - video.volume) / (duration / 50);
    const fade = setInterval(() => {
      video.volume = Math.max(0, Math.min(1, video.volume + step));
      if (
        (step > 0 && video.volume >= targetVolume) ||
        (step < 0 && video.volume <= targetVolume)
      ) {
        clearInterval(fade);
      }
    }, 50);
  };
  function switchCard() {
    if (isTransitioning) return;
    isTransitioning = true;

    const currentCard = cards[currentIndex];
    currentCard.classList.remove("active");

    currentIndex = (currentIndex + 1) % cards.length;
    const nextCard = cards[currentIndex];
    nextCard.classList.add("active");

    // Button in die aktive Karte hängen
    if (!nextCard.contains(switchBtn)) {
      nextCard.appendChild(switchBtn);
    }

    // === Video wechseln ===
    const currentVideo = bgVideo;
    const nextVideo = bgVideoNext;

    nextVideo.src = nextCard.dataset.video;
    nextVideo.load();
    nextVideo.currentTime = 0;
    nextVideo.volume = 0;
    nextVideo.muted = false;
    nextVideo.classList.remove("hidden");
    nextVideo.play().catch(() => {});

    // Audio-Fade Übergang
    fadeAudio(currentVideo, 0, 1500);
    fadeAudio(nextVideo, 1, 1500);

    // Video-Fade Übergang
    nextVideo.style.opacity = "1";
    currentVideo.style.opacity = "0";

    setTimeout(() => {
      currentVideo.pause();
      currentVideo.muted = true;
      currentVideo.classList.add("hidden");

      // Videos tauschen
      const tempSrc = currentVideo.src;
      currentVideo.src = nextVideo.src;
      nextVideo.src = tempSrc;

      currentVideo.style.opacity = "1";
      nextVideo.style.opacity = "0";
      isTransitioning = false;
    }, 1600);
  }

  switchBtn.addEventListener("click", switchCard);
});
