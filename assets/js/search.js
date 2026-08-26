// Simple client-side search for static TechVora site
// - Loads search/index.json (generated from repo articles)
// - Performs tokenized scoring (title boost, category boost, excerpt)
// - Returns up to 20 results sorted by score

(function(){
  function siteRoot(){
    const base = document.querySelector('base');
    if(base) return base.getAttribute('href') || './';
    return './';
  }

  window.addEventListener('DOMContentLoaded', async function(){
    const resp = await fetch(siteRoot() + 'search/index.json');
    const docs = await resp.json();
    const qInput = document.getElementById('q');
    const resultsEl = document.getElementById('results');

    function normalize(text){
      return (text || '').toLowerCase();
    }

    function scoreDoc(doc, terms){
      let score = 0;
      const title = normalize(doc.title);
      const category = normalize(doc.category);
      const excerpt = normalize(doc.excerpt || '');
      const content = normalize(doc.content || '');
      terms.forEach(t => {
        if(title.includes(t)) score += 5;
        if(category.includes(t)) score += 3;
        if(excerpt.includes(t)) score += 2;
        if(content.includes(t)) score += 1;
      });
      if(doc.published_at){
        const ageDays = (Date.now() - new Date(doc.published_at).getTime()) / (1000*60*60*24);
        if(ageDays < 7) score += 2;
        else if(ageDays < 30) score += 1;
      }
      return score;
    }

    function renderResults(items){
      if(!items || items.length===0){
        resultsEl.innerHTML = '<p>No results found. Try different keywords.</p>';
        return;
      }
      const list = document.createElement('div');
      list.className = 'cards-grid';
      items.slice(0,20).forEach(doc => {
        const imgSrc = doc.image ? (doc.image.startsWith('/') ? siteRoot().replace(/\/$/,'') + doc.image : siteRoot() + doc.image) : siteRoot() + 'assets/images/placeholder-1.svg';
        const authorUrl = doc.author_url ? (doc.author_url.startsWith('/') ? siteRoot().replace(/\/$/,'') + doc.author_url : siteRoot() + doc.author_url) : siteRoot() + 'authors/' + (doc.author_slug || '') + '.html';
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <img src="${imgSrc}" alt="${doc.image_alt || ''}" class="card-img" loading="lazy">
          <div class="card-body">
            <a class="card-category" href="${siteRoot()}${doc.category_url.replace(/^\//,'')}">${doc.category}</a>
            <h3><a href="${siteRoot()}${doc.url.replace(/^\//,'')}">${doc.title}</a></h3>
            <p class="card-excerpt">${doc.excerpt || ''}</p>
            <div class="card-meta">${doc.published_at || ''} • ${doc.reading_time ? doc.reading_time + ' min' : ''} • <a href="${authorUrl}">${doc.author}</a></div>
          </div>
        `;
        list.appendChild(card);
      });
      resultsEl.innerHTML = '';
      resultsEl.appendChild(list);
    }

    function search(q){
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      if(terms.length===0){ resultsEl.innerHTML = '<p>Enter a search term to find articles.</p>'; return; }
      const scored = docs.map(d => ({d, score: scoreDoc(d, terms)})).filter(x=>x.score>0).sort((a,b)=>b.score - a.score).map(x=>x.d);
      renderResults(scored);
    }

    let timeout;
    qInput.addEventListener('input', (e)=>{
      clearTimeout(timeout);
      timeout = setTimeout(()=> search(e.target.value), 200);
    });

    resultsEl.innerHTML = '<p>Enter a search term to find articles.</p>';
  });
})();
