// Minimal JS: nav toggle, search toggle, lazy loading images
document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle && navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.style.display = expanded ? 'none' : 'block';
  });

  // Lazy load images
  const lazyImages = document.querySelectorAll('img.lazy');
  if('IntersectionObserver' in window){
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
    lazyImages.forEach(img => img.src = img.dataset.src);
  }

  // Search button toggle (progressive enhancement)
  const searchBtn = document.querySelector('.search-btn');
  if(searchBtn){
    searchBtn.addEventListener('click', ()=>{
      const q = prompt('Search TechVora (static demo): enter keywords');
      if(q) location.href = '/search.html?q=' + encodeURIComponent(q);
    });
  }
});
