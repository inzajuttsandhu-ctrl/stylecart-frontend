// ========== PRODUCT DATA ==========
const products = [
    {
        id: 1,
        name: "Men's Casual Shirt",
        price: 799,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        category: "men",
        rating: 4.5,
        badge: "Popular"
    },
    {
        id: 2,
        name: "Women's Summer Dress",
        price: 1299,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400",
        category: "women",
        rating: 4.8,
        badge: "New"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        category: "accessories",
        rating: 4.3,
        badge: "Sale"
    },
    {
        id: 4,
        name: "Leather Watch",
        price: 3599,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
        category: "accessories",
        rating: 4.7,
        badge: "Premium"
    },
    {
        id: 5,
        name: "Denim Jacket",
        price: 1899,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        category: "men",
        rating: 4.4,
        badge: "Trending"
    },
    {
        id: 6,
        name: "Designer Handbag",
        price: 2999,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
        category: "women",
        rating: 4.9,
        badge: "Luxury"
    },
    {
        id: 7,
        name: "Wireless Headphones",
        price: 1999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        category: "accessories",
        rating: 4.6,
        badge: "Best Seller"
    },
    {
        id: 8,
        name: "Sports T-Shirt",
        price: 599,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        category: "men",
        rating: 4.2,
        badge: "Sale"
    }
];

// ========== CART SYSTEM ==========
let cart = JSON.parse(localStorage.getItem('stylecart_cart')) || [];

// ========== DOM ELEMENTS ==========
const featuredProductsEl = document.getElementById('featured-products');
const cartCountEl = document.querySelector('.cart-count');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.querySelector('.search-input');

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    displayFeaturedProducts();
    updateCartCount();
    setupEventListeners();
    console.log('StyleCart Frontend Initialized!');
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Search Functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }
}

// ========== MOBILE MENU ==========
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
}

// ========== PRODUCT DISPLAY ==========
function displayFeaturedProducts() {
    if (!featuredProductsEl) return;
    
    featuredProductsEl.innerHTML = '';
    
    // Show only 4 featured products
    const featured = products.slice(0, 4);
    
    featured.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span style="color: #666; margin-left: 5px;">(${product.rating})</span>
                </div>
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        featuredProductsEl.appendChild(productCard);
    });
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// ========== CART FUNCTIONS ==========
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCartToStorage();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Cart animation
    const cartIcon = document.querySelector('.cart-link');
    cartIcon.classList.add('pulse');
    setTimeout(() => cartIcon.classList.remove('pulse'), 300);
}

function updateCartCount() {
    if (!cartCountEl) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
}

function saveCartToStorage() {
    localStorage.setItem('stylecart_cart', JSON.stringify(cart));
}

// ========== SEARCH FUNCTIONALITY ==========
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayFeaturedProducts();
        return;
    }
    
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.badge?.toLowerCase().includes(searchTerm)
    );
    
    if (featuredProductsEl) {
        featuredProductsEl.innerHTML = '';
        
        if (filtered.length === 0) {
            featuredProductsEl.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try different keywords</p>
                </div>
            `;
            return;
        }
        
        filtered.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${getStarRating(product.rating)}
                    </div>
                    <p class="product-price">₹${product.price}</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            `;
            featuredProductsEl.appendChild(productCard);
        });
    }
}

// ========== NEWSLETTER ==========
function handleNewsletter(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (validateEmail(email)) {
        showNotification('Thank you for subscribing!', 'success');
        emailInput.value = '';
        // Here you would typically send to backend
        console.log('Subscribed email:', email);
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff4757' : '#2f3542'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .pulse {
        animation: pulse 0.3s ease;
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// ========== UTILITY FUNCTIONS ==========
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

// Make functions globally available
window.addToCart = addToCart;
window.showNotification = showNotification;
// Add this function to save cart
function saveCartToStorage() {
    localStorage.setItem('stylecart_cart', JSON.stringify(cart));
    // Update cart count on all pages
    updateCartCountOnAllPages();
}

// Update cart count on all pages
function updateCartCountOnAllPages() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Make cart available globally
window.cart = cart;
window.saveCartToStorage = saveCartToStorage;