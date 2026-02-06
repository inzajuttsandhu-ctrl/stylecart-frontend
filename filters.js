// filters.js - Advanced product filtering
class ProductFilters {
    constructor() {
        this.filters = {
            category: 'all',
            priceRange: [0, 50000],
            size: [],
            color: [],
            brand: [],
            rating: 0,
            sortBy: 'featured'
        };
    }
    
    applyFilters(products) {
        let filtered = [...products];
        
        // Category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }
        
        // Price range filter
        filtered = filtered.filter(p => 
            p.price >= this.filters.priceRange[0] && 
            p.price <= this.filters.priceRange[1]
        );
        
        // Size filter
        if (this.filters.size.length > 0) {
            filtered = filtered.filter(p => 
                p.sizes && p.sizes.some(size => this.filters.size.includes(size))
            );
        }
        
        // Color filter
        if (this.filters.color.length > 0) {
            filtered = filtered.filter(p => 
                p.colors && p.colors.some(color => this.filters.color.includes(color))
            );
        }
        
        // Rating filter
        if (this.filters.rating > 0) {
            filtered = filtered.filter(p => p.rating >= this.filters.rating);
        }
        
        // Sorting
        filtered = this.sortProducts(filtered, this.filters.sortBy);
        
        return filtered;
    }
    
    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch(sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => b.id - a.id);
            case 'popular':
                return sorted.sort((a, b) => b.reviews - a.reviews);
            default:
                return sorted;
        }
    }
}

// Filter UI HTML (products.html me add karo)
const filterHTML = `
<div class="advanced-filters">
    <div class="filter-section">
        <h4><i class="fas fa-filter"></i> Filters</h4>
        
        <!-- Price Range -->
        <div class="filter-group">
            <label>Price Range</label>
            <div class="price-range">
                <input type="range" min="0" max="50000" value="25000" class="price-slider">
                <div class="price-values">
                    <span>₨0</span>
                    <span>₨25,000</span>
                    <span>₨50,000+</span>
                </div>
            </div>
        </div>
        
        <!-- Size Filter -->
        <div class="filter-group">
            <label>Size</label>
            <div class="size-options">
                ${['XS', 'S', 'M', 'L', 'XL'].map(size => `
                    <label class="size-checkbox">
                        <input type="checkbox" value="${size}">
                        <span>${size}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        
        <!-- Color Filter -->
        <div class="filter-group">
            <label>Color</label>
            <div class="color-options">
                ${['Red', 'Blue', 'Green', 'Black', 'White', 'Pink'].map(color => `
                    <label class="color-checkbox" style="background: ${color.toLowerCase()}">
                        <input type="checkbox" value="${color}">
                        <span></span>
                    </label>
                `).join('')}
            </div>
        </div>
        
        <!-- Rating Filter -->
        <div class="filter-group">
            <label>Minimum Rating</label>
            <div class="rating-filter">
                ${[4, 3, 2, 1].map(rating => `
                    <label class="rating-option">
                        <input type="radio" name="rating" value="${rating}">
                        ${'★'.repeat(rating)}${'☆'.repeat(5-rating)} & above
                    </label>
                `).join('')}
            </div>
        </div>
    </div>
</div>
`;