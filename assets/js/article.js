// Article utilities: generate TOC, related articles, prev/next navigation and inject Article JSON-LD
(function(){
  function siteRoot(){ const base = document.querySelector('base'); return base ? base.getAttribute('href') || './' : './'; }
  document.addEventListener('DOMContentLoaded', async function(){
    try{
      const path = location.pathname;
      const match = path.match(/\/articles\/(.+)\.html$/);
      if(!match) return;
      const slug = match[1];

      let siteConfig = { siteUrl: '' };
      try{
        const conf = await fetch(siteRoot() + 'config/site.config.json');
        if(conf.ok) siteConfig = await conf.json();
      }catch(e){}

      let doc = null;
      try{
        const resp = await fetch(siteRoot() + 'content/articles/' + slug + '.json');
        if(resp.ok) doc = await resp.json();
      }catch(e){}

      if(!doc){
        try{
          const resp = await fetch(siteRoot() + 'search/index.json');
          if(resp.ok){
            const docs = await resp.json();
            doc = (docs || []).find(d => d.slug === slug || d.id === slug);
          }
        }catch(e){console.warn('search/index.json not available');}
      }

      if(!doc) return;

      const relatedContainer = document.querySelector('.related ul');
      if(relatedContainer){
        let related = [];
        if(doc.related && doc.related.length){
          for(const r of doc.related){
            try{ const resp = await fetch(siteRoot() + 'content/articles/' + r + '.json'); if(resp.ok){ related.push(await resp.json()); continue; } }catch(e){}
            try{ const idx = await fetch(siteRoot() + 'search/index.json'); if(idx.ok){ const arr = await idx.json(); const found = arr.find(x => x.id === r || x.slug === r); if(found) related.push(found); } }catch(e){}
          }
        }
        if(related.length===0){
          const idx = await fetch(siteRoot() + 'search/index.json');
          if(idx.ok){ const arr = await idx.json(); related = arr.filter(d=>d.category===doc.category && d.id!==doc.id).slice(0,3); }
        }
        relatedContainer.innerHTML = related.map(r=>`<li><a href="${siteRoot()}${r.url.replace(/^\//,'')}">${r.title}</a></li>`).join('');
      }

      try{
        const resp = await fetch(siteRoot() + 'search/index.json');
        if(resp.ok){
          const docs = await resp.json();
          const sorted = docs.slice().sort((a,b)=> new Date(a.published_at) - new Date(b.published_at));
          const idx = sorted.findIndex(d=>d.id===doc.id || d.slug===doc.slug);
          const prev = sorted[idx-1];
          const next = sorted[idx+1];
          const prevEl = document.querySelector('.article-nav .prev');
          const nextEl = document.querySelector('.article-nav .next');
          if(prevEl) prevEl.innerHTML = prev ? `<a href="${siteRoot()}${prev.url.replace(/^\//,'')}">← ${prev.title}</a>` : '';
          if(nextEl) nextEl.innerHTML = next ? `<a href="${siteRoot()}${next.url.replace(/^\//,'')}">${next.title} →</a>` : '';
        }
      }catch(e){ console.warn('Prev/Next generation failed', e); }

      const contentEl = document.querySelector('.content');
      const tocEl = document.querySelector('.toc');
      if(contentEl && tocEl){
        const headings = contentEl.querySelectorAll('h2, h3');
        if(headings.length>0){
          const list = document.createElement('ul');
          headings.forEach(h=>{ if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-'); const li = document.createElement('li'); li.className = h.tagName.toLowerCase(); li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`; list.appendChild(li); });
          tocEl.innerHTML = '<h2>Contents</h2>'; tocEl.appendChild(list);
        }
      }

      document.querySelectorAll('img').forEach(img=>{ if(!img.alt || img.alt.trim()==='') console.warn('Image missing alt:', img.src); });

      try{
        const siteUrl = (siteConfig && siteConfig.siteUrl) ? siteConfig.siteUrl.replace(/\/$/,'') : window.location.origin.replace(/\/$/,'');
        const canonical = (doc.canonical_url && doc.canonical_url.startsWith('http')) ? doc.canonical_url : (siteUrl + (doc.canonical_url || doc.url || '/articles/' + slug + '.html'));
        const image = (doc.og_image && doc.og_image.startsWith('http')) ? doc.og_image : (siteUrl + (doc.og_image || doc.featured_image || ''));
        const jsonld = {
          "@context": "https://schema.org",
          "@type": "Article",
          "mainEntityOfPage": {"@type":"WebPage","@id": canonical},
          "headline": doc.title,
          "description": doc.meta_description || doc.excerpt || '',
          "image": [ image ],
          "author": {"@type":"Person","name": doc.author || doc.author_slug || ''},
          "publisher": {"@type":"Organization","name":"TechVora","logo":{"@type":"ImageObject","url": siteUrl + '/assets/images/logo.svg'}},
          "datePublished": doc.published_at,
          "dateModified": doc.updated_at || doc.published_at
        };
        const script = document.createElement('script'); script.type = 'application/ld+json'; script.text = JSON.stringify(jsonld, null, 2); document.head.appendChild(script);
      }catch(err){ console.warn('Failed to generate JSON-LD', err); }

    }catch(err){ console.error('Article helper failed', err); }
  });
})();
