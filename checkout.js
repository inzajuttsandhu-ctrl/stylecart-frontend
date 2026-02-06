// ========== CHECKOUT PAGE JAVASCRIPT ==========
// checkout.js - Handles checkout process

// Global cart variable
let cart = JSON.parse(localStorage.getItem('stylecart_cart')) || [];

// DOM Elements
let checkoutItems, subtotalEl, shippingEl, taxEl, totalEl;
let checkoutForm;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    initializeCheckoutPage();
    loadCartData();
    updateCheckoutDisplay();
    setupEventListeners();
    
    // Auto-fill form if user data exists
    autoFillForm();
});

// Initialize checkout page elements
function initializeCheckoutPage() {
    checkoutItems = document.getElementById('checkout-items');
    subtotalEl = document.getElementById('checkout-subtotal');
    shippingEl = document.getElementById('checkout-shipping');
    taxEl = document.getElementById('checkout-tax');
    totalEl = document.getElementById('checkout-total');
    checkoutForm = document.getElementById('checkout-form');
    
    // Check if cart is empty
    if (cart.length === 0) {
        showEmptyCheckout();
    }
}

// Load cart data
function loadCartData() {
    const savedCart = JSON.parse(localStorage.getItem('stylecart_cart'));
    if (savedCart) {
        cart = savedCart;
    }
    updateCartCount();
}

// Update checkout display
function updateCheckoutDisplay() {
    if (!checkoutItems) return;
    
    // Clear current items
    checkoutItems.innerHTML = '';
    
    if (cart.length === 0) {
        showEmptyCheckout();
        return;
    }
    
    let subtotal = 0;
    
    // Add each item to checkout summary
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <div style="font-size: 0.9rem; color: #666;">
                    Qty: ${item.quantity} × ₹${formatPrice(item.price)}
                </div>
            </div>
            <div>₹${formatPrice(itemTotal)}</div>
        `;
        checkoutItems.appendChild(orderItem);
    });
    
    // Calculate totals
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    
    // Update totals display
    if (subtotalEl) subtotalEl.textContent = `₹${formatPrice(subtotal)}`;
    if (shippingEl) {
        shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
        shippingEl.style.color = shipping === 0 ? '#4CAF50' : '#333';
    }
    if (taxEl) taxEl.textContent = `₹${formatPrice(tax)}`;
    if (totalEl) totalEl.textContent = `₹${formatPrice(total)}`;
}

// Show empty checkout message
function showEmptyCheckout() {
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = `
        <div class="empty-order">
            <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
            <h3 style="margin-bottom: 0.5rem;">Your cart is empty</h3>
            <p style="margin-bottom: 1rem;">Add items to your cart before checkout</p>
            <a href="products.html" class="btn btn-primary" style="text-decoration: none;">
                <i class="fas fa-store"></i> Shop Now
            </a>
        </div>
    `;
    
    // Disable form if cart is empty
    if (checkoutForm) {
        checkoutForm.querySelectorAll('input, select, textarea, button').forEach(el => {
            el.disabled = true;
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
    
    // Form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Back to cart link
    const backToCartLink = document.querySelector('.back-to-cart');
    if (backToCartLink) {
        backToCartLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
}

// Select payment method
function selectPaymentMethod(element) {
    // Remove active class from all
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    // Add active class to clicked
    element.classList.add('active');
    
    // Get payment method
    const methodText = element.querySelector('p').textContent;
    const methodMap = {
        'Credit/Debit Card': 'card',
        'PayPal': 'paypal',
        'Cash on Delivery': 'cod',
        'UPI': 'upi'
    };
    
    const method = methodMap[methodText] || 'card';
    document.getElementById('payment-method').value = method;
}

// Handle checkout form submission
function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Check if cart is empty
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add items first.', 'error');
        return;
    }
    
    // Validate form
    if (!validateCheckoutForm()) {
        return;
    }
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        zip: document.getElementById('zip').value.trim(),
        country: document.getElementById('country').value,
        paymentMethod: document.getElementById('payment-method').value,
        agreeTerms: document.getElementById('terms') ? document.getElementById('terms').checked : true
    };
    
    // Process order
    processOrder(formData);
}

// Validate checkout form
function validateCheckoutForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field) continue;
        
        const value = field.value.trim();
        if (!value) {
            showNotification(`Please fill in ${field.previousElementSibling.textContent}`, 'error');
            field.focus();
            field.style.borderColor = '#ff4757';
            return false;
        }
        
        // Reset border color
        field.style.borderColor = '#ddd';
        
        // Specific validations
        if (fieldId === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showNotification('Please enter a valid email address', 'error');
                field.focus();
                field.style.borderColor = '#ff4757';
                return false;
            }
        }
        
        if (fieldId === 'phone') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                showNotification('Please enter a valid 10-digit phone number', 'error');
                field.focus();
                field.style.borderColor = '#ff4757';
                return false;
            }
        }
    }
    
    // Check terms agreement
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        return false;
    }
    
    return true;
}

// Process order
function processOrder(orderData) {
    // Calculate order total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;
    const total = Math.round(subtotal + shipping + tax);
    
    // Create order object
    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toLocaleString(),
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping,
        tax: Math.round(tax),
        total: total,
        customer: orderData,
        status: 'processing',
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'pending'
    };
    
    console.log('Order created:', order);
    
    // Save order to localStorage (in real app, send to backend)
    const orders = JSON.parse(localStorage.getItem('stylecart_orders')) || [];
    orders.push(order);
    localStorage.setItem('stylecart_orders', JSON.stringify(orders));
    
    // Show loading state
    const submitBtn = checkoutForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.setItem('stylecart_cart', JSON.stringify(cart));
        
        // Show success message
        showOrderSuccess(order);
        
        // Update cart count
        updateCartCount();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect after 5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
        
    }, 2000);
}

// Show order success
function showOrderSuccess(order) {
    // Create success modal
    const successModal = document.createElement('div');
    successModal.className = 'order-success-modal';
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    successModal.innerHTML = `
        <div style="
            background: white;
            padding: 3rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.5s ease;
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: #4CAF50;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 2.5rem;
                color: white;
            ">
                <i class="fas fa-check"></i>
            </div>
            
            <h2 style="margin-bottom: 1rem; color: #2f3542;">Order Successful!</h2>
            <p style="margin-bottom: 1rem; color: #666;">
                Thank you for your purchase, <strong>${order.customer.firstName}</strong>!
            </p>
            
            <div style="
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 10px;
                margin: 1.5rem 0;
                text-align: left;
            ">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Order ID:</span>
                    <strong>${order.id}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Total Amount:</span>
                    <strong>₹${formatPrice(order.total)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Payment Method:</span>
                    <strong>${getPaymentMethodName(order.paymentMethod)}</strong>
                </div>
            </div>
            
            <p style="color: #666; margin-bottom: 1.5rem;">
                A confirmation email has been sent to <strong>${order.customer.email}</strong>
            </p>
            
            <button onclick="closeSuccessModal()" style="
                background: #ff4757;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s;
            ">
                Continue Shopping
            </button>
            
            <p style="margin-top: 1rem; color: #999; font-size: 0.9rem;">
                Redirecting to homepage in 5 seconds...
            </p>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.order-success-modal');
    if (modal) {
        modal.remove();
        window.location.href = 'index.html';
    }
}

// Get payment method name
function getPaymentMethodName(method) {
    const methods = {
        'card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'cod': 'Cash on Delivery',
        'upi': 'UPI'
    };
    return methods[method] || method;
}

// Auto-fill form with saved data
function autoFillForm() {
    const savedUser = JSON.parse(localStorage.getItem('stylecart_user'));
    if (!savedUser) return;
    
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && savedUser[field]) {
            element.value = savedUser[field];
        }
    });
}

// Format price with commas
function formatPrice(price) {
    return Math.round(price).toLocaleString('en-IN');
}

// Update cart count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        if (el) {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    if (window.showNotification) {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    const colors = {
        success: '#4CAF50',
        error: '#ff4757',
        info: '#2f3542'
    };
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add animation styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Make functions available globally
window.selectPaymentMethod = function(element) {
    selectPaymentMethod(element);
};

window.closeSuccessModal = closeSuccessModal;