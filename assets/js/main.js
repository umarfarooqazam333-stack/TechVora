// Minimal JS: nav toggle, lazy loading images (native-first), keyboard accessibility
document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle && navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.style.display = expanded ? 'none' : 'block';
    // move focus into nav for keyboard users
    if(!expanded){
      const firstLink = mainNav.querySelector('a');
      firstLink && firstLink.focus();
    }
  });

  // Native lazy loading is preferred. Use IntersectionObserver as a progressive enhancement for older browsers.
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
    // Fallback: load immediately
    lazyImages.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy'); });
  }

  // Accessible skip link focus target
  const skip = document.querySelector('.skip-link');
  if(skip){
    skip.addEventListener('click', (e)=>{e.preventDefault(); document.querySelector('main').focus();});
  }
});
