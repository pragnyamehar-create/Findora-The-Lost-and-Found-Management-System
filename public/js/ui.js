const ui = {
    container: document.getElementById('app-container'),

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    renderHome() {
        this.container.innerHTML = `
            <div class="glass card" style="text-align: center; padding: 4rem 2rem;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-primary);">Find What You Lost.</h1>
                <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 2rem;">
                    The premium Lost and Found Management System. Fast, secure, and real-time.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="app.navigate('items', { category: 'lost' })">Lost Something?</button>
                    <button class="btn btn-outline" onclick="app.navigate('items', { category: 'found' })">Found Something?</button>
                </div>
            </div>
        `;
    },

    renderLogin() {
        this.container.innerHTML = `
            <div class="auth-container glass card">
                <h2 style="margin-bottom: 1.5rem; text-align: center;">Login / Register</h2>
                <form id="auth-form">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" class="form-control" required>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" id="btn-login" class="btn btn-primary" style="flex: 1;">Login</button>
                        <button type="button" id="btn-register" class="btn btn-outline" style="flex: 1;">Register</button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('btn-login').addEventListener('click', (e) => {
            e.preventDefault();
            app.handleAuth('login');
        });
        document.getElementById('btn-register').addEventListener('click', (e) => {
            e.preventDefault();
            app.handleAuth('register');
        });
    },

    renderPostItem() {
        this.container.innerHTML = `
            <div class="glass card" style="max-width: 600px; margin: 0 auto;">
                <h2 style="margin-bottom: 1.5rem;">Post an Item</h2>
                <form id="post-item-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="item-title" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="item-description" class="form-control" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="item-category" class="form-control" required>
                            <option value="lost">I Lost This</option>
                            <option value="found">I Found This</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Image (Optional)</label>
                        <input type="file" id="item-image" class="form-control" accept="image/*">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Item</button>
                </form>
            </div>
        `;

        document.getElementById('post-item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            app.handlePostItem();
        });
    },

    renderEditItem(item) {
        this.container.innerHTML = `
            <div class="glass card" style="max-width: 600px; margin: 0 auto;">
                <h2 style="margin-bottom: 1.5rem;">Edit Item</h2>
                <form id="edit-item-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="edit-title" class="form-control" value="${item.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="edit-description" class="form-control" rows="4" required>${item.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="edit-category" class="form-control" required>
                            <option value="lost" ${item.category === 'lost' ? 'selected' : ''}>I Lost This</option>
                            <option value="found" ${item.category === 'found' ? 'selected' : ''}>I Found This</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="edit-status" class="form-control" required>
                            <option value="open" ${item.status === 'open' ? 'selected' : ''}>Open</option>
                            <option value="resolved" ${item.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Changes</button>
                    <button type="button" class="btn btn-outline" style="width: 100%; margin-top: 1rem;" onclick="app.navigate('items')">Cancel</button>
                </form>
            </div>
        `;

        document.getElementById('edit-item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            app.handleEditItemSubmit(item.id);
        });
    },

    renderItemsList(items, currentUser) {
        if (!items || items.length === 0) {
            this.container.innerHTML = `<div class="glass card"><h2 style="text-align: center; color: var(--text-secondary);">No items found.</h2></div>`;
            return;
        }

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Browse Items</h2>
                <input type="text" id="search-input" class="form-control" style="width: 250px;" placeholder="Search..." onkeyup="app.handleSearch(event)">
            </div>
            <div class="items-grid">
        `;

        items.forEach(item => {
            const isOwnerOrAdmin = currentUser && (currentUser.id === item.user_id || currentUser.role === 'admin');
            const imgHtml = item.image_url ? `<img src="${item.image_url}" alt="Item image">` : '';
            
            html += `
                <div class="item-card glass card">
                    ${imgHtml}
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span class="badge ${item.category}">${item.category.toUpperCase()}</span>
                        <span class="badge ${item.status}">${item.status.toUpperCase()}</span>
                    </div>
                    <h3>${item.title}</h3>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0; font-size: 0.9rem;">${item.description}</p>
                    <small style="color: var(--text-secondary);">Reported by: ${item.reported_by || 'Unknown'}</small>
                    
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border);">
                        <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="app.editItem(${item.id})">Update</button>
                        <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; border-color: var(--danger); color: var(--danger) !important;" onclick="app.deleteItem(${item.id})">Delete</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        this.container.innerHTML = html;
    },

    renderDashboard(stats) {
        this.container.innerHTML = `
            <div class="glass card">
                <h2 style="margin-bottom: 1.5rem;">Admin Dashboard</h2>
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                    <div class="card" style="flex: 1; background: rgba(99, 102, 241, 0.1); border-left: 4px solid var(--accent-primary);">
                        <h3>Total Users</h3>
                        <p style="font-size: 2rem; font-weight: bold;">${stats.users}</p>
                    </div>
                    <div class="card" style="flex: 1; background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger);">
                        <h3>Lost Items</h3>
                        <p style="font-size: 2rem; font-weight: bold;">${stats.lost}</p>
                    </div>
                    <div class="card" style="flex: 1; background: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--success);">
                        <h3>Found Items</h3>
                        <p style="font-size: 2rem; font-weight: bold;">${stats.found}</p>
                    </div>
                </div>
            </div>
        `;
    }
};
