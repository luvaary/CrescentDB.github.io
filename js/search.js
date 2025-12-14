export const apiConfigs = {
  wikipedia: {
    name: 'Wikipedia',
    class: 'source-wikipedia',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
        );
        if (!response.ok) return [];

        const data = await response.json();
        return [{
          title: data.title,
          excerpt: data.extract,
          source: 'Wikipedia',
          sourceClass: 'source-wikipedia',
          url: data.content_urls?.desktop?.page,
          meta: { type: 'Article' }
        }];
      } catch (error) {
        console.error('Wikipedia API error:', error);
        return [];
      }
    }
  },

  openlib: {
    name: 'Open Library',
    class: 'source-openlib',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();

        return (data.docs || []).map(book => ({
          title: book.title,
          excerpt: `By ${book.author_name?.join(', ') || 'Unknown'} · First published ${book.first_publish_year || 'N/A'}`,
          source: 'Open Library',
          sourceClass: 'source-openlib',
          url: `https://openlibrary.org${book.key}`,
          meta: { type: 'Book' }
        }));
      } catch (error) {
        console.error('Open Library API error:', error);
        return [];
      }
    }
  },

  dictionary: {
    name: 'Dictionary',
    class: 'source-dictionary',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`
        );
        if (!response.ok) return [];

        const data = await response.json();
        return data.map(entry => ({
          title: entry.word,
          excerpt: entry.meanings?.map(m => `(${m.partOfSpeech}) ${m.definitions?.[0]?.definition}`).join(' · ') || '',
          source: 'Dictionary',
          sourceClass: 'source-dictionary',
          url: entry.sourceUrls?.[0],
          meta: { type: 'Definition', phonetic: entry.phonetic }
        }));
      } catch (error) {
        console.error('Dictionary API error:', error);
        return [];
      }
    }
  },

  nasa: {
    name: 'NASA',
    class: 'source-nasa',
    search: async (query) => {
      try {
        const response = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
        );
        if (!response.ok) return [];

        const data = await response.json();
        return (data.collection?.items || []).slice(0, 5).map(item => ({
          title: item.data?.[0]?.title || 'Untitled',
          excerpt: item.data?.[0]?.description?.substring(0, 200) || '',
          source: 'NASA',
          sourceClass: 'source-nasa',
          url: item.links?.[0]?.href,
          meta: { type: 'Image', date: item.data?.[0]?.date_created?.split('T')[0] }
        }));
      } catch (error) {
        console.error('NASA API error:', error);
        return [];
      }
    }
  }
};

let selectedAPI = 'all';

export function initSearch() {
  document.querySelectorAll('.api-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.api-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedAPI = chip.dataset.api;
    });
  });

  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

export async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const resultsSection = document.getElementById('resultsSection');
  const emptyState = document.getElementById('emptyState');
  const loading = document.getElementById('loading');
  const resultsGrid = document.getElementById('resultsGrid');
  const resultsCount = document.getElementById('resultsCount');

  resultsSection.style.display = 'block';
  emptyState.style.display = 'none';
  loading.classList.add('active');
  resultsGrid.innerHTML = '';

  try {
    let results = [];

    if (selectedAPI === 'all') {
      const promises = Object.values(apiConfigs).map(api => api.search(query).catch(() => []));
      const allResults = await Promise.all(promises);
      results = allResults.flat();
    } else if (apiConfigs[selectedAPI]) {
      results = await apiConfigs[selectedAPI].search(query);
    }

    loading.classList.remove('active');
    resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;

    if (results.length === 0) {
      resultsGrid.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No results found. Try a different search term or source.</p>
      </div>`;
      return;
    }

    results.forEach((result, index) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.style.animationDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <div class="result-source">
          <span class="source-dot ${result.sourceClass}"></span>
          ${result.source}
        </div>
        <h3 class="result-title">${result.title}</h3>
        <p class="result-excerpt">${result.excerpt}</p>
        <div class="result-meta">
          <span>${result.meta?.type || 'Result'}</span>
          ${result.meta?.phonetic ? `<span>${result.meta.phonetic}</span>` : ''}
          ${result.meta?.date ? `<span>${result.meta.date}</span>` : ''}
        </div>
        <button class="bookmark-btn" onclick="event.stopPropagation(); window.addBookmark(${JSON.stringify(result).replace(/"/g, '&quot;')})">⭐</button>
      `;
      card.onclick = () => {
        if (result.url) window.open(result.url, '_blank');
      };
      resultsGrid.appendChild(card);
    });

    if (typeof window.addToSearchHistory === 'function') {
      window.addToSearchHistory(query, results.length);
    }

  } catch (error) {
    loading.classList.remove('active');
    resultsGrid.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">
      <p>Something went wrong. Please try again.</p>
    </div>`;
  }
}
