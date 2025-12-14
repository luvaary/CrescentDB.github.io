export function updateClock() {
  const clock = document.getElementById('clock');
  if (!clock) return;

  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function toggleSpotify() {
  const panel = document.getElementById('spotifyPanel');
  if (!panel) return;
  panel.classList.toggle('open');
}

export function fadeInPage() {
  requestAnimationFrame(() => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
}
