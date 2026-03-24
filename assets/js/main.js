/* freelancer-templates.org - main.js */

// Dark mode toggle
(function () {
  const toggle = document.getElementById('darkToggle');
  const html = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      const isDark = html.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }
})();

// Mobile nav toggle
(function () {
  const btn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav__links');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', function () {
    const open = navLinks.classList.toggle('nav__links--open');
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('nav__links--open');
    });
  });
})();

// Full library toggle
(function () {
  const btn = document.getElementById('libToggle');
  const body = document.getElementById('libBody');
  if (!btn || !body) return;

  btn.addEventListener('click', function () {
    const isOpen = !body.hidden;
    body.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
    const label = btn.querySelector('span');
    if (label) label.textContent = isOpen ? 'View Full Library' : 'Collapse Library';
  });
})();

// Newsletter form intercept
(function () {
  const form = document.getElementById('nlForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Subscribed!';
        btn.disabled = true;
      }
      input.value = '';
    }
  });
})();

// Lucide icons - init after DOM ready
document.addEventListener('DOMContentLoaded', function () {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
