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
                    ui.renderDashboard(stats);
                    break;
            }
        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    },

    async handleAuth(action) {
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        if (!usernameInput || !passwordInput) {
            return ui.showToast('Please fill all fields', 'error');
        }

        try {
            const data = action === 'login' 
                ? await api.login(usernameInput, passwordInput)
                : await api.register(usernameInput, passwordInput);

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
        const imageFile = document.getElementById('item-image').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
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

        try {
            await api.updateItem(id, { title, description, category, status });
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
                    const newHash = JSON.stringify(stats);
                    if (newHash !== this.lastDataHash) {
                        ui.renderDashboard(stats);
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
