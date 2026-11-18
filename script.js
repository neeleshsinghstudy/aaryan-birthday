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

  document.getElementById('days').textContent = String(days).padStart(3, '0');
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
let movieTimer = null;
let movieSceneIndex = 0;

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
