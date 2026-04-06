/* =========================================
   WILD CAST OUTFITTERS - Catalog Logic
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initCatalog();
});

const CATEGORY_INFO = {
  lures: { title: 'FISHING LURES', desc: 'Crankbaits, soft plastics, spinnerbaits, and topwater lures that catch fish.' },
  reels: { title: 'REELS', desc: 'Spinning, baitcasting, and fly reels built for performance.' },
  rods: { title: 'RODS & COMBOS', desc: 'Tournament-grade rods and rod-reel combos.' },
  hunting: { title: 'HUNTING GEAR', desc: 'Optics, calls, blinds, trail cameras, and tactical hunting gear.' },
  apparel: { title: 'OUTDOOR APPAREL', desc: 'Performance clothing built for the elements.' },
  accessories: { title: 'ACCESSORIES', desc: 'Tackle boxes, line, tools, and everything in between.' },
  new: { title: 'NEW ARRIVALS', desc: 'The latest gear to hit our shelves.' }
};

function initCatalog() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const search = params.get('search');

  // Set page title/description based on category
  if (category && CATEGORY_INFO[category]) {
    const info = CATEGORY_INFO[category];
    document.getElementById('catalogTitle').textContent = info.title;
    document.getElementById('catalogDesc').textContent = info.desc;
    document.getElementById('breadcrumbCurrent').textContent = info.title;
    document.title = `${info.title} - Wild Cast Outfitters`;

    // Pre-check the category filter
    const checkbox = document.querySelector(`input[value="${category}"]`);
    if (checkbox) checkbox.checked = true;
  }

  if (search) {
    document.getElementById('catalogTitle').textContent = `SEARCH: "${search}"`;
    document.getElementById('catalogDesc').textContent = `Showing results for "${search}"`;
  }

  // Set category counts
  const categories = ['lures', 'reels', 'rods', 'hunting', 'accessories'];
  categories.forEach(cat => {
    const count = PRODUCTS.filter(p => p.category === cat).length;
    const el = document.querySelector(`[data-count="${cat}"]`);
    if (el) el.textContent = `(${count})`;
  });

  // Render products
  renderCatalog();

  // Filter event listeners
  document.querySelectorAll('.filter-checkbox input').forEach(input => {
    input.addEventListener('change', renderCatalog);
  });

  // Sort
  document.getElementById('sortSelect')?.addEventListener('change', renderCatalog);

  // Clear filters
  document.getElementById('clearFilters')?.addEventListener('click', clearAllFilters);

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('catalogProducts');
      if (btn.dataset.view === 'list') {
        grid.classList.add('list-view');
      } else {
        grid.classList.remove('list-view');
      }
    });
  });

  // Mobile filter toggle
  document.getElementById('mobileFilterBtn')?.addEventListener('click', () => {
    document.getElementById('catalogSidebar')?.classList.toggle('active');
  });
}

function renderCatalog() {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search')?.toLowerCase() || '';

  let products = [...PRODUCTS];

  // Search filter
  if (searchQuery) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  // Category filter
  const checkedCategories = [...document.querySelectorAll('input[name="category"]:checked')].map(i => i.value);
  if (checkedCategories.length > 0) {
    products = products.filter(p => checkedCategories.includes(p.category));
  }

  // URL category (for "new" badge filter)
  const urlCategory = params.get('category');
  if (urlCategory === 'new') {
    products = products.filter(p => p.badge === 'new');
  }

  // Price filter
  const checkedPrices = [...document.querySelectorAll('input[name="price"]:checked')].map(i => i.value);
  if (checkedPrices.length > 0) {
    products = products.filter(p => {
      return checkedPrices.some(range => {
        const [min, max] = range.split('-').map(Number);
        return p.price >= min && p.price <= max;
      });
    });
  }

  // Rating filter
  const checkedRatings = [...document.querySelectorAll('input[name="rating"]:checked')].map(i => parseFloat(i.value));
  if (checkedRatings.length > 0) {
    const minRating = Math.min(...checkedRatings);
    products = products.filter(p => p.rating >= minRating);
  }

  // Sort
  const sort = document.getElementById('sortSelect')?.value || 'featured';
  switch (sort) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  // Render
  const container = document.getElementById('catalogProducts');
  const emptyState = document.getElementById('catalogEmpty');
  const countEl = document.getElementById('resultsCount');

  if (countEl) {
    countEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
  }

  if (products.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  container.style.display = '';
  emptyState.style.display = 'none';
  container.innerHTML = products.map(p => createProductCard(p)).join('');

  // Re-apply stagger animation
  container.classList.remove('stagger-grid');
  void container.offsetWidth; // force reflow
  container.classList.add('stagger-grid');
}

function clearAllFilters() {
  document.querySelectorAll('.filter-checkbox input').forEach(i => i.checked = false);

  // Clear URL params
  const url = new URL(window.location);
  url.searchParams.delete('category');
  url.searchParams.delete('search');
  window.history.replaceState({}, '', url);

  document.getElementById('catalogTitle').textContent = 'SHOP ALL GEAR';
  document.getElementById('catalogDesc').textContent = 'Browse our complete collection of premium fishing and hunting gear.';
  document.getElementById('breadcrumbCurrent').textContent = 'Shop All';

  renderCatalog();
}

// Make clearAllFilters available globally
window.clearAllFilters = clearAllFilters;
