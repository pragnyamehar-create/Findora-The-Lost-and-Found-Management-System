const app = {
    currentUser: null,
    currentRoute: 'home',
    currentParams: {},
    pollingInterval: null,
    lastDataHash: '',

    init() {
        this.checkAuth();
        this.setupNavigation();
        this.navigate('home');
        this.startPolling();
    },

    checkAuth() {
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.updateNav();
        }
    },

    updateNav() {
        if (this.currentUser) {
            document.getElementById('navLogin').style.display = 'none';
            document.getElementById('navPost').style.display = 'block';
            document.getElementById('navLogout').style.display = 'block';
            
            if (this.currentUser.role === 'admin') {
                document.getElementById('navDashboard').style.display = 'block';
            }
        } else {
            document.getElementById('navLogin').style.display = 'block';
            document.getElementById('navPost').style.display = 'none';
            document.getElementById('navDashboard').style.display = 'none';
            document.getElementById('navLogout').style.display = 'none';
        }
    },

    setupNavigation() {
        document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(e.target.dataset.route);
            });
        });

        document.getElementById('navLogout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.currentUser = null;
            this.updateNav();
            this.navigate('home');
            ui.showToast('Logged out successfully');
        });
    },

    async navigate(route, params = {}) {
        this.currentRoute = route;
        this.currentParams = params || {};
        document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) activeLink.classList.add('active');

        try {
            switch (route) {
                case 'home':
                    ui.renderHome();
                    break;
                case 'login':
                    ui.renderLogin();
                    break;
                case 'register':
                    ui.renderRegister();
                    break;
                case 'post':
                    if (!this.currentUser) return this.navigate('login');
                    ui.renderPostItem();
                    break;
                case 'items':
                    await this.loadItems(params);
                    break;
                case 'dashboard':
                    if (!this.currentUser || this.currentUser.role !== 'admin') return this.navigate('home');
                    const stats = await api.getStats();
                    const complexReport = await api.getComplexReport();
                    ui.renderDashboard(stats, complexReport);
                    break;
            }
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    async handleAuth(action) {
        try {
            let data;
            if (action === 'login') {
                const usernameInput = document.getElementById('username').value;
                const passwordInput = document.getElementById('password').value;
                if (!usernameInput || !passwordInput) return ui.showToast('Please fill all fields', 'error');
                data = await api.login(usernameInput, passwordInput);
            } else if (action === 'register') {
                const username = document.getElementById('reg-username').value;
                const password = document.getElementById('reg-password').value;
                const name = document.getElementById('reg-name').value;
                const usn = document.getElementById('reg-usn').value;
                const phone_number = document.getElementById('reg-phone').value;
                const department = document.getElementById('reg-department').value;
                
                if (!username || !password || !name || !usn || !phone_number || !department) {
                    return ui.showToast('Please fill all required profile fields', 'error');
                }
                data = await api.register({ username, password, name, usn, phone_number, department });
            }

            localStorage.setItem('token', data.token);
            const userObj = { id: data.id, username: data.username, role: data.role };
            localStorage.setItem('user', JSON.stringify(userObj));
            this.currentUser = userObj;
            
            this.updateNav();
            this.navigate('home');
            ui.showToast(`Successfully ${action === 'login' ? 'logged in' : 'registered'}`);
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    async handlePostItem() {
        const title = document.getElementById('item-title').value;
        const description = document.getElementById('item-description').value;
        const category = document.getElementById('item-category').value;
        const item_date = document.getElementById('item-date').value;
        const imageFile = document.getElementById('item-image').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('item_date', item_date);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await api.createItem(formData);
            ui.showToast('Item posted successfully');
            this.navigate('items');
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    async loadItems(params = {}) {
        const items = await api.getItems(params);
        ui.renderItemsList(items, this.currentUser);
        this.lastDataHash = JSON.stringify(items);
    },

    editItem(id) {
        if (!this.lastDataHash) return;
        const items = JSON.parse(this.lastDataHash);
        const item = items.find(i => i.id === id);
        if (item) {
            this.currentRoute = 'edit';
            ui.renderEditItem(item);
        }
    },

    async handleEditItemSubmit(id) {
        const title = document.getElementById('edit-title').value;
        const description = document.getElementById('edit-description').value;
        const category = document.getElementById('edit-category').value;
        const status = document.getElementById('edit-status').value;
        const item_date = document.getElementById('edit-date').value;

        try {
            await api.updateItem(id, { title, description, category, status, item_date });
            ui.showToast('Item updated successfully');
            this.navigate('items');
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    async deleteItem(id) {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.deleteItem(id);
            ui.showToast('Item deleted');
            this.loadItems();
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    // ---- Claims Flow ----
    _claimItemId: null,

    showClaimModal(itemId, itemTitle, category) {
        this._claimItemId = itemId;
        this._claimCategory = category;
        const modal = document.getElementById('claim-modal');

        const isFound = category === 'found'; // someone posted a FOUND item → owner is claiming it back
        // For FOUND items: owner says "this is mine"
        // For LOST items: finder says "I found it"

        document.getElementById('claim-modal-title').style.background = isFound
            ? 'linear-gradient(135deg,#6366f1,#ec4899)' : 'linear-gradient(135deg,#f97316,#eab308)';
        document.getElementById('claim-modal-title').style.webkitBackgroundClip = 'text';
        document.getElementById('claim-modal-title').style.webkitTextFillColor = 'transparent';
        document.getElementById('claim-modal-title').textContent = isFound
            ? `🙋 Claim Ownership: ${itemTitle}`
            : `🔍 Report Found: ${itemTitle}`;

        document.getElementById('claim-modal-desc').textContent = isFound
            ? 'Describe proof that this item belongs to you — serial numbers, unique features, or where you lost it. The finder will review your claim.'
            : 'Describe where and when you found this item so the owner can verify and contact you. Your USN and department will be included for trust.';

        document.getElementById('claim-modal-tip').innerHTML = isFound
            ? '🔒 <strong>Privacy:</strong> Your USN, department, and phone are only shared with the finder — never shown publicly.'
            : '🔒 <strong>Privacy:</strong> Your contact info is only shared with the item owner — never shown publicly.';

        document.getElementById('claim-message').placeholder = isFound
            ? 'e.g. This is my black wallet. It has my student ID inside with USN 1AB21CS042. I lost it near the canteen on Friday...'
            : 'e.g. I found a black wallet near the library entrance on Sunday evening. It has some cards inside. I have kept it safely...';

        document.getElementById('claim-message').value = '';
        modal.style.display = 'flex';
    },

    closeClaimModal() {
        const modal = document.getElementById('claim-modal');
        if (modal) modal.style.display = 'none';
        this._claimItemId = null;
    },

    async submitClaim() {
        const message = document.getElementById('claim-message').value.trim();
        if (!message) return ui.showToast('Please describe your claim', 'error');
        const btn = document.getElementById('claim-submit-btn');
        btn.disabled = true;
        btn.textContent = 'Submitting...';
        try {
            await api.submitClaim(this._claimItemId, message);
            this.closeClaimModal();
            ui.showToast('✅ Claim submitted! The owner will review it.', 'success');
        } catch (error) {
            ui.showToast(error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Submit Claim';
        }
    },

    async viewClaims(itemId, itemTitle) {
        try {
            // Fetch the item to get its category
            const items = await api.getItems();
            const item = items.find(i => i.id === itemId);
            const category = item ? item.category : 'found';
            const claims = await api.getClaimsForItem(itemId);
            this._currentClaimsItemId = itemId;
            this._currentClaimsTitle = itemTitle;
            this._currentClaimsCategory = category;
            ui.renderClaimsView(itemTitle, claims, category);
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    async decideClaim(claimId, status) {
        const action = status === 'approved' ? 'approve and resolve' : 'reject';
        if (!confirm(`Are you sure you want to ${action} this claim?`)) return;
        try {
            await api.updateClaimStatus(claimId, status);
            ui.showToast(status === 'approved' ? '✅ Approved! Item marked as Resolved.' : '❌ Claim rejected.', status === 'approved' ? 'success' : 'error');
            // Refresh the claims view
            const claims = await api.getClaimsForItem(this._currentClaimsItemId);
            ui.renderClaimsView(this._currentClaimsTitle, claims, this._currentClaimsCategory);
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    handleSearch(e) {
        if (e.key === 'Enter') {
            this.loadItems({ search: e.target.value });
        }
    },

    // Real-time synchronization via Polling
    startPolling() {
        this.pollingInterval = setInterval(async () => {
            if (this.currentRoute === 'items') {
                try {
                    // Get current search value if exists so we don't clear it
                    const searchInput = document.getElementById('search-input');
                    const searchVal = searchInput ? searchInput.value : '';
                    
                    // Preserve the navigation parameters (like category filter) and add the search term
                    const pollParams = { ...this.currentParams };
                    if (searchVal) pollParams.search = searchVal;
                    
                    const items = await api.getItems(pollParams);
                    const newHash = JSON.stringify(items);
                    
                    // Only re-render if data has changed to prevent UI flashing
                    if (newHash !== this.lastDataHash) {
                        ui.renderItemsList(items, this.currentUser);
                        this.lastDataHash = newHash;
                        
                        // Restore search value after re-render
                        const newSearchInput = document.getElementById('search-input');
                        if (newSearchInput) {
                            newSearchInput.value = searchVal;
                            // small UX enhancement to put focus back
                            newSearchInput.focus();
                        }
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                }
            } else if (this.currentRoute === 'dashboard') {
                // Also poll dashboard stats
                try {
                    const stats = await api.getStats();
                    const complexReport = await api.getComplexReport();
                    const newHash = JSON.stringify({stats, complexReport});
                    if (newHash !== this.lastDataHash) {
                        ui.renderDashboard(stats, complexReport);
                        this.lastDataHash = newHash;
                    }
                } catch (error) {}
            }
        }, 1000); // Check every 1 second for instant updates
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
