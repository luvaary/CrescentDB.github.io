export function initDarkMode() {
  loadDarkMode();
  
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.addEventListener('click', toggleDarkMode);
  }
}

export function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('crescentDarkMode', isDark);
  updateToggleIcon();
}

export function loadDarkMode() {
  const isDark = localStorage.getItem('crescentDarkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
  updateToggleIcon();
}

function updateToggleIcon() {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  
  const isDark = document.body.classList.contains('dark-mode');
  toggle.textContent = isDark ? '☀️' : '🌙';
}

window.loadDarkMode = loadDarkMode;
window.toggleDarkMode = toggleDarkMode;
