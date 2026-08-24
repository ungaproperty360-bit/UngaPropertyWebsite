(function(){
  function initMobileMenu(){
    const menuBtn=document.querySelector('.menu');
    const nav=document.querySelector('.navlinks');
    if(!menuBtn || !nav) return;

    // Avoid duplicate handlers if this script is initialized more than once.
    if(menuBtn.dataset.mobileReady==='1') return;
    menuBtn.dataset.mobileReady='1';

    menuBtn.type='button';
    menuBtn.setAttribute('aria-controls','mobile-navigation');
    menuBtn.setAttribute('aria-expanded','false');
    menuBtn.setAttribute('aria-label','Open menu');
    nav.id='mobile-navigation';

    function closeMenu(){
      nav.classList.remove('mobile-open');
      nav.querySelectorAll('.mobile-expanded').forEach(el=>el.classList.remove('mobile-expanded'));
      menuBtn.setAttribute('aria-expanded','false');
      menuBtn.setAttribute('aria-label','Open menu');
      menuBtn.textContent='☰';
    }

    function toggleMenu(e){
      if(e){e.preventDefault();e.stopPropagation();}
      const isOpen=nav.classList.toggle('mobile-open');
      menuBtn.setAttribute('aria-expanded',String(isOpen));
      menuBtn.setAttribute('aria-label',isOpen?'Close menu':'Open menu');
      menuBtn.textContent=isOpen?'×':'☰';
    }

    menuBtn.addEventListener('click',toggleMenu);
    menuBtn.addEventListener('touchend',function(e){
      // Prevent mobile browsers from producing a second synthetic click.
      e.preventDefault();
      toggleMenu(e);
    },{passive:false});

    nav.querySelectorAll('.navdrop > a').forEach(link=>{
      link.addEventListener('click',function(e){
        if(window.innerWidth<=720){
          const parent=this.parentElement;
          const dropdown=parent.querySelector(':scope > .dropdown');
          if(dropdown){
            e.preventDefault();
            e.stopPropagation();
            parent.classList.toggle('mobile-expanded');
          }
        }
      });
    });

    nav.querySelectorAll('.dropdown a, a:not(.navdrop > a)').forEach(link=>{
      link.addEventListener('click',function(){
        if(window.innerWidth<=720) closeMenu();
      });
    });

    document.addEventListener('click',function(e){
      if(window.innerWidth<=720 && nav.classList.contains('mobile-open') &&
         !nav.contains(e.target) && !menuBtn.contains(e.target)){
        closeMenu();
      }
    });

    window.addEventListener('resize',function(){
      if(window.innerWidth>720) closeMenu();
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initMobileMenu);
  }else{
    initMobileMenu();
  }

  function initMobileLogin(){
    const btn=document.getElementById('mobileLogin');
    if(!btn || btn.dataset.ready==='1') return;
    btn.dataset.ready='1';
    btn.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      const nav=document.querySelector('.navlinks');
      const menuBtn=document.querySelector('.menu');
      if(nav) nav.classList.remove('mobile-open');
      if(menuBtn){menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open menu');menuBtn.textContent='☰';}
      if(typeof openAuth==='function') openAuth('loginView');
      else document.getElementById('login')?.click();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMobileLogin); else initMobileLogin();
})();
