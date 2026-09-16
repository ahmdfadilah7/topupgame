document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animation
    AOS.init({ duration: 800, once: true, offset: 50 });

    // Initialize Swiper for Hero Section
    const swiper = new Swiper('.heroSwiper', {
        loop: true,
        autoplay: { delay: 3500, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        effect: 'slide'
    });

    // Initialize Particles JS for Desktop Background
    if(window.innerWidth > 768) {
        const desktopBg = document.getElementById('particles-js');
        if(desktopBg) {
            particlesJS("particles-js", {
                "particles": {
                    "number": { "value": 80 },
                    "color": { "value": ["#7b2cbf", "#00f5d4"] },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.3, "random": true },
                    "size": { "value": 3, "random": true },
                    "move": { "enable": true, "speed": 0.5, "direction": "none", "random": true, "out_mode": "out" }
                },
                "interactivity": {
                    "events": { "onhover": { "enable": true, "mode": "repulse" } },
                    "modes": { "repulse": { "distance": 100, "duration": 0.4 } }
                }
            });
        }
    }

    // --- SPA ROUTING LOGIC ---
    const navItems = document.querySelectorAll('.bottom-nav .nav-item[data-target]');
    const appViews = document.querySelectorAll('.app-view');
    const mainContent = document.querySelector('.main-content');
    
    // Notifications and Search triggers from Header
    document.getElementById('nav-notifications').addEventListener('click', () => navigate('notifications'));
    document.getElementById('nav-search-icon').addEventListener('click', () => navigate('search'));

    window.navigate = function(targetViewId) {
        // Hide all views
        appViews.forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById('view-' + targetViewId);
        if(targetView) {
            targetView.classList.add('active');
        }

        // Update Bottom Nav active state (if target is in bottom nav)
        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.bottom-nav .nav-item[data-target="${targetViewId}"]`);
        if(activeNav) {
            activeNav.classList.add('active');
        }

        // Toggle Bottom Nav vs Sticky Checkout
        const bottomNav = document.getElementById('bottom-nav');
        const stickyCheckout = document.getElementById('sticky-checkout');
        
        if(targetViewId === 'topup') {
            bottomNav.style.display = 'none';
            stickyCheckout.classList.add('show');
            updateCheckoutPrice(); // initialize price
        } else {
            bottomNav.style.display = 'flex';
            stickyCheckout.classList.remove('show');
        }

        // Reset scroll
        if(mainContent) {
            mainContent.scrollTop = 0;
        }

        // Refresh AOS animations for the new view
        setTimeout(() => AOS.refresh(), 100);
    }

    // Bottom Nav Click Listeners
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if(!item.classList.contains('cart-btn')) {
                const target = item.getAttribute('data-target');
                navigate(target);
            }
        });
    });

    // Game Filtering Logic (Home View)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.games-section .game-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            gameCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.style.display = (filterValue === 'all' || filterValue === category) ? 'block' : 'none';
            });
            AOS.refresh();
        });
    });

    // Topup Logic will be handled in GLOBAL FUNCTIONS



    // --- CART DRAWER LOGIC ---
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');

    function toggleCart() {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    openCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });

    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);


    // --- LIVE TRANSACTION TICKER LOGIC ---
    const ticker = document.getElementById('ticker');
    const tickerText = document.getElementById('ticker-text');
    const transactions = [
        "Ahmad just top up 1000 DM MLBB",
        "Budi bought 60 UC PUBG",
        "Siti just top up 500 VP Valorant",
        "Rizky bought Weekly Diamond Pass",
        "GamerX just top up 355 DM FF"
    ];

    function showRandomTransaction() {
        // Only show if we are on Home view
        if(!document.getElementById('view-home').classList.contains('active')) return;

        const randomTx = transactions[Math.floor(Math.random() * transactions.length)];
        tickerText.textContent = randomTx;
        
        ticker.classList.remove('show');
        void ticker.offsetWidth; // trigger reflow
        ticker.classList.add('show');
    }
    setInterval(showRandomTransaction, 8000);
    setTimeout(showRandomTransaction, 2000);
});


// --- GLOBAL FUNCTIONS ---

// Navigate to Topup detail
window.openGameDetail = function(gameName) {
    document.getElementById('topup-game-name').innerText = gameName;
    generateDynamicInputs(gameName);
    navigate('topup');
}

window.generateDynamicInputs = function(gameName) {
    const dynamicContainer = document.getElementById('dynamic-inputs');
    let html = '';
    
    if (gameName === 'Mobile Legends') {
        html = `
            <div class="floating-input">
                <input type="text" id="topup-uid" placeholder=" " required onkeyup="validateTopupInput()">
                <label>User ID</label>
                <i class='bx bx-check-circle validation-icon'></i>
            </div>
            <div class="floating-input">
                <input type="text" id="topup-zone" placeholder=" " required onkeyup="validateTopupInput()">
                <label>Zone ID</label>
                <i class='bx bx-check-circle validation-icon'></i>
            </div>
        `;
    } else if (gameName === 'Valorant' || gameName === 'Genshin Impact') {
        html = `
            <div class="floating-input">
                <input type="text" id="topup-uid" placeholder=" " required onkeyup="validateTopupInput()">
                <label>Riot ID / UID</label>
                <i class='bx bx-check-circle validation-icon'></i>
            </div>
        `;
    } else {
        // Default for PUBG, FF, Roblox, etc
        html = `
            <div class="floating-input">
                <input type="text" id="topup-uid" placeholder=" " required onkeyup="validateTopupInput()">
                <label>Player ID</label>
                <i class='bx bx-check-circle validation-icon'></i>
            </div>
        `;
    }
    
    dynamicContainer.innerHTML = html;
}

// Custom Modal Logic
window.showCustomModal = function(title, text, type = 'alert', onConfirmCallback = null) {
    window.currentConfirmCallback = onConfirmCallback;
    const modalOverlay = document.getElementById('custom-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalIcon = document.getElementById('modal-icon');
    const modalActions = document.getElementById('modal-actions');

    modalTitle.innerText = title;
    modalText.innerText = text;
    
    // Setup Icon based on type (alert, confirm, success)
    modalIcon.className = 'modal-icon ' + type;
    if(type === 'alert') modalIcon.innerHTML = "<i class='bx bx-error-circle'></i>";
    else if(type === 'confirm') modalIcon.innerHTML = "<i class='bx bx-question-mark'></i>";
    else if(type === 'success') modalIcon.innerHTML = "<i class='bx bx-check'></i>";

    // Setup Buttons
    modalActions.innerHTML = '';
    
    if(type === 'confirm') {
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-modal cancel';
        btnCancel.innerText = 'Cancel';
        btnCancel.onclick = closeCustomModal;
        
        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-modal confirm';
        btnConfirm.innerText = 'Yes, Buy';
        btnConfirm.onclick = () => {
            closeCustomModal();
            setTimeout(() => {
                if(window.currentConfirmCallback) {
                    window.currentConfirmCallback();
                } else {
                    showCustomModal('Success', 'Transaction completed successfully!', 'success');
                }
            }, 500);
        };
        
        modalActions.appendChild(btnCancel);
        modalActions.appendChild(btnConfirm);
    } else {
        const btnOk = document.createElement('button');
        btnOk.className = 'btn-modal confirm';
        btnOk.innerText = 'OK';
        btnOk.onclick = closeCustomModal;
        modalActions.appendChild(btnOk);
    }

    modalOverlay.classList.add('active');
}

window.closeCustomModal = function() {
    document.getElementById('custom-modal-overlay').classList.remove('active');
}

// --- GACHA MODAL LOGIC ---
const openGachaBtn = document.getElementById('open-gacha');
const gachaModalOverlay = document.getElementById('gacha-modal-overlay');
const chest = document.getElementById('treasure-chest');
const gachaResultText = document.getElementById('gacha-result-text');
let gachaOpened = false;

openGachaBtn.addEventListener('click', () => {
    gachaModalOverlay.classList.add('active');
    if(!gachaOpened) {
        gachaResultText.innerText = "Tap the chest to open!";
        chest.className = "treasure-chest shake"; // start shaking
        chest.innerHTML = "<i class='bx bxs-box'></i>";
    }
});

window.closeGachaModal = function() {
    gachaModalOverlay.classList.remove('active');
}

chest.addEventListener('click', () => {
    if(gachaOpened) return;
    
    // Stop shaking, play open animation
    chest.className = "treasure-chest open";
    chest.innerHTML = "<i class='bx bx-box'></i>"; // open box icon
    
    // Randomize reward
    const rewards = [
        "Voucher Diskon 10%!",
        "Cashback Rp 5.000!",
        "Voucher Diskon 20% (Max 10k)!",
        "Zonk! Coba lagi besok.",
        "Cashback Rp 10.000!"
    ];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    setTimeout(() => {
        gachaResultText.innerHTML = `<span class='neon-text'>Selamat!</span><br>${reward}`;
        gachaOpened = true; // prevent opening again
    }, 500);
});

// --- ADVANCED TOPUP LOGIC ---

window.validateTopupInput = function() {
    const uidInput = document.getElementById('topup-uid');
    const zoneInput = document.getElementById('topup-zone');
    
    if(uidInput && uidInput.value.length >= 5) {
        uidInput.nextElementSibling.nextElementSibling.classList.add('valid');
    } else if (uidInput) {
        uidInput.nextElementSibling.nextElementSibling.classList.remove('valid');
    }
    
    if(zoneInput && zoneInput.value.length >= 4) {
        zoneInput.nextElementSibling.nextElementSibling.classList.add('valid');
    } else if (zoneInput) {
        zoneInput.nextElementSibling.nextElementSibling.classList.remove('valid');
    }
}

let currentPrice = 20000;
let currentFee = 0;
let selectedItemName = "86 Diamonds";

window.selectItem = function(element) {
    document.querySelectorAll('.item-card.advanced').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    
    currentPrice = parseInt(element.getAttribute('data-price'));
    selectedItemName = element.getAttribute('data-item');
    updateCheckoutPrice();
}

window.selectPayment = function(element) {
    document.querySelectorAll('.pay-method-card.advanced').forEach(c => {
        c.classList.remove('active');
        const icon = c.querySelector('i');
        if(icon) icon.remove();
    });
    
    element.classList.add('active');
    // Add checkmark to the end of the selected payment
    element.insertAdjacentHTML('beforeend', "<i class='bx bx-check-circle'></i>");
    
    currentFee = parseInt(element.getAttribute('data-fee'));
    updateCheckoutPrice();
}

window.updateCheckoutPrice = function() {
    const total = currentPrice + currentFee;
    const formattedTotal = "Rp " + total.toLocaleString('id-ID');
    const checkoutTotalEl = document.getElementById('checkout-total');
    if(checkoutTotalEl) checkoutTotalEl.innerText = formattedTotal;
}

window.processCheckout = function() {
    const uidInput = document.getElementById('topup-uid');
    if(uidInput && uidInput.value.length < 5) {
        showCustomModal('Warning', 'Please enter a valid Player ID before checking out!', 'alert');
        return;
    }
    const totalText = document.getElementById('checkout-total').innerText;
    showCustomModal('Confirm Purchase', `Are you sure you want to buy ${selectedItemName} for ${totalText}?`, 'confirm', () => {
        // Go to Payment Waiting View
        document.getElementById('waiting-total-price').innerText = totalText;
        navigate('payment-waiting');
    });
}

// --- CART LOGIC ---
let cart = [];

window.addToCart = function() {
    const uid = document.getElementById('topup-uid').value;
    if(uid.length < 5) {
        showCustomModal('Warning', 'Please enter a valid User ID to add to cart!', 'alert');
        return;
    }
    
    const gameName = document.getElementById('topup-game-name').innerText;
    const paymentName = document.querySelector('.pay-method-card.advanced.active span').innerText;
    const totalPrice = currentPrice + currentFee;
    
    cart.push({
        game: gameName,
        uid: uid,
        item: selectedItemName,
        payment: paymentName,
        price: totalPrice
    });
    
    renderCart();
    showCustomModal('Success', 'Item added to cart!', 'success');
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    renderCart();
}

window.renderCart = function() {
    const cartItemsEl = document.getElementById('cart-items');
    const badgeEl = document.querySelector('.cart-icon-wrapper .badge');
    const cartTotalEl = document.getElementById('cart-total-price');
    
    badgeEl.innerText = cart.length;
    
    if(cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <i class='bx bx-shopping-bag'></i>
                <p>Your cart is empty.</p>
            </div>
        `;
        cartTotalEl.innerText = "Rp 0";
        return;
    }
    
    let html = '';
    let totalItemsPrice = 0;
    
    cart.forEach((item, index) => {
        totalItemsPrice += item.price;
        const initial = item.game.substring(0,2).toUpperCase();
        html += `
            <div class="cart-item">
                <div class="cart-item-img">${initial}</div>
                <div class="cart-item-info">
                    <h4>${item.game}</h4>
                    <p>ID: ${item.uid} | ${item.item}</p>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})"><i class='bx bx-trash'></i></button>
            </div>
        `;
    });
    
    cartItemsEl.innerHTML = html;
    
    const paymentFee = parseInt(document.getElementById('cart-payment-select').value) || 0;
    const finalTotal = totalItemsPrice + paymentFee;
    cartTotalEl.innerText = "Rp " + finalTotal.toLocaleString('id-ID');
}

window.checkoutCart = function() {
    if(cart.length === 0) {
        showCustomModal('Warning', 'Your cart is currently empty.', 'alert');
        return;
    }
    const cartTotalEl = document.getElementById('cart-total-price').innerText;
    const paymentMethod = document.getElementById('cart-payment-select');
    const selectedPaymentText = paymentMethod.options[paymentMethod.selectedIndex].text;
    
    showCustomModal('Confirm Checkout', `Are you sure you want to checkout ${cart.length} items using ${selectedPaymentText} for a total of ${cartTotalEl}?`, 'confirm', () => {
        // Hide cart and go to Payment Waiting View
        document.getElementById('cart-drawer').classList.remove('active');
        document.getElementById('cart-overlay').classList.remove('active');
        
        document.getElementById('waiting-total-price').innerText = cartTotalEl;
        navigate('payment-waiting');
        
        cart = [];
        renderCart();
    });
}

// Payment Simulation Logic
window.simulatePaymentProcess = function() {
    // 80% chance of success, 20% chance of failure for simulation
    const isSuccess = Math.random() > 0.2;
    
    if(isSuccess) {
        playSound('success');
        navigate('payment-success');
    } else {
        playSound('error');
        navigate('payment-failed');
    }
}

// ==========================================
// GAMIFICATION & PREMIUM FEATURES
// ==========================================

// 1. Audio Effects (Web Audio API Synthesizer)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

window.playSound = function(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'swoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.setValueAtTime(1500, now + 0.05);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        osc.frequency.setValueAtTime(800, now + 0.2);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
}

// Intercept navigate to play swoosh
const originalNavigate = window.navigate;
window.navigate = function(targetId) {
    playSound('swoosh');
    originalNavigate(targetId);
}

// Override addToCart to play coin sound
const originalAddToCart = window.addToCart;
window.addToCart = function() {
    playSound('coin');
    originalAddToCart();
}

// 2. Dynamic Game Theming
const originalOpenGameDetail = window.openGameDetail;
window.openGameDetail = function(gameName) {
    const root = document.documentElement;
    if (gameName === 'Mobile Legends') {
        root.style.setProperty('--primary-color', '#FFD700'); // Gold
        root.style.setProperty('--neon-accent', '#00F5D4'); // Cyan
    } else if (gameName === 'Valorant') {
        root.style.setProperty('--primary-color', '#FF4655'); // Riot Red
        root.style.setProperty('--neon-accent', '#111111');
    } else if (gameName === 'PUBG Mobile') {
        root.style.setProperty('--primary-color', '#FF8C00'); // Orange
        root.style.setProperty('--neon-accent', '#FFA500');
    } else {
        // Reset to default UPZONE Theme
        root.style.setProperty('--primary-color', '#7b2cbf');
        root.style.setProperty('--neon-accent', '#00f5d4');
    }
    originalOpenGameDetail(gameName);
}

// 3. Custom Neon Cursor
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    if(cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});
document.addEventListener('mousedown', () => cursor && cursor.classList.add('active'));
document.addEventListener('mouseup', () => cursor && cursor.classList.remove('active'));

// 4. Scratch Card Canvas Logic
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    // Resize to match container
    canvas.width = 300;
    canvas.height = 150;
    
    // Fill with silver scratch material
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Add some noise/text to the cover
    ctx.fillStyle = '#a0a0a0';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width/2, canvas.height/2);
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 30;
    
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2, false);
        ctx.fill();
    }
    
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e.offsetX, e.offsetY); });
    canvas.addEventListener('mousemove', (e) => { if(isDrawing) scratch(e.offsetX, e.offsetY); });
    canvas.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mouseleave', () => { isDrawing = false; });
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    });
    canvas.addEventListener('touchmove', (e) => {
        if(isDrawing) {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        }
    });
    canvas.addEventListener('touchend', () => { isDrawing = false; });
}
initScratchCard();

// 5. Matrix Hacker Mode (Easter Egg)
let logoClicks = 0;
let logoClickTimer = null;
const logoBtn = document.getElementById('logo-btn');

logoBtn.addEventListener('click', () => {
    logoClicks++;
    clearTimeout(logoClickTimer);
    
    if (logoClicks >= 5) {
        activateMatrixMode();
        logoClicks = 0;
    } else {
        logoClickTimer = setTimeout(() => { logoClicks = 0; }, 1000);
    }
});

function activateMatrixMode() {
    playSound('error');
    document.body.classList.add('matrix-mode');
    showCustomModal('HACKER MODE', 'You found the secret God Eye mode! Enjoy the Matrix.', 'alert');
    
    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    for(let x = 0; x < columns; x++) drops[x] = 1;
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 17, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 33);
}

