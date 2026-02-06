// currency.js - Handles multi-currency pricing
const exchangeRates = {
    PKR: 1,
    USD: 0.0036,      // 1 PKR = 0.0036 USD
    EUR: 0.0033,      // 1 PKR = 0.0033 EUR
    GBP: 0.0028,      // 1 PKR = 0.0028 GBP
    AED: 0.013        // 1 PKR = 0.013 AED
};

let currentCurrency = 'PKR';

function initCurrency() {
    const saved = localStorage.getItem('preferred_currency');
    if (saved) currentCurrency = saved;
    
    updateCurrencySelector();
    updateAllPrices();
}

function updateCurrencySelector() {
    const selector = document.getElementById('currency-select');
    if (selector) {
        selector.value = currentCurrency;
        selector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            localStorage.setItem('preferred_currency', currentCurrency);
            updateAllPrices();
            showNotification(`Currency changed to ${getCurrencySymbol(currentCurrency)}`);
        });
    }
    
    // Update exchange rate display
    const rateDisplay = document.getElementById('exchange-rate');
    if (rateDisplay && currentCurrency === 'USD') {
        rateDisplay.textContent = `1$ = ₨280`;
    }
}

function convertPrice(pricePKR) {
    const rate = exchangeRates[currentCurrency];
    const converted = pricePKR * rate;
    
    return formatCurrency(converted, currentCurrency);
}

function formatCurrency(amount, currency) {
    const symbols = {
        PKR: '₨',
        USD: '$',
        EUR: '€',
        GBP: '£',
        AED: 'د.إ'
    };
    
    const formatted = currency === 'PKR' 
        ? Math.round(amount).toLocaleString('en-PK')
        : amount.toFixed(2);
    
    return `${symbols[currency]}${formatted}`;
}

function updateAllPrices() {
    // Update product prices
    document.querySelectorAll('.product-price').forEach(el => {
        const originalPrice = el.dataset.pricePkr || el.textContent.replace(/[^0-9]/g, '');
        if (originalPrice) {
            el.textContent = convertPrice(parseInt(originalPrice));
            el.dataset.pricePkr = originalPrice;
        }
    });
    
    // Update cart prices
    updateCartCurrency();
}

function getCurrencySymbol(currency) {
    const symbols = { PKR: '₨', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
    return symbols[currency] || currency;
}