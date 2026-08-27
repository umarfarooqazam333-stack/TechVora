// Category page renderer: fills featured and latest lists using /search/index.json

document.addEventListener('DOMContentLoaded', async function(){
  try{
    // Respect base href for GitHub Pages compatibility
    function getBasePath(){
      const base = document.querySelector('base');
      return base ? base.getAttribute('href') || '' : '';
    }
    const basePath = getBasePath();
    const searchIndexUrl = basePath + 'search/index.json';
    const resp = await fetch(searchIndexUrl);
    const docs = await resp.json();
    const path = location.pathname;
    const match = path.match(/\/categories\/(.+)\.html$/);
    if(!match) return;
    const categorySlug = match[1];
    // Map slugs to category title (simple capitalization)
    const categoryTitle = categorySlug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    const titleEl = document.querySelector('h1');
    if(titleEl) titleEl.textContent = categoryTitle;

    const featuredEl = document.querySelector('.featured-list .cards-grid');
    const latestEl = document.querySelector('.latest-list .cards-grid');
    const items = docs.filter(d=>d.category.toLowerCase()===categoryTitle.toLowerCase());
    if(featuredEl){
      const featured = items.filter(i=>i.is_featured).slice(0,3);
      featuredEl.innerHTML = featured.map(d=>`
        <article class="card">
          <img src="${d.image}" alt="${d.image_alt}" class="card-img" loading="lazy">
          <div class="card-body"><h3><a href="${d.url}">${d.title}</a></h3><p class="card-excerpt">${d.excerpt}</p></div>
        </article>
      `).join('')
    }
    if(latestEl){
      const latest = items.sort((a,b)=> new Date(b.published_at)-new Date(a.published_at)).slice(0,12);
      latestEl.innerHTML = latest.map(d=>`
        <article class="card">
          <img src="${d.image}" alt="${d.image_alt}" class="card-img" loading="lazy">
          <div class="card-body"><h3><a href="${d.url}">${d.title}</a></h3><p class="card-excerpt">${d.excerpt}</p></div>
        </article>
      `).join('')
    }
  }catch(err){console.error('Category renderer failed', err);} 
});
