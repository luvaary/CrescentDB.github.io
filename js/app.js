import { initSearch, performSearch } from './search.js';
import { updateClock, toggleSpotify, fadeInPage } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌙 Crescent initialized');
  
  updateClock();
  setInterval(updateClock, 1000);
  
  initSearch();
  
  setupEventListeners();
  
  fadeInPage();
  
  loadFeatures();
});

function setupEventListeners() {
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  const spotifyToggle = document.getElementById('spotifyToggle');
  const closeSpotify = document.getElementById('closeSpotify');
  
  if (spotifyToggle) {
    spotifyToggle.addEventListener('click', toggleSpotify);
  }
  
  if (closeSpotify) {
    closeSpotify.addEventListener('click', toggleSpotify);
  }
}

async function loadFeatures() {
  try {
    const { initNotes } = await import('./features/notes.js');
    initNotes();
  } catch (e) {}
  
  try {
    const { initHistory } = await import('./features/history.js');
    initHistory();
  } catch (e) {}
  
  try {
    const { initDarkMode } = await import('./features/darkmode.js');
    initDarkMode();
  } catch (e) {}
  
  try {
    const { initTimer } = await import('./features/timer.js');
    initTimer();
  } catch (e) {}
  
  try {
    const { initBookmarks } = await import('./features/bookmarks.js');
    initBookmarks();
  } catch (e) {}
}
