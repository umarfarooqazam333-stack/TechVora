// Homepage dynamic renderer: populates featured, latest, trending and category previews using /search/index.json
// Keeps client-side rendering minimal and accessible

document.addEventListener('DOMContentLoaded', async function(){
  try{
    const resp = await fetch('/search/index.json');
    const docs = await resp.json();
    // Featured: article with is_featured true, fallback to most recent
    const featured = docs.find(d=>d.is_featured) || docs.sort((a,b)=> new Date(b.published_at)-new Date(a.published_at))[0];
    if(featured){
      const fTitle = document.querySelector('#featured-title');
      const fExcerpt = document.querySelector('.featured .excerpt');
      const fAuthor = document.querySelector('.featured .meta');
      const fImg = document.querySelector('.featured-media img');
      if(fTitle) fTitle.innerHTML = `<a href="${featured.url}">${featured.title}</a>`;
      if(fExcerpt) fExcerpt.textContent = featured.excerpt;
      if(fAuthor) fAuthor.innerHTML = `By <a href="${featured.author_url || '/authors/'+featured.author_slug+'.html'}">${featured.author}</a> • ${featured.published_at} • ${featured.reading_time} min read`;
      if(fImg) fImg.src = featured.image;
    }

    // Latest articles
    const latestEl = document.querySelector('#latest-list');
    if(latestEl){
      const latest = docs.sort((a,b)=> new Date(b.published_at)-new Date(a.published_at)).slice(0,6);
      latestEl.innerHTML = latest.map(d=>`
        <article class="card">
          <img src="${d.image}" alt="${d.image_alt}" class="card-img" loading="lazy">
          <div class="card-body">
            <a class="card-category" href="${d.category_url}">${d.category}</a>
            <h3><a href="${d.url}">${d.title}</a></h3>
            <p class="card-excerpt">${d.excerpt}</p>
            <div class="card-meta">${d.published_at} • ${d.reading_time} min • <a href="${d.author_url}">${d.author}</a></div>
          </div>
        </article>
      `).join('');
    }

    // Trending (basic heuristic: recent and popular tags)
    const trendingEl = document.querySelector('#trending-list');
    if(trendingEl){
      const trending = docs.sort((a,b)=> new Date(b.published_at)-new Date(a.published_at)).slice(0,5);
      trendingEl.innerHTML = trending.map(d=>`<li><a href="${d.url}">${d.title}</a></li>`).join('');
    }

    // Category previews: populate first 2 items per category section
    const categorySections = document.querySelectorAll('[data-category-preview]');
    categorySections.forEach(sec=>{
      const cat = sec.dataset.categoryPreview;
      const items = docs.filter(d=>d.category.toLowerCase()===cat.toLowerCase()).slice(0,4);
      sec.innerHTML = items.map(i=>`<li><a href="${i.url}">${i.title}</a></li>`).join('');
    });

  }catch(err){
    console.error('Homepage dynamic render failed', err);
  }
});
