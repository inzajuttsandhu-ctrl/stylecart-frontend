// ========== CART PAGE JAVASCRIPT ==========
// cart.js - Handles shopping cart functionality

// Global cart variable (shared with script.js)
// If cart is not defined, get from localStorage
let cart = window.cart || JSON.parse(localStorage.getItem('stylecart_cart')) || [];

// DOM Elements
let cartItemsList, emptyCartDiv, cartWithItemsDiv;
let subtotalEl, shippingEl, taxEl, totalEl;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded');
    initializeCartPage();
    loadCart();
    updateCartDisplay();
});

// Initialize cart page elements
function initializeCartPage() {
    cartItemsList = document.getElementById('cart-items-list');
    emptyCartDiv = document.getElementById('empty-cart');
    cartWithItemsDiv = document.getElementById('cart-with-items');
    
    subtotalEl = document.getElementById('subtotal');
    shippingEl = document.getElementById('shipping');
    taxEl = document.getElementById('tax');
    totalEl = document.getElementById('total');
    
    // Setup event listeners
    setupCartEventListeners();
}

// Setup event listeners
function setupCartEventListeners() {
    // Clear cart button
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'products.html';
        });
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            if (cart.length === 0) {
                e.preventDefault();
                showNotification('Your cart is empty! Add items first.', 'error');
            }
        });
    }
}

// Load cart from localStorage
function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem('stylecart_cart'));
    if (savedCart) {
        cart = savedCart;
    }
    updateCartCount();
}

// Update cart display
function updateCartDisplay() {
    console.log('Updating cart display. Items:', cart.length);
    
    if (!cartItemsList || !emptyCartDiv || !cartWithItemsDiv) {
        console.error('Cart elements not found');
        return;
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        emptyCartDiv.style.display = 'block';
        cartWithItemsDiv.style.display = 'none';
        return;
    }
    
    // Cart has items
    emptyCartDiv.style.display = 'none';
    cartWithItemsDiv.style.display = 'grid';
    
    // Clear current items
    cartItemsList.innerHTML = '';
    
    // Add each cart item
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/100'}" 
                 alt="${item.name}" 
                 class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/100'">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">₹${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsList.appendChild(cartItem);
    });
    
    // Update order summary
    updateOrderSummary();
}

// Update item quantity in cart
function updateCartQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        // Remove item if quantity becomes 0
        cart.splice(itemIndex, 1);
        showNotification('Item removed from cart', 'info');
    } else {
        showNotification(`Quantity updated to ${cart[itemIndex].quantity}`, 'success');
    }
    
    // Save and update
    saveCartToStorage();
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    const itemName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    
    saveCartToStorage();
    updateCartDisplay();
    
    showNotification(`${itemName} removed from cart`, 'info');
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your entire cart?')) {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        showNotification('Cart cleared successfully', 'success');
    }
}

// Update order summary calculations
function updateOrderSummary() {
    if (!subtotalEl || !shippingEl || !taxEl || !totalEl) return;
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate shipping (free over ₹999)
    const shipping = subtotal > 999 ? 0 : 99;
    
    // Calculate tax (18%)
    const tax = subtotal * 0.18;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update UI
    subtotalEl.textContent = `₹${formatPrice(subtotal)}`;
    shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    shippingEl.style.color = shipping === 0 ? '#4CAF50' : '#333';
    taxEl.textContent = `₹${formatPrice(tax)}`;
    totalEl.textContent = `₹${formatPrice(total)}`;
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('stylecart_cart', JSON.stringify(cart));
    
    // Update cart count on all pages
    updateCartCount();
    
    // Also update global cart variable if it exists
    if (window.updateCartCount) {
        window.updateCartCount();
    }
}

// Update cart count in navbar
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Format price with commas
function formatPrice(price) {
    return Math.round(price).toLocaleString('en-IN');
}

// Show notification
function showNotification(message, type = 'info') {
    // Reuse notification function from main script if available
    if (window.showNotification) {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    alert(message);
}

// Make functions available globally
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;