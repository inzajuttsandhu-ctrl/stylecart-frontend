// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCheckoutDisplay();
    setupCheckoutForm();
    updateCartCount();
});

// Update checkout display
function updateCheckoutDisplay() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');
    
    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div class="empty-order">
                <p>Your cart is empty</p>
                <a href="products.html">Shop now</a>
            </div>
        `;
        return;
    }
    
    // Update order items
    checkoutItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${itemTotal}</span>
        `;
        checkoutItems.appendChild(orderItem);
    });
    
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    
    subtotalEl.textContent = `₹${subtotal}`;
    shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    taxEl.textContent = `₹${Math.round(tax)}`;
    totalEl.textContent = `₹${Math.round(total)}`;
}

// Setup checkout form
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
            paymentMethod: document.getElementById('payment-method').value
        };
        
        // Simple validation
        if (!validateForm(formData)) {
            return;
        }
        
        // Process order (in real app, this would go to backend)
        processOrder(formData);
    });
}

// Select payment method
function selectPayment(method) {
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(pm => pm.classList.remove('active'));
    
    const selected = document.querySelector(`[onclick="selectPayment('${method}')"]`);
    selected.classList.add('active');
    
    document.getElementById('payment-method').value = method;
}

// Validate form
function validateForm(data) {
    for (let key in data) {
        if (!data[key]) {
            showNotification(`Please fill in ${key}`, 'error');
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email', 'error');
        return false;
    }
    
    // Phone validation (simple)
    if (data.phone.length < 10) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    return true;
}

// Process order
function processOrder(orderData) {
    // Create order object
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: calculateTotal(),
        customer: orderData,
        status: 'pending'
    };
    
    // Save order to localStorage (in real app, send to backend)
    const orders = JSON.parse(localStorage.getItem('stylecart_orders')) || [];
    orders.push(order);
    localStorage.setItem('stylecart_orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    
    // Show success message
    showNotification('Order placed successfully!', 'success');
    
    // Redirect to confirmation page (or show confirmation)
    setTimeout(() => {
        alert(`Order #${order.id} placed successfully!\nTotal: ₹${order.total}\nWe'll send confirmation to ${orderData.email}`);
        window.location.href = 'index.html';
    }, 1000);
}

// Calculate order total
function calculateTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;
    return Math.round(subtotal + shipping + tax);
}