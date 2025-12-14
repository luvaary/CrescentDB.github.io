export function initHistory() {
  loadSearchHistory();
}

export function addToSearchHistory(query, resultCount) {
  const history = getHistory();
  
  const entry = {
    query: query,
    results: resultCount,
    timestamp: new Date().toISOString()
  };
  
  history.unshift(entry);
  
  if (history.length > 20) {
    history.pop();
  }
  
  localStorage.setItem('crescentHistory', JSON.stringify(history));
  updateHistoryDisplay();
}

export function loadSearchHistory() {
  updateHistoryDisplay();
}

export function clearHistory() {
  if (confirm('Clear all search history?')) {
    localStorage.removeItem('crescentHistory');
    updateHistoryDisplay();
  }
}

function getHistory() {
  const saved = localStorage.getItem('crescentHistory');
  return saved ? JSON.parse(saved) : [];
}

function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  
  const history = getHistory();
  
  if (history.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No search history yet</p>';
    return;
  }
  
  historyList.innerHTML = history.map(entry => {
    const date = new Date(entry.timestamp);
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    return `
      <div class="history-item" onclick="searchFromHistory('${entry.query}')">
        <div class="history-query">${entry.query}</div>
        <div class="history-meta">${entry.results} results · ${timeStr}</div>
      </div>
    `;
  }).join('');
}

window.searchFromHistory = function(query) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = query;
    if (typeof window.performSearch === 'function') {
      window.performSearch();
    }
  }
};

window.loadSearchHistory = loadSearchHistory;
window.addToSearchHistory = addToSearchHistory;
window.clearHistory = clearHistory;
