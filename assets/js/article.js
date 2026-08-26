// Article utilities: generate TOC, related articles, prev/next navigation using /search/index.json

document.addEventListener('DOMContentLoaded', async function(){
  try{
    const resp = await fetch('/search/index.json');
    const docs = await resp.json();
    // Determine current slug from URL
    const path = location.pathname;
    const match = path.match(/\/articles\/(.+)\.html$/);
    if(!match) return; // not an article page
    const slug = match[1];
    const doc = docs.find(d=>d.id===slug || d.slug===slug || d.url.endsWith(slug+'.html'));
    if(!doc) return;

    // Related articles (curated list in doc.related or automatic by category)
    const relatedContainer = document.querySelector('.related ul');
    if(relatedContainer){
      let related = [];
      if(doc.related && doc.related.length) related = doc.related.map(id=>docs.find(d=>d.id===id)).filter(Boolean);
      if(related.length===0) related = docs.filter(d=>d.category===doc.category && d.id!==doc.id).slice(0,3);
      relatedContainer.innerHTML = related.map(r=>`<li><a href="${r.url}">${r.title}</a></li>`).join('');
    }

    // Prev/next navigation by published date
    const sorted = docs.slice().sort((a,b)=> new Date(a.published_at) - new Date(b.published_at));
    const idx = sorted.findIndex(d=>d.id===doc.id);
    const prev = sorted[idx-1];
    const next = sorted[idx+1];
    const prevEl = document.querySelector('.article-nav .prev');
    const nextEl = document.querySelector('.article-nav .next');
    if(prevEl) prevEl.innerHTML = prev ? `<a href="${prev.url}">← ${prev.title}</a>` : '';
    if(nextEl) nextEl.innerHTML = next ? `<a href="${next.url}">${next.title} →</a>` : '';

    // Generate table of contents for long articles (H2/H3 headings inside .content)
    const contentEl = document.querySelector('.content');
    const tocEl = document.querySelector('.toc');
    if(contentEl && tocEl){
      const headings = contentEl.querySelectorAll('h2, h3');
      if(headings.length>0){
        const list = document.createElement('ul');
        headings.forEach(h=>{
          if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-');
          const li = document.createElement('li');
          li.className = h.tagName.toLowerCase();
          li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
          list.appendChild(li);
        });
        tocEl.innerHTML = '<h2>Contents</h2>';
        tocEl.appendChild(list);
      }
    }

    // Ensure images have alt text (report missing ones in console)
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img=>{ if(!img.alt || img.alt.trim()==='') console.warn('Image missing alt:', img.src); });

  }catch(err){
    console.error('Article helper failed', err);
  }
});
