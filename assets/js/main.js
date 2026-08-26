// Minimal JS: nav toggle, lazy loading images (native-first), keyboard accessibility
(function(){
  function siteRoot(){ const base = document.querySelector('base'); return base ? base.getAttribute('href') || './' : './'; }
  document.addEventListener('DOMContentLoaded', function(){
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-nav');
    navToggle && navToggle.addEventListener('click', ()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.style.display = expanded ? 'none' : 'block';
      if(!expanded){
        const firstLink = mainNav.querySelector('a');
        firstLink && firstLink.focus();
      }
    });

    const lazyImages = document.querySelectorAll('img[data-src].lazy');
    if('loading' in HTMLImageElement.prototype){
      lazyImages.forEach(img=>{img.src = img.dataset.src; img.removeAttribute('data-src'); img.classList.remove('lazy');});
    } else if('IntersectionObserver' in window){
      let io = new IntersectionObserver((entries, obs)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            const img = e.target; img.src = img.dataset.src; img.classList.remove('lazy');
            obs.unobserve(img);
          }
        })
      });
      lazyImages.forEach(img => io.observe(img));
    } else {
      lazyImages.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy'); });
    }

    const skip = document.querySelector('.skip-link');
    if(skip){
      skip.addEventListener('click', (e)=>{e.preventDefault(); document.querySelector('main').focus();});
    }
  });
})();
