/* =============== SPLASH (show once on page load) =============== */
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  const content = document.getElementById('content') || document.body; // content already in DOM
  // show splash for ~1.8s then hide & reveal hero (we used CSS animation already)
  setTimeout(() => {
    splash.style.transition = 'opacity .6s ease';
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 650);
  }, 1600);
});

/* =============== HOVER CARD (for action buttons) =============== */
const hoverCard = document.getElementById('hover-card');

// delegate: all elements with data-hover attribute
document.querySelectorAll('[data-hover]').forEach(el => {
  const text = el.getAttribute('data-hover');

  function onEnter(e){
    hoverCard.textContent = text;
    hoverCard.style.opacity = '1';
    hoverCard.setAttribute('aria-hidden', 'false');
    positionCard(e);
    // bind move
    el.addEventListener('mousemove', positionCard);
  }
  function onLeave(){
    hoverCard.style.opacity = '0';
    hoverCard.setAttribute('aria-hidden', 'true');
    el.removeEventListener('mousemove', positionCard);
  }

  function positionCard(e){
    // place above element, follow x while clamped in element bounds
    const rect = el.getBoundingClientRect();
    const x = e.clientX;
    const centerX = Math.min(Math.max(x, rect.left + 12), rect.right - 12); // clamp
    const top = rect.top - 12;
    // convert to viewport coords
    hoverCard.style.left = (centerX) + 'px';
    hoverCard.style.top = (top - hoverCard.offsetHeight) + 'px';
    hoverCard.style.transform = 'translateX(-50%) translateY(0) scale(1)';
  }

  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);

  // keyboard accessibility: focus shows card (position centered)
  el.addEventListener('focus', (e) => {
    hoverCard.textContent = text;
    const rect = el.getBoundingClientRect();
    hoverCard.style.left = (rect.left + rect.width/2) + 'px';
    hoverCard.style.top = (rect.top - 28) + 'px';
    hoverCard.style.opacity = '1';
    hoverCard.setAttribute('aria-hidden','false');
  });
  el.addEventListener('blur', () => {
    hoverCard.style.opacity = '0';
    hoverCard.setAttribute('aria-hidden','true');
  });
});

/* =============== GALLERY: wheel + right-click drag to scroll =============== */
const gallery = document.getElementById('galleryScroll') || document.querySelector('.gallery-scroll');

if (gallery) {
  // allow wheel for horizontal scroll (shift), but we want horizontal scroll via mouse wheel normally too
  gallery.addEventListener('wheel', function(e){
    // if vertical wheel, translate to horizontal for better UX
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      gallery.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  // RIGHT-CLICK drag
  let isDragging = false;
  let startX, startScroll;
  gallery.addEventListener('contextmenu', (ev) => ev.preventDefault()); // disable context menu inside gallery
  gallery.addEventListener('mousedown', (ev) => {
    if (ev.button === 2) {
      isDragging = true;
      startX = ev.pageX - gallery.offsetLeft;
      startScroll = gallery.scrollLeft;
      gallery.style.cursor = 'grabbing';
      ev.preventDefault();
    }
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    gallery.style.cursor = 'grab';
  });
  gallery.addEventListener('mousemove', (ev) => {
    if (!isDragging) return;
    const x = ev.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.8;
    gallery.scrollLeft = startScroll - walk;
  });
}

/* =============== Small: ensure hero stagger on load (if needed) =============== */
document.addEventListener('DOMContentLoaded', () => {
  // simple stagger add (fade in via CSS is already heavy; we can animate opacity via inline for effect)
  const title = document.querySelector('.hero-head-left');
  const right = document.querySelector('.hero-head-right');
  const person = document.querySelector('.hero-person');
  const leftTiny = document.querySelector('.hero-subtiny');

  // small fade-in sequence
  if (title) { title.style.opacity = 0; title.style.transform = 'translateY(18px)'; }
  if (right) { right.style.opacity = 0; right.style.transform = 'translateY(18px)'; }
  if (person) { person.style.opacity = 0; person.style.transform = 'translateY(30px) scale(.98)'; }
  if (leftTiny) { leftTiny.style.opacity = 0; leftTiny.style.transform = 'translateY(18px)'; }

  setTimeout(()=> { if(title) title.style.transition = 'all .8s ease'; title.style.opacity=1; title.style.transform='translateY(0)'; }, 700);
  setTimeout(()=> { if(right) right.style.transition = 'all .8s ease'; right.style.opacity=1; right.style.transform='translateY(0)'; }, 880);
  setTimeout(()=> { if(person) person.style.transition = 'all .9s cubic-bezier(.2,.9,.2,1)'; person.style.opacity=1; person.style.transform='translateY(0) scale(1)'; }, 1040);
  setTimeout(()=> { if(leftTiny) leftTiny.style.transition='all .6s ease'; leftTiny.style.opacity=1; leftTiny.style.transform='translateY(0)'; }, 1200);
});

/* Accessibility: respect prefers-reduced-motion (quick fallback) */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('*').forEach(el=> el.style.transition = 'none');
}
