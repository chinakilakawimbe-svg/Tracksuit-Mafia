/* TRACKSUIT MAFIA — main.js */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.close-btn');
  const openMenu = () => {
    mobileNav.classList.add('is-open');
    mobileNav.querySelector('a,button')?.focus();
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
    menuToggle.focus();
  };
  menuToggle?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Stitch progress rail (signature element) ---------- */
  const thread = document.querySelector('.stitch-rail .thread');
  if (thread && !prefersReduced) {
    const length = thread.getTotalLength ? thread.getTotalLength() : 2000;
    thread.style.strokeDasharray = '10 8';
    const updateThread = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      thread.setAttribute('stroke-dashoffset', String(length * (1 - pct) * -1));
      thread.style.opacity = pct > 0.02 ? '1' : '0';
    };
    document.addEventListener('scroll', updateThread, { passive: true });
    window.addEventListener('resize', updateThread);
    updateThread();
  }

  /* ---------- Ripple on .btn ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Quick add ---------- */
  document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.classList.add('is-added');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('is-added');
      }, 1800);
    });
  });

  /* ---------- Swatch selection ---------- */
  document.querySelectorAll('.swatches').forEach(group => {
    group.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        group.querySelectorAll('.swatch').forEach(s => s.classList.remove('is-active'));
        sw.classList.add('is-active');
      });
    });
  });

  /* ---------- Newsletter form ---------- */
  const form = document.querySelector('.newsletter-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg');
    const input = form.querySelector('input[type="email"]');
    if (input.checkValidity() && input.value) {
      msg.textContent = "You're in. Welcome to the family.";
      input.value = '';
    } else {
      msg.textContent = 'Enter a valid email to join.';
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');
  if (sections.length && navLinks.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.main-nav a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navIO.observe(s));
  }
})();
