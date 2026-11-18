const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = Array.from({ length: 42 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2.5 + 1,
    speed: Math.random() * 0.35 + 0.1,
    alpha: Math.random() * 0.5 + 0.25
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 209, 55, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    particle.y -= particle.speed;
    if (particle.y < -5) particle.y = canvas.height + 5;
  });
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
createParticles();
animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? '×' : '☰';
});
navLinks.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.textContent = '☰';
});

function updateCountdown() {
  const now = new Date();
  let target = new Date(now.getFullYear(), 10, 19, 0, 0, 0);
  if (now >= target) target = new Date(now.getFullYear() + 1, 10, 19, 0, 0, 0);

  const distance = target - now;
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance / 3600000) % 24);
  const minutes = Math.floor((distance / 60000) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-heading, .profile-card, .stats article, .timeline-track article, .wish-grid blockquote, .party-card')
  .forEach((element) => revealObserver.observe(element));

const movieScenes = [...document.querySelectorAll('.scene')];
const moviePlay = document.querySelector('.movie-play');
const movieMusic = document.querySelector('.movie-music');
let movieTimer = null;
let movieSceneIndex = 0;
let musicContext = null;
let musicTimer = null;
let musicNoteIndex = 0;
let musicChordIndex = 0;

const musicChords = [
  [261.63, 329.63, 392, 493.88],
  [220, 261.63, 329.63, 392],
  [174.61, 220, 261.63, 329.63],
  [196, 246.94, 293.66, 392]
];
const musicMelody = [523.25, 493.88, 392, 329.63, 392, 440, 493.88, 392];

function playMusicNote(frequency) {
  const oscillator = musicContext.createOscillator();
  const volume = musicContext.createGain();
  const now = musicContext.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
  oscillator.connect(volume);
  volume.connect(musicContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 1.85);
}

function setMusicState(isPlaying) {
  movieMusic.setAttribute('aria-pressed', String(isPlaying));
  movieMusic.setAttribute('aria-label', isPlaying ? 'Turn gentle music off' : 'Turn gentle music on');
  movieMusic.querySelector('span').textContent = isPlaying ? 'Music on' : 'Music off';
}

async function toggleMovieMusic() {
  if (musicContext) {
    window.clearInterval(musicTimer);
    musicTimer = null;
    await musicContext.close();
    musicContext = null;
    setMusicState(false);
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  musicContext = new AudioContextClass();
  if (musicContext.state === 'suspended') await musicContext.resume();
  musicNoteIndex = 0;
  musicChordIndex = 0;

  musicTimer = window.setInterval(() => {
    const chord = musicChords[musicChordIndex];
    playMusicNote(chord[musicNoteIndex % chord.length] * 2);
    playMusicNote(musicMelody[musicNoteIndex % musicMelody.length]);
    musicNoteIndex += 1;
    if (musicNoteIndex % 8 === 0) musicChordIndex = (musicChordIndex + 1) % musicChords.length;
  }, 720);

  setMusicState(true);
}

function showMovieScene(index) {
  movieScenes.forEach((scene, sceneIndex) => scene.classList.toggle('active', sceneIndex === index));
}

function playMovieScene(index = 0) {
  window.clearTimeout(movieTimer);
  if (!movieScenes.length) return;
  movieSceneIndex = index % movieScenes.length;
  showMovieScene(movieSceneIndex);
  const scene = movieScenes[movieSceneIndex];
  moviePlay.querySelector('span').textContent = 'Playing';

  movieTimer = window.setTimeout(() => {
    if (movieSceneIndex < movieScenes.length - 1) {
      playMovieScene(movieSceneIndex + 1);
    } else {
      moviePlay.querySelector('span').textContent = 'Play story';
    }
  }, Number(scene.dataset.duration || 6500));
}

if (moviePlay) {
  moviePlay.addEventListener('click', () => playMovieScene(movieSceneIndex));
}

if (movieMusic) {
  movieMusic.addEventListener('click', toggleMovieMusic);
}
