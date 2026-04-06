/* =========================================
   WILD CAST OUTFITTERS - Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initNav();
  initSearch();
  initCartDrawer();
  initScrollReveal();
  initCounters();
  initParticles();
  initProductFilters();
  renderFeaturedProducts();
  initNewsletter();
  initParallax();
});

/* --- Navigation --- */
function initNav() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');

  // Sticky header with scroll detection
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
  }
}

/* --- Search --- */
function initSearch() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => searchInput?.focus(), 300);
    });

    searchClose?.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });

    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
        window.location.href = `${basePath}catalog.html?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
      if (e.key === 'Escape') {
        searchOverlay.classList.remove('active');
      }
    });
  }
}

/* --- Cart Drawer --- */
function initCartDrawer() {
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');

  cartToggle?.addEventListener('click', () => Cart.openDrawer());
  cartClose?.addEventListener('click', () => Cart.closeDrawer());
  cartOverlay?.addEventListener('click', () => Cart.closeDrawer());
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Counter Animation --- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

/* --- Hero Particles --- */
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;
    particle.style.width = `${2 + Math.random() * 3}px`;
    particle.style.height = particle.style.width;
    particle.style.opacity = `${0.2 + Math.random() * 0.5}`;
    container.appendChild(particle);
  }
}

/* --- Product Rendering --- */
function createProductCard(product) {
  const badgeHTML = product.badge
    ? `<span class="product-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>`
    : '';

  const comparePriceHTML = product.comparePrice
    ? `<span class="price-compare">$${product.comparePrice.toFixed(2)}</span>`
    : '';

  const stars = '\u2605'.repeat(Math.floor(product.rating)) +
    (product.rating % 1 >= 0.5 ? '\u00BD' : '');

  const detailPath = window.location.pathname.includes('/pages/')
    ? `product.html?id=${product.id}`
    : `pages/product.html?id=${product.id}`;

  return `
    <div class="product-card" data-category="${product.category}">
      <div class="product-image">
        <div class="product-image-placeholder">${product.icon}</div>
        ${badgeHTML}
        <div class="product-actions">
          <a href="${detailPath}" class="btn">VIEW</a>
          <button class="btn" onclick="Cart.addItem(${product.id})">ADD TO CART</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">
          <a href="${detailPath}">${product.name}</a>
        </h3>
        <div class="product-rating">${stars} <span>(${product.reviews})</span></div>
        <div class="product-price">
          <span class="price-current">$${product.price.toFixed(2)}</span>
          ${comparePriceHTML}
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProducts(filter = 'all') {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  let products = PRODUCTS;
  if (filter !== 'all') {
    products = PRODUCTS.filter(p => p.category === filter);
  }

  // Show up to 8 products
  const featured = products.slice(0, 8);
  container.innerHTML = featured.map(p => createProductCard(p)).join('');

  // Add stagger animation
  container.classList.add('stagger-grid');
}

/* --- Product Filters --- */
function initProductFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderFeaturedProducts(filter);
    });
  });
}

/* --- Newsletter --- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input && input.value) {
      Cart.showToast('Thanks for subscribing! Check your inbox for a welcome discount.', 'success');
      input.value = '';
    }
  });
}

/* --- Parallax --- */
function initParallax() {
  const sections = document.querySelectorAll('.parallax-bg');
  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    sections.forEach(bg => {
      const section = bg.parentElement;
      const rect = section.getBoundingClientRect();
      const speed = 0.3;
      const yPos = -(rect.top * speed);
      bg.style.transform = `translateY(${yPos}px)`;
    });
  });
}
