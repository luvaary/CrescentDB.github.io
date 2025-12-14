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

function loadFeatures() {
  if (typeof window.loadNotes === 'function') {
    window.loadNotes();
  }
  
  if (typeof window.loadSearchHistory === 'function') {
    window.loadSearchHistory();
  }
  
  if (typeof window.initTimer === 'function') {
    window.initTimer();
  }
}
