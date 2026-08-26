// Simple client-side search for static TechVora site
// - Loads /search/index.json (generated from repo articles)
// - Performs tokenized scoring (title boost, category boost, excerpt)
// - Returns up to 20 results sorted by score

(async function(){
  const resp = await fetch('/search/index.json');
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
    // boost recent articles slightly
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
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${doc.image || '/assets/images/placeholder-1.svg'}" alt="${doc.image_alt || ''}" class="card-img" loading="lazy">
        <div class="card-body">
          <a class="card-category" href="${doc.category_url}">${doc.category}</a>
          <h3><a href="${doc.url}">${doc.title}</a></h3>
          <p class="card-excerpt">${doc.excerpt || ''}</p>
          <div class="card-meta">${doc.published_at || ''} • ${doc.reading_time ? doc.reading_time + ' min' : ''} • <a href="${doc.author_url || '#'}">${doc.author}</a></div>
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

  // show an initial message
  resultsEl.innerHTML = '<p>Enter a search term to find articles.</p>';
})();
