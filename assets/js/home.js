// Homepage dynamic renderer: populates featured, latest, trending and category previews using search/index.json
// Keeps client-side rendering minimal and accessible

(function(){
  function siteRoot(){ const base = document.querySelector('base'); return base ? base.getAttribute('href') || './' : './'; }
  document.addEventListener('DOMContentLoaded', async function(){
    try{
      const resp = await fetch(siteRoot() + 'search/index.json');
      const docs = await resp.json();
      const featured = docs.find(d=>d.is_featured) || docs.sort((a,b)=> new Date(b.published_at)-new Date(a.published_at))[0];
      if(featured){
        const fTitle = document.querySelector('#featured-title');
        const fExcerpt = document.querySelector('.featured .excerpt');
        const fAuthor = document.querySelector('.featured .meta');
        const fImg = document.querySelector('.featured-media img');
        if(fTitle) fTitle.innerHTML = `<a href="${siteRoot()}${featured.url.replace(/^\//,'')}">${featured.title}</a>`;
        if(fExcerpt) fExcerpt.textContent = featured.excerpt;
        if(fAuthor) fAuthor.innerHTML = `By <a href="${siteRoot()}${featured.author_url ? featured.author_url.replace(/^\//,'') : 'authors/'+featured.author_slug+'.html'}">${featured.author}</a> • ${featured.published_at} • ${featured.reading_time} min read`;
        if(fImg) fImg.src = featured.image && featured.image.startsWith('/') ? siteRoot().replace(/\/$/,'') + featured.image : siteRoot() + (featured.image || 'assets/images/featured-smartphone.jpg');
      }

      const latestEl = document.querySelector('#latest-list');
      if(latestEl){
        const latest = docs.sort((a,b)=> new Date(b.published_at)-new Date(a.published_at)).slice(0,6);
        latestEl.innerHTML = latest.map(d=>`
          <article class="card">
            <img src="${d.image && d.image.startsWith('/') ? siteRoot().replace(/\/$/,'') + d.image : siteRoot() + (d.image || 'assets/images/placeholder-1.svg')}" alt="${d.image_alt}" class="card-img" loading="lazy">
            <div class="card-body">
              <a class="card-category" href="${siteRoot()}${d.category_url.replace(/^\//,'')}">${d.category}</a>
              <h3><a href="${siteRoot()}${d.url.replace(/^\//,'')}">${d.title}</a></h3>
              <p class="card-excerpt">${d.excerpt}</p>
              <div class="card-meta">${d.published_at} • ${d.reading_time} min • <a href="${siteRoot()}${d.author_url ? d.author_url.replace(/^\//,'') : 'authors/'+d.author_slug+'.html'}">${d.author}</a></div>
            </div>
          </article>
        `).join('');
      }

      const trendingEl = document.querySelector('#trending-list');
      if(trendingEl){
        const trending = docs.sort((a,b)=> new Date(b.published_at)-new Date(a.published_at)).slice(0,5);
        trendingEl.innerHTML = trending.map(d=>`<li><a href="${siteRoot()}${d.url.replace(/^\//,'')}">${d.title}</a></li>`).join('');
      }

      const categorySections = document.querySelectorAll('[data-category-preview]');
      categorySections.forEach(sec=>{
        const cat = sec.dataset.categoryPreview;
        const items = docs.filter(d=>d.category.toLowerCase()===cat.toLowerCase()).slice(0,4);
        sec.innerHTML = items.map(i=>`<li><a href="${siteRoot()}${i.url.replace(/^\//,'')}">${i.title}</a></li>`).join('');
      });

    }catch(err){
      console.error('Homepage dynamic render failed', err);
    }
  });
})();
