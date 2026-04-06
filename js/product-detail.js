/* =========================================
   WILD CAST OUTFITTERS - Product Detail
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetail();
});

function initProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    document.getElementById('productDetail').innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 80px 24px;">
        <h2 style="font-family: var(--font-display); font-size: 32px; letter-spacing: 2px; margin-bottom: 16px;">Product Not Found</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 24px;">The product you're looking for doesn't exist.</p>
        <a href="catalog.html" class="btn btn-primary">BACK TO SHOP</a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} - Wild Cast Outfitters`;
  document.getElementById('breadcrumbProduct').textContent = product.name;

  const badgeHTML = product.badge
    ? `<span class="pd-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>`
    : '';

  const comparePriceHTML = product.comparePrice
    ? `<span class="pd-compare-price">$${product.comparePrice.toFixed(2)}</span>
       <span class="pd-save">SAVE $${(product.comparePrice - product.price).toFixed(2)}</span>`
    : '';

  const stars = '\u2605'.repeat(Math.floor(product.rating)) +
    (product.rating % 1 >= 0.5 ? '\u00BD' : '');

  // Build options HTML
  let optionsHTML = '';
  if (product.colors) {
    optionsHTML += `
      <div class="pd-option-group">
        <span class="pd-option-label">Color</span>
        <div class="pd-option-buttons">
          ${product.colors.map((c, i) => `<button class="pd-option-btn ${i === 0 ? 'active' : ''}" onclick="selectOption(this)">${c}</button>`).join('')}
        </div>
      </div>
    `;
  }
  if (product.sizes) {
    optionsHTML += `
      <div class="pd-option-group">
        <span class="pd-option-label">Size</span>
        <div class="pd-option-buttons">
          ${product.sizes.map((s, i) => `<button class="pd-option-btn ${i === 0 ? 'active' : ''}" onclick="selectOption(this)">${s}</button>`).join('')}
        </div>
      </div>
    `;
  }

  const featuresHTML = product.features
    ? `<div class="pd-features">
        <h4>Key Features</h4>
        <ul>${product.features.map(f => `<li>${f}</li>`).join('')}</ul>
       </div>`
    : '';

  document.getElementById('productDetail').innerHTML = `
    <div class="pd-image-wrap">
      <div class="pd-image-placeholder">${product.icon}</div>
      ${badgeHTML}
    </div>
    <div class="pd-info">
      <span class="pd-category">${product.category.toUpperCase()}</span>
      <h1 class="pd-title">${product.name}</h1>
      <div class="pd-rating">
        <span class="pd-stars">${stars}</span>
        <span class="pd-review-count">${product.rating} (${product.reviews} reviews)</span>
      </div>
      <div class="pd-price-row">
        <span class="pd-price">$${product.price.toFixed(2)}</span>
        ${comparePriceHTML}
      </div>
      <p class="pd-description">${product.description}</p>

      ${optionsHTML}

      <div class="pd-actions">
        <div class="pd-qty">
          <button onclick="changeQty(-1)">-</button>
          <span id="pdQty">1</span>
          <button onclick="changeQty(1)">+</button>
        </div>
        <button class="btn btn-primary pd-add-btn" onclick="addToCartDetail(${product.id})">ADD TO CART</button>
      </div>

      ${featuresHTML}

      <div class="pd-shipping">
        <div class="pd-shipping-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          <span>Free shipping on orders over $75</span>
        </div>
        <div class="pd-shipping-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v6h-6"/></svg>
          <span>30-day hassle-free returns</span>
        </div>
        <div class="pd-shipping-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Secure checkout with SSL encryption</span>
        </div>
      </div>
    </div>
  `;

  // Render related products
  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const relatedContainer = document.getElementById('relatedProducts');
  if (relatedContainer) {
    relatedContainer.innerHTML = related.map(p => createProductCard(p)).join('');
  }
}

let currentQty = 1;

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('pdQty').textContent = currentQty;
}

function addToCartDetail(productId) {
  Cart.addItem(productId, currentQty);
}

function selectOption(btn) {
  const group = btn.parentElement;
  group.querySelectorAll('.pd-option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// Make functions globally available
window.changeQty = changeQty;
window.addToCartDetail = addToCartDetail;
window.selectOption = selectOption;
