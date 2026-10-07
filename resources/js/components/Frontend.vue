<template>
<div class="frontend-wrapper">
    <!-- Matrix Canvas for Hacker Mode -->
    <canvas id="matrix-canvas" class="matrix-canvas"></canvas>
    <!-- Custom Cursor -->
    <div class="custom-cursor" id="custom-cursor"></div>

    <!-- Desktop Background Layer -->
    <div id="particles-js" class="desktop-bg"></div>

    <!-- Mobile App Container -->
    <div id="mobile-wrapper">

        <!-- Top Header Bar -->
        <div class="top-header">
            <div class="logo" id="logo-btn" @click="navigate('home')" style="cursor:pointer">
                <span class="neon-text">UP</span>ZONE
            </div>
            <div class="header-actions">
                <i v-if="!user" class='bx bx-user-circle' @click="openAuthModal('login')" title="Login" style="cursor: pointer; font-size: 1.5rem;"></i>
                <div v-else class="flex items-center gap-2" @click="navigate('profile')" style="cursor: pointer;">
                    <i class='bx bxs-user-circle' style="color: var(--neon-accent); font-size: 1.5rem;"></i>
                    <span style="font-size: 0.8rem; font-weight: bold; color: white;">{{ user.name.split(' ')[0] }}</span>
                </div>
                <i class='bx bx-credit-card-front' style="color: var(--neon-accent); cursor: pointer;"
                    onclick="navigate('scratch')" title="Daily Scratch Card"></i>
                <i class='bx bx-search' id="nav-search-icon"></i>
            </div>
        </div>

        <!-- Live Transaction Ticker (Only visible on Home) -->
        <div class="transaction-ticker" id="ticker">
            <i class='bx bx-check-circle'></i>
            <span id="ticker-text">Budi just top up 1000 DM MLBB</span>
        </div>

        <!-- Main Scrollable Content -->
        <main class="main-content">

            <!-- ======================= HOME VIEW ======================= -->
            <div class="app-view active" id="view-home">
                <!-- Hero Section with Swiper Slider -->
                <section class="hero-carousel">
                    <div class="swiper heroSwiper">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide banner-1">
                                <div class="slide-content">
                                    <h2>Special Promo <br><span class="neon-text">Up to 50%</span></h2>
                                    <p>Mobile Legends Diamonds</p>
                                </div>
                            </div>
                            <div class="swiper-slide banner-2">
                                <div class="slide-content">
                                    <h2>New Arrival <br><span class="neon-text">Valorant Points</span></h2>
                                    <p>Instant delivery guaranteed</p>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                </section>

                <!-- Flash Sale Section -->
                <section class="flash-sale" data-aos="fade-up">
                    <div class="section-title">
                        <h3><i class='bx bxs-zap neon-text'></i> Flash Sale</h3>
                        <div class="countdown">
                            <span>02</span>:<span>45</span>:<span>12</span>
                        </div>
                    </div>
                    <div class="flash-grid">
                        <div class="flash-card" onclick="openGameDetail('Mobile Legends')">
                            <div class="discount-tag">-20%</div>
                            <div class="game-img-small img-ml">ML</div>
                            <h4>86 Diamonds</h4>
                            <p class="price strike">Rp 25.000</p>
                            <p class="price new">Rp 20.000</p>
                        </div>
                        <div class="flash-card" onclick="openGameDetail('PUBG Mobile')">
                            <div class="discount-tag">-15%</div>
                            <div class="game-img-small img-pubg">PUBG</div>
                            <h4>60 UC</h4>
                            <p class="price strike">Rp 15.000</p>
                            <p class="price new">Rp 12.750</p>
                        </div>
                    </div>
                </section>

                <!-- Sultan of the Week (Leaderboard) -->
                <section class="sultan-board" data-aos="fade-up">
                    <div class="section-title">
                        <h3><i class='bx bxs-crown neon-text'></i> Sultan of the Week</h3>
                    </div>
                    <div class="sultan-list">
                        <div class="sultan-item gold" data-tilt data-tilt-scale="1.05">
                            <div class="sultan-rank">1</div>
                            <div class="sultan-avatar"><i class='bx bxs-user'></i></div>
                            <div class="sultan-info">
                                <h4>Raja Topup</h4>
                                <p>Rp 5.450.000</p>
                            </div>
                            <i class='bx bxs-medal badge-icon'></i>
                        </div>
                        <div class="sultan-item silver" data-tilt data-tilt-scale="1.05">
                            <div class="sultan-rank">2</div>
                            <div class="sultan-avatar"><i class='bx bx-user'></i></div>
                            <div class="sultan-info">
                                <h4>ProGamer99</h4>
                                <p>Rp 3.200.000</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Games Section -->
                <section class="games-section">
                    <div class="section-header">
                        <h3>Popular Games</h3>
                        <div class="filters">
                            <button class="filter-btn active" data-filter="all">All</button>
                            <button class="filter-btn" data-filter="mobile">Mobile</button>
                            <button class="filter-btn" data-filter="pc">PC</button>
                        </div>
                    </div>

                    <div class="games-grid">
                        <div v-for="brand in popularBrands" :key="brand" class="game-card" data-category="mobile" @click="openGameDetailVue(brand)"
                            data-tilt data-tilt-glare data-tilt-max-glare="0.3">
                            <div class="game-img" style="background: linear-gradient(45deg, #7b2cbf, #3a0ca3);">
                                {{ brand.substring(0, 2).toUpperCase() }}
                            </div>
                            <div class="game-info">
                                <h4>{{ brand }}</h4>
                                <p>Games</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Payment Methods -->
                <section class="payment-methods">
                    <h3>Supported Payments</h3>
                    <div class="payment-grid">
                        <div class="pay-logo">QRIS</div>
                        <div class="pay-logo">GoPay</div>
                        <div class="pay-logo">OVO</div>
                        <div class="pay-logo">DANA</div>
                        <div class="pay-logo">BCA</div>
                        <div class="pay-logo">Mandiri</div>
                    </div>
                </section>
            </div>

            <!-- ======================= SEARCH VIEW ======================= -->
            <div class="app-view" id="view-search">
                <div class="page-header">
                    <h2>Search Games</h2>
                    <div class="search-bar">
                        <i class='bx bx-search'></i>
                        <input type="text" placeholder="Find your favorite game...">
                    </div>
                </div>
                <div class="search-results games-grid" style="padding: 1.5rem;">
                    <!-- Reusing game cards for layout -->
                    <div class="game-card" onclick="openGameDetail('Genshin Impact')">
                        <div class="game-img img-gi">GI</div>
                        <div class="game-info">
                            <h4>Genshin Impact</h4>
                            <p>HoYoverse</p>
                        </div>
                    </div>
                    <div class="game-card" onclick="openGameDetail('Roblox')">
                        <div class="game-img" style="background: linear-gradient(45deg, #111, #444);">RBX</div>
                        <div class="game-info">
                            <h4>Roblox</h4>
                            <p>Roblox Corp</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ======================= GAME DETAIL / TOPUP VIEW ======================= -->
            <div class="app-view" id="view-topup">
                <div class="topup-header img-ml" id="topup-banner">
                    <div class="topup-blur-bg"></div>
                    <button class="back-btn" onclick="navigate('home')"><i class='bx bx-arrow-back'></i></button>
                    <div class="topup-title">
                        <h2 id="topup-game-name">Mobile Legends</h2>
                        <p>Official Developer</p>
                    </div>
                </div>
                <div class="topup-body" style="padding-bottom: 80px;"> <!-- Extra padding for sticky bar -->
                    <!-- Step 1 -->
                    <div class="topup-step">
                        <div class="step-circle">1</div>
                        <h3>Account Info</h3>
                        <div class="form-group-row" id="dynamic-inputs">
                            <!-- Inputs generated dynamically by JS based on selected game -->
                        </div>
                        <small class="helper-text">To find your User ID, tap your avatar in the top left corner of the
                            main menu.</small>
                    </div>

                    <!-- Step 2 -->
                    <div class="topup-step">
                        <div class="step-circle">2</div>
                        <h3>Select Package</h3>
                        <div class="item-grid" id="topup-items">
                            <div v-for="(item, index) in activeItems" :key="item.sku_code"
                                 class="item-card advanced" 
                                 :data-price="item.price" 
                                 :data-item="item.product_name"
                                 :data-sku="item.buyer_sku_code"
                                 onclick="selectItem(this)">
                                <h4 style="font-size: 14px">{{ item.product_name }}</h4>
                                <p>Rp {{ (item.price).toLocaleString('id-ID') }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div class="topup-step">
                        <div class="step-circle">3</div>
                        <h3>Payment Method</h3>
                        <div class="payment-selection" id="topup-payments">
                            
                            <div v-if="paymentMethods.filter(p => p.type === 'EWALLET').length > 0">
                                <div class="payment-category-title">E-Wallet</div>
                                <div v-for="(pm, index) in paymentMethods.filter(p => p.type === 'EWALLET')" 
                                     :key="pm.name"
                                     class="pay-method-card advanced" 
                                     :data-fee="pm.name === 'QRIS' ? 0 : 1000" 
                                     :data-pay="pm.name"
                                     onclick="selectPayment(this)">
                                    <div class="pay-info">
                                        <i class='bx bx-wallet-alt'></i>
                                        <div class="pay-text">
                                            <span>{{ pm.name }}</span>
                                            <span class="fee">{{ pm.name === 'QRIS' ? 'Free Fee' : '+Rp 1.000' }}</span>
                                        </div>
                                    </div>
                                    <div class="pay-badge">Instant</div>
                                </div>
                            </div>

                            <div v-if="paymentMethods.filter(p => p.type === 'QR_CODE').length > 0">
                                <div class="payment-category-title">QR Code</div>
                                <div v-for="(pm, index) in paymentMethods.filter(p => p.type === 'QR_CODE')" 
                                     :key="pm.name"
                                     class="pay-method-card advanced active" 
                                     data-fee="0" 
                                     :data-pay="pm.name"
                                     onclick="selectPayment(this)">
                                    <div class="pay-info">
                                        <i class='bx bx-qr-scan'></i>
                                        <div class="pay-text">
                                            <span>{{ pm.name }}</span>
                                            <span class="fee">Free Fee</span>
                                        </div>
                                    </div>
                                    <div class="pay-badge">Instant</div>
                                </div>
                            </div>

                            <div v-if="paymentMethods.filter(p => p.type === 'VIRTUAL_ACCOUNT').length > 0">
                                <div class="payment-category-title">Virtual Account</div>
                                <div v-for="(pm, index) in paymentMethods.filter(p => p.type === 'VIRTUAL_ACCOUNT')" 
                                     :key="pm.code"
                                     class="pay-method-card advanced" 
                                     data-fee="2500" 
                                     :data-pay="pm.name"
                                     onclick="selectPayment(this)">
                                    <div class="pay-info">
                                        <i class='bx bxs-bank'></i>
                                        <div class="pay-text">
                                            <span>{{ pm.name }}</span>
                                            <span class="fee">+Rp 2.500</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ======================= PROFILE VIEW ======================= -->
            <div class="app-view" id="view-profile">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class='bx bxs-user'></i>
                    </div>
                    <h2>Ahmad Gamer</h2>
                    <p class="neon-text">VIP Member</p>
                </div>
                <div class="profile-balance">
                    <div class="balance-card">
                        <p>UpZone Balance</p>
                        <h3>Rp 150.000</h3>
                    </div>
                    <button class="btn-topup-balance"><i class='bx bx-plus'></i> Topup</button>
                </div>
                <div class="profile-menu">
                    <div class="menu-list-item">
                        <i class='bx bx-history'></i>
                        <span>Transaction History</span>
                        <i class='bx bx-chevron-right'></i>
                    </div>
                    <div class="menu-list-item">
                        <i class='bx bx-cog'></i>
                        <span>Settings</span>
                        <i class='bx bx-chevron-right'></i>
                    </div>
                    <div class="menu-list-item">
                        <i class='bx bx-help-circle'></i>
                        <span>Help Center</span>
                        <i class='bx bx-chevron-right'></i>
                    </div>
                    <div class="menu-list-item text-danger">
                        <i class='bx bx-log-out'></i>
                        <span>Log Out</span>
                    </div>
                </div>
            </div>

            <!-- ======================= NOTIFICATIONS VIEW ======================= -->
            <div class="app-view" id="view-notifications">
                <div class="page-header">
                    <button class="back-btn" onclick="navigate('home')"><i class='bx bx-arrow-back'></i></button>
                    <h2>Notifications</h2>
                </div>
                <div class="notif-list">
                    <div class="notif-item unread">
                        <div class="notif-icon"><i class='bx bxs-gift'></i></div>
                        <div class="notif-text">
                            <h4>Promo Weekend!</h4>
                            <p>Dapatkan diskon 10% untuk topup Valorant Point hari ini.</p>
                            <span class="notif-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="notif-item">
                        <div class="notif-icon success"><i class='bx bx-check'></i></div>
                        <div class="notif-text">
                            <h4>Topup Successful</h4>
                            <p>Pembelian 86 Diamonds MLBB telah berhasil.</p>
                            <span class="notif-time">1 day ago</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ======================= PAYMENT WAITING VIEW ======================= -->
            <div class="app-view payment-status-view" id="view-payment-waiting">
                <div class="checkout-receipt-card">
                    <div class="receipt-header">
                        <div class="pulsing-circle">
                            <i class='bx bx-time'></i>
                        </div>
                        <h2>Complete Payment</h2>
                        <div class="payment-countdown modern-timer" id="payment-timer">14:59</div>
                    </div>
                    
                    <div class="receipt-body">
                        <div class="receipt-row total-row">
                            <span>Total Amount</span>
                            <h3 id="waiting-total-price" class="neon-text">Rp 0</h3>
                        </div>
                        <div class="receipt-divider"></div>
                        <div class="receipt-row">
                            <span>Payment Method</span>
                            <strong id="waiting-payment-method">QRIS</strong>
                        </div>
                        <div class="receipt-row">
                            <span>Ref ID</span>
                            <strong id="waiting-order-id">TRX-...</strong>
                        </div>
                        
                        <div class="qr-container">
                            <div class="qr-scanner-overlay"></div>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UpZoneTopupDemo&bgcolor=ffffff&color=000000" alt="QR Code" />
                        </div>
                        <p class="qr-instruction">Scan this QR code using your e-Wallet app to complete the transaction.</p>
                    </div>

                    <div class="receipt-footer">
                        <button class="btn-primary-glow" onclick="simulatePaymentProcess()">
                            <i class='bx bx-check-shield'></i> I Have Paid
                        </button>
                        <button class="btn-ghost" onclick="navigate('home')">
                            Cancel Order
                        </button>
                    </div>
                </div>
            </div>

            <!-- ======================= PAYMENT SUCCESS VIEW ======================= -->
            <div class="app-view payment-status-view" id="view-payment-success">
                <div class="status-card success">
                    <div class="icon-circle success">
                        <i class='bx bx-check'></i>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Your topup has been processed and will be delivered shortly.</p>
                    <button class="btn-buy-now" style="width: 100%; justify-content: center; margin-top: 20px;"
                        onclick="navigate('home')">Back to Home</button>
                </div>
            </div>

            <!-- ======================= PAYMENT FAILED VIEW ======================= -->
            <div class="app-view payment-status-view" id="view-payment-failed">
                <div class="status-card failed">
                    <div class="icon-circle failed">
                        <i class='bx bx-x'></i>
                    </div>
                    <h2>Payment Failed</h2>
                    <p>We couldn't process your payment. Please check your balance and try again.</p>
                    <button class="btn-buy-now" style="width: 100%; justify-content: center; margin-top: 20px;"
                        onclick="navigate('home')">Try Again</button>
                </div>
            </div>

            <!-- ======================= SCRATCH CARD VIEW ======================= -->
            <div class="app-view" id="view-scratch" style="padding: 1.5rem; min-height: 80vh;">
                <div
                    style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; margin-top: 50px;">
                    <h2 class="neon-text" style="margin-bottom: 20px;">Daily Scratch Card</h2>
                    <p style="color: var(--text-muted); margin-bottom: 30px; text-align: center;">Scratch the card below
                        to reveal your secret promo code!</p>
                    <div class="scratch-container"
                        style="position: relative; width: 300px; height: 150px; background: linear-gradient(45deg, #111, #222); border-radius: 15px; border: 2px solid var(--neon-accent); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                        <div class="scratch-code" id="scratch-code"
                            style="font-size: 2rem; font-weight: bold; color: var(--primary-color); letter-spacing: 3px;">
                            UPZONE99</div>
                        <canvas id="scratch-canvas"
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: crosshair;"></canvas>
                    </div>
                    <button class="btn-buy-now" style="margin-top: 30px;" onclick="navigate('home')">Back to
                        Home</button>
                </div>
            </div>

        </main>
        <!-- Scratch Card Icon moved to header -->

        <!-- Bottom Navigation Bar -->
        <nav class="bottom-nav" id="bottom-nav">
            <a href="javascript:void(0)" class="nav-item active" data-target="home">
                <i class='bx bx-home-alt'></i>
                <span>Home</span>
            </a>
            <a href="javascript:void(0)" class="nav-item" data-target="search">
                <i class='bx bx-search'></i>
                <span>Search</span>
            </a>
            <a href="javascript:void(0)" class="nav-item cart-btn" id="open-cart">
                <div class="cart-icon-wrapper">
                    <i class='bx bx-shopping-bag'></i>
                    <span class="badge">0</span>
                </div>
                <span>Cart</span>
            </a>
            <a href="javascript:void(0)" class="nav-item" data-target="profile">
                <i class='bx bx-user'></i>
                <span>Profile</span>
            </a>
        </nav>

        <!-- Sticky Checkout Bar (Only shown in Topup view) -->
        <div class="sticky-checkout" id="sticky-checkout">
            <div class="checkout-info">
                <p>Total Price</p>
                <h3 id="checkout-total" class="neon-text">Rp 20.000</h3>
            </div>
            <div class="checkout-actions">
                <button class="btn-icon" onclick="addToCart()" title="Add to Cart"><i
                        class='bx bx-cart-add'></i></button>
                <button class="btn-buy-now" onclick="processCheckout()">Buy Now <i
                        class='bx bx-chevron-right'></i></button>
            </div>
        </div>

        <!-- Off-Canvas Cart Drawer -->
        <div class="cart-overlay" id="cart-overlay"></div>
        <div class="cart-drawer" id="cart-drawer">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button id="close-cart"><i class='bx bx-x'></i></button>
            </div>
            <div class="cart-body" id="cart-items">
                <div class="empty-cart">
                    <i class='bx bx-shopping-bag'></i>
                    <p>Your cart is empty.</p>
                </div>
            </div>
            <div class="cart-payment-section" style="padding: 1rem 1.5rem;">
                <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Select Payment for Cart:
                </h4>
                <select id="cart-payment-select" class="app-input" onchange="renderCart()">
                    <option value="0">QRIS (Free Fee)</option>
                    <option value="1000">GoPay (+Rp 1.000)</option>
                    <option value="2500">BCA Virtual Account (+Rp 2.500)</option>
                </select>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="neon-text" id="cart-total-price">Rp 0</span>
                </div>
                <button class="btn-checkout" onclick="checkoutCart()">Checkout Now</button>
            </div>
        </div>

        <!-- CUSTOM MODAL (Replaces default browser alert/confirm) -->
        <div class="custom-modal-overlay" id="custom-modal-overlay">
            <div class="custom-modal" id="custom-modal">
                <div class="modal-icon" id="modal-icon">
                    <i class='bx bx-info-circle'></i>
                </div>
                <h3 id="modal-title">Title</h3>
                <p id="modal-text">This is the message.</p>
                <div class="modal-actions" id="modal-actions">
                    <!-- Buttons dynamically inserted here -->
                </div>
            </div>
        </div>

        <!-- Floating Daily Reward (Gacha) -->
        <div class="floating-reward" id="open-gacha" data-tilt data-tilt-scale="1.1">
            <i class='bx bxs-gift bx-tada'></i>
        </div>

        <!-- Gacha Modal -->
        <div class="custom-modal-overlay" id="gacha-modal-overlay">
            <div class="custom-modal gacha-modal" id="gacha-modal">
                <h3>Daily Reward</h3>
                <div class="treasure-chest" id="treasure-chest">
                    <i class='bx bxs-box'></i>
                </div>
                <p id="gacha-result-text">Tap the chest to open!</p>
                <div class="modal-actions">
                    <button class="btn-modal cancel" onclick="closeGachaModal()">Close</button>
                </div>
            </div>
        </div>
        <!-- Auth Modal -->
        <div v-if="showAuthModal" class="custom-modal-overlay" style="z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div class="custom-modal animate-fade-in-up" style="width: 100%; max-width: 400px; padding: 30px; border-radius: 20px; background: rgba(20, 21, 35, 0.95); border: 1px solid var(--glass-border); position: relative;">
                <button @click="showAuthModal = false" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: white; cursor: pointer; font-size: 1.5rem;">
                    <i class='bx bx-x'></i>
                </button>
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="font-size: 1.8rem; font-weight: 700; color: white; margin-bottom: 5px;">{{ authMode === 'login' ? 'Welcome Back' : 'Create Account' }}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">{{ authMode === 'login' ? 'Login to top up faster' : 'Join us to get exclusive rewards' }}</p>
                </div>
                
                <form @submit.prevent="submitAuth" style="display: flex; flex-direction: column; gap: 15px;">
                    <div v-if="authMode === 'login'">
                        <input type="email" v-model="loginForm.email" placeholder="Email Address" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none; margin-bottom: 15px;">
                        <input type="password" v-model="loginForm.password" placeholder="Password" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                    </div>
                    <div v-else style="display: flex; flex-direction: column; gap: 15px;">
                        <input type="text" v-model="registerForm.name" placeholder="Full Name" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                        <input type="email" v-model="registerForm.email" placeholder="Email Address" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                        <input type="password" v-model="registerForm.password" placeholder="Password" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                        <input type="password" v-model="registerForm.password_confirmation" placeholder="Confirm Password" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                    </div>

                    <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(45deg, var(--primary-color), var(--neon-accent)); border: none; border-radius: 10px; color: white; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 10px;">
                        {{ authMode === 'login' ? 'Login' : 'Register' }}
                    </button>
                </form>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: var(--text-muted); font-size: 0.9rem;">
                        {{ authMode === 'login' ? "Don't have an account?" : "Already have an account?" }}
                        <a href="#" @click.prevent="authMode = authMode === 'login' ? 'register' : 'login'" style="color: var(--neon-accent); text-decoration: none; font-weight: 600;">
                            {{ authMode === 'login' ? 'Register here' : 'Login here' }}
                        </a>
                    </p>
                </div>
            </div>
        </div>

    </div>

</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';

const games = ref([]);
const popularBrands = ref([]);
const activeBrand = ref('');
const activeItems = ref([]);
const paymentMethods = ref([]);

// Auth State
const user = ref(null);
const showAuthModal = ref(false);
const authMode = ref('login');
const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '', password_confirmation: '' });

const openAuthModal = (mode = 'login') => {
    authMode.value = mode;
    showAuthModal.value = true;
};

const checkAuth = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const res = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            user.value = await res.json();
        } else {
            localStorage.removeItem('auth_token');
        }
    } catch (e) {
        console.error("Check auth failed", e);
    }
};

const submitAuth = async () => {
    const url = authMode.value === 'login' ? '/api/login' : '/api/register';
    const payload = authMode.value === 'login' ? loginForm.value : registerForm.value;
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('auth_token', data.access_token);
            user.value = data.user;
            showAuthModal.value = false;
            if (window.showCustomModal) {
                window.showCustomModal('Success', `Welcome ${data.user.name}!`, 'success');
            } else {
                alert(`Welcome ${data.user.name}!`);
            }
        } else {
            if (window.showCustomModal) {
                window.showCustomModal('Failed', data.message || 'Authentication failed', 'alert');
            } else {
                alert(data.message || 'Authentication failed');
            }
        }
    } catch (e) {
        console.error("Auth failed", e);
    }
};

// Fetch data from Digiflazz via Laravel Backend
const fetchGames = async () => {
    try {
        const response = await fetch('/api/games');
        const json = await response.json();
        if (json.data) {
            // Filter only prepaid games AND active ones
            games.value = json.data.filter(g => g.category === 'Games' && g.is_active === true);
            // Extract unique brands and sort
            popularBrands.value = [...new Set(games.value.map(g => g.brand))].sort();
        }
    } catch(e) {
        console.error("Failed to fetch games", e);
    }
};

const fetchPaymentMethods = async () => {
    try {
        const response = await fetch('/api/payment-methods');
        paymentMethods.value = await response.json();
    } catch(e) {
        console.error("Failed to fetch payment methods", e);
    }
};

// Expose to window so original JS can call it
const openGameDetailVue = (brandName) => {
    activeBrand.value = brandName;
    activeItems.value = games.value
        .filter(g => g.brand === brandName && g.seller_product_status === true && g.is_active === true)
        .sort((a,b) => a.price - b.price);
        
    // Call original logic to navigate
    if (window.openGameDetail) {
        window.openGameDetail(brandName);
    }
};
window.openGameDetailVue = openGameDetailVue;

onMounted(async () => {
    // Add frontend specific classes to body/html
    document.documentElement.classList.add('frontend-mode');
    document.body.classList.add('frontend-mode');

    // Inject style.css dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/style.css?v=1.01';
    link.id = 'frontend-style';
    document.head.appendChild(link);

    await checkAuth();
    await fetchGames();
    await fetchPaymentMethods();
    await nextTick();

    // Inject script.js so it runs after Vue mounts the DOM
    const script = document.createElement('script');
    script.src = '/script.js?v=1.03';
    script.id = 'frontend-script';
    script.async = true;
    document.body.appendChild(script);
});

onUnmounted(() => {
    // Remove frontend specific classes
    document.documentElement.classList.remove('frontend-mode');
    document.body.classList.remove('frontend-mode');
    
    // Clean up script
    const script = document.getElementById('frontend-script');
    if (script) {
        script.remove();
    }

    // Clean up style
    const style = document.getElementById('frontend-style');
    if (style) {
        style.remove();
    }
});
</script>