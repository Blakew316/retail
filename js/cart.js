/* =========================================
   WILD CAST OUTFITTERS - Cart System
   ========================================= */

const Cart = {
  items: [],

  init() {
    const saved = localStorage.getItem('wildcast_cart');
    if (saved) {
      this.items = JSON.parse(saved);
    }
    this.updateUI();
  },

  save() {
    localStorage.setItem('wildcast_cart', JSON.stringify(this.items));
  },

  addItem(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        icon: product.icon,
        qty: qty
      });
    }

    this.save();
    this.updateUI();
    this.showToast(`${product.name} added to cart!`);
    this.openDrawer();
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
    this.updateUI();
  },

  updateQty(productId, qty) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;
    if (qty <= 0) {
      this.removeItem(productId);
      return;
    }
    item.qty = qty;
    this.save();
    this.updateUI();
  },

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },

  getCount() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  },

  updateUI() {
    // Update cart count badge
    const countEl = document.getElementById('cartCount');
    if (countEl) {
      const count = this.getCount();
      countEl.textContent = count;
      countEl.style.display = count > 0 ? 'flex' : 'none';
    }

    // Update cart drawer contents
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const subtotalEl = document.getElementById('cartSubtotal');

    if (!itemsEl) return;

    if (this.items.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Your cart is empty</p>
          <a href="pages/catalog.html" class="btn btn-primary btn-sm">START SHOPPING</a>
        </div>`;
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    itemsEl.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-image">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty - 1})">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
          <div class="cart-item-remove" onclick="Cart.removeItem(${item.id})">Remove</div>
        </div>
      </div>
    `).join('');

    if (footerEl) {
      footerEl.style.display = 'block';
    }
    if (subtotalEl) {
      subtotalEl.textContent = `$${this.getTotal().toFixed(2)}`;
    }
  },

  openDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Make Cart globally available
window.Cart = Cart;
