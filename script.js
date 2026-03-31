
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.querySelectorAll('.nav-dropdown').forEach(drop => {
    const trigger = drop.querySelector('.dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = drop.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(el => {
      el.classList.remove('open');
      const t = el.querySelector('.dropdown-trigger');
      if (t) t.setAttribute('aria-expanded','false');
    });
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelectorAll('.counter').forEach(counter => {
    const animate = () => {
      const target = Number(counter.dataset.target || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const tick = () => {
        current += step;
        if (current >= target) current = target;
        counter.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
    };
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animate();
        obs.disconnect();
      }
    }, { threshold: 0.35 });
    obs.observe(counter);
  });
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.masonry-card').forEach(card => {
        const matches = value === 'all' || card.dataset.category === value;
        card.dataset.hide = matches ? 'false' : 'true';
      });
    });
  });
  const quoteForm = document.querySelector('[data-quote-form]');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      const isLocal = location.protocol === 'file:';
      if (!isLocal) return;
      e.preventDefault();
      const fd = new FormData(quoteForm);
      const service = fd.get('service') || '';
      const body = [
        `Name: ${fd.get('name') || ''}`,
        `Phone: ${fd.get('phone') || ''}`,
        `Email: ${fd.get('email') || ''}`,
        `Service: ${service}`,
        `Suburb: ${fd.get('suburb') || ''}`,
        `Preferred day: ${fd.get('day') || ''}`,
        `Preferred time: ${fd.get('time') || ''}`,
        '',
        `${fd.get('message') || ''}`
      ].join('\n');
      const subject = encodeURIComponent(`Website enquiry - ${service || 'Bright Bros'}`);
      const href = `mailto:info@brightbros.com.au?subject=${subject}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
    });
  }
})();
