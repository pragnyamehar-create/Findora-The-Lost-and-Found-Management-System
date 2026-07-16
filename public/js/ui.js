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
            <div class="glass card" style="text-align: center; padding: 5rem 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,244,255,0.9));">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                <h1 style="font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;">Find What You Lost.</h1>
                <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 2.5rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                    The premium Lost and Found Management System. Fast, secure, and real-time.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" style="padding: 0.9rem 2rem; font-size: 1rem;" onclick="app.navigate('items', { category: 'lost' })">🔴 Lost Something?</button>
                    <button class="btn btn-outline" style="padding: 0.9rem 2rem; font-size: 1rem;" onclick="app.navigate('items', { category: 'found' })">🟢 Found Something?</button>
                </div>
            </div>
        `;
    },

    renderLogin() {
        this.container.innerHTML = `
            <div class="auth-container glass card" style="max-width: 400px; margin: 0 auto;">
                <h2 style="margin-bottom: 1.5rem; text-align: center;">Welcome Back</h2>
                <form id="auth-form">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" class="form-control" required>
                    </div>
                    <button type="submit" id="btn-login" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Login</button>
                    <p style="text-align: center; color: var(--text-secondary); font-size: 0.9rem;">
                        Don't have an account? <a href="#" id="link-register" style="color: var(--accent-primary);">Register here</a>
                    </p>
                </form>
            </div>
        `;

        document.getElementById('btn-login').addEventListener('click', (e) => {
            e.preventDefault();
            app.handleAuth('login');
        });
        document.getElementById('link-register').addEventListener('click', (e) => {
            e.preventDefault();
            app.navigate('register');
        });
    },

    renderRegister() {
        this.container.innerHTML = `
            <div class="auth-container glass card" style="max-width: 500px; margin: 0 auto;">
                <h2 style="margin-bottom: 1.5rem; text-align: center;">Create Account</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="reg-name" class="form-control" placeholder="John Doe" required>
                    </div>
                    <div class="form-group" style="display: flex; gap: 1rem;">
                        <div style="flex: 1;">
                            <label>USN</label>
                            <input type="text" id="reg-usn" class="form-control" placeholder="1AB23CS001" required>
                        </div>
                        <div style="flex: 1;">
                            <label>Department</label>
                            <input type="text" id="reg-department" class="form-control" placeholder="Computer Science" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="reg-phone" class="form-control" placeholder="xxxxx" pattern="[0-9xX]*" required>
                    </div>
                    <hr style="border: 0; border-top: 1px solid var(--glass-border); margin: 1.5rem 0;">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="reg-username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="reg-password" class="form-control" required>
                    </div>
                    <button type="submit" id="btn-register" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Create Account</button>
                    <p style="text-align: center; color: var(--text-secondary); font-size: 0.9rem;">
                        Already have an account? <a href="#" id="link-login" style="color: var(--accent-primary);">Login here</a>
                    </p>
                </form>
            </div>
        `;

        document.getElementById('btn-register').addEventListener('click', (e) => {
            e.preventDefault();
            app.handleAuth('register');
        });
        document.getElementById('link-login').addEventListener('click', (e) => {
            e.preventDefault();
            app.navigate('login');
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
                        <label>Date Lost/Found</label>
                        <input type="date" id="item-date" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Image (Optional)</label>
                        <input type="file" id="item-image" class="form-control" accept="image/*">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Item</button>
                </form>
            </div>
        `;

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('item-date').value = today;

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
                        <label>Date Lost/Found</label>
                        <input type="date" id="edit-date" class="form-control" value="${item.item_date ? item.item_date.split('T')[0] : ''}" required>
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
            const isOtherUser = currentUser && !isOwnerOrAdmin;
            const isResolved = item.status === 'resolved';
            const imgHtml = item.image_url ? `<img src="${item.image_url}" alt="Item image">` : '';

            // Resolved overlay banner
            const resolvedBanner = isResolved ? `
                <div style="position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(16,185,129,0.12); border-radius:20px; display:flex; align-items:flex-start; justify-content:flex-end; padding:1rem; pointer-events:none; z-index:1;">
                    <span style="background:linear-gradient(135deg,#10b981,#14b8a6); color:white; padding:0.35rem 0.9rem; border-radius:20px; font-size:0.8rem; font-weight:800; letter-spacing:0.05em;">✅ RESOLVED</span>
                </div>
            ` : '';

            // Action buttons
            let actionsHtml = '';
            if (isOwnerOrAdmin && !isResolved) {
                actionsHtml = `
                    <div style="display:flex; gap:0.5rem; margin-top:1rem; padding-top:1rem; border-top:1px solid #e0e7ff; flex-wrap:wrap;">
                        <button class="btn btn-outline" style="padding:0.3rem 0.8rem; font-size:0.8rem;" onclick="app.editItem(${item.id})">✏️ Edit</button>
                        <button class="btn" style="padding:0.3rem 0.8rem; font-size:0.8rem; background:linear-gradient(135deg,#ef4444,#f97316); color:white;" onclick="app.deleteItem(${item.id})">🗑️ Delete</button>
                        <button class="btn" style="padding:0.3rem 0.8rem; font-size:0.8rem; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:white;" onclick="app.viewClaims(${item.id}, '${item.title.replace(/'/g, "\\'")}')">📋 View Claims</button>
                    </div>
                `;
            } else if (isOwnerOrAdmin && isResolved) {
                actionsHtml = `
                    <div style="display:flex; gap:0.5rem; margin-top:1rem; padding-top:1rem; border-top:1px solid #e0e7ff;">
                        <button class="btn" style="padding:0.3rem 0.8rem; font-size:0.8rem; background:linear-gradient(135deg,#ef4444,#f97316); color:white;" onclick="app.deleteItem(${item.id})">🗑️ Delete</button>
                    </div>
                `;
            } else if (isOtherUser && !isResolved) {
                const claimBtn = item.category === 'found'
                    ? `<button class="btn btn-primary" style="width:100%; font-size:0.85rem; background:linear-gradient(135deg,#6366f1,#ec4899);" onclick="app.showClaimModal(${item.id}, '${item.title.replace(/'/g, "\\'")}', 'found')">🙋 This Is Mine! — Claim Ownership</button>`
                    : `<button class="btn btn-primary" style="width:100%; font-size:0.85rem; background:linear-gradient(135deg,#f97316,#eab308);" onclick="app.showClaimModal(${item.id}, '${item.title.replace(/'/g, "\\'")}', 'lost')">🔍 I Found This Item!</button>`;
                actionsHtml = `
                    <div style="margin-top:1rem; padding-top:1rem; border-top:1px solid #e0e7ff;">
                        ${claimBtn}
                    </div>
                `;
            } else if (isResolved) {
                const resolvedMsg = item.category === 'found'
                    ? '✅ The owner has been identified and the item has been returned.'
                    : '✅ A finder has been connected with the owner. Item resolved!';
                actionsHtml = `
                    <div style="margin-top:1rem; padding-top:1rem; border-top:1px solid #e0e7ff; text-align:center; color:#10b981; font-size:0.85rem; font-weight:600;">
                        ${resolvedMsg}
                    </div>
                `;
            }

            html += `
                <div class="item-card glass card" style="position:relative; overflow:hidden;">
                    ${resolvedBanner}
                    ${imgHtml}
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span class="badge ${item.category}">${item.category.toUpperCase()}</span>
                        <span class="badge ${item.status}">${item.status.toUpperCase()}</span>
                    </div>
                    <h3 style="margin-bottom:0.4rem;">${item.title}</h3>
                    <p style="color:var(--text-secondary); margin:0.4rem 0; font-size:0.9rem;">${item.description}</p>
                    <div style="margin-bottom:0.5rem; font-size:0.82rem; color:var(--text-secondary);">
                        📅 Date: <strong>${item.item_date ? new Date(item.item_date).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'}) : 'N/A'}</strong>
                    </div>
                    <small style="color:var(--text-secondary);">📌 Reported by: <strong>${item.reported_by || 'Unknown'}</strong></small>
                    ${actionsHtml}
                </div>
            `;
        });

        html += `</div>`;
        this.container.innerHTML = html;

        // Inject claim modal container if not present
        if (!document.getElementById('claim-modal')) {
            const modal = document.createElement('div');
            modal.id = 'claim-modal';
            modal.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:1000; align-items:center; justify-content:center;';
            modal.innerHTML = `
                <div style="background:white; border-radius:20px; padding:2rem; max-width:500px; width:90%; box-shadow:0 20px 60px rgba(0,0,0,0.2); animation:fadeIn 0.3s ease;">
                    <h3 id="claim-modal-title" style="margin-bottom:0.5rem; font-weight:800;"></h3>
                    <p id="claim-modal-desc" style="color:#6b7280; font-size:0.88rem; margin-bottom:1.25rem; line-height:1.5;"></p>
                    <div id="claim-modal-tip" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:0.75rem 1rem; font-size:0.82rem; color:#065f46; margin-bottom:1rem;"></div>
                    <textarea id="claim-message" rows="4" class="form-control" placeholder=""></textarea>
                    <div style="display:flex; gap:0.75rem; margin-top:1.25rem;">
                        <button id="claim-submit-btn" class="btn btn-primary" style="flex:1;" onclick="app.submitClaim()">Submit</button>
                        <button class="btn btn-outline" style="flex:1;" onclick="app.closeClaimModal()">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    },

    renderClaimsView(itemTitle, claims, category) {
        const isFound = category === 'found';
        const viewTitle = isFound ? `Ownership Claims for: ${itemTitle}` : `Finder Reports for: ${itemTitle}`;
        const emptyMsg = isFound ? "No one has claimed ownership yet." : "No one has reported finding this item yet.";
        const emptySub = isFound ? "The owner hasn't come forward yet." : "Keep waiting — someone may report it.";

        this.container.innerHTML = `
            <div class="glass card" style="background:rgba(255,255,255,0.95);">
                <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;">
                    <button class="btn btn-outline" style="padding:0.4rem 0.8rem; font-size:0.85rem;" onclick="app.navigate('items')">← Back</button>
                    <h2 style="background:linear-gradient(135deg,#6366f1,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-weight:800;">${isFound ? '🙋' : '🔍'} ${viewTitle}</h2>
                </div>
                <div style="background:#e0e7ff; border-radius:10px; padding:0.75rem 1rem; font-size:0.85rem; color:#3730a3; margin-bottom:1.5rem;">
                    ${isFound
                        ? '📋 Review each claimant\'s details carefully. Only approve the person who can prove genuine ownership.'
                        : '📋 Review each finder\'s report. Approve the one that matches where and how you lost it, then contact them.'}
                </div>

                ${claims.length === 0 ? `
                    <div style="text-align:center; padding:3rem; color:var(--text-secondary);">
                        <div style="font-size:3rem; margin-bottom:1rem;">📭</div>
                        <p style="font-size:1.1rem; font-weight:600;">${emptyMsg}</p>
                        <p style="font-size:0.9rem;">${emptySub}</p>
                    </div>
                ` : claims.map(claim => `
                    <div class="card" style="margin-bottom:1rem; border-left:4px solid ${claim.status === 'approved' ? '#10b981' : claim.status === 'rejected' ? '#ef4444' : '#6366f1'}; background:${claim.status === 'approved' ? 'rgba(16,185,129,0.05)' : claim.status === 'rejected' ? 'rgba(239,68,68,0.05)' : 'rgba(99,102,241,0.05)'};">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
                            <div>
                                <strong style="font-size:1rem;">${isFound ? '👤 Claimant' : '🔍 Finder'}: ${claim.name || claim.username}</strong>
                                <span style="color:var(--text-secondary); font-size:0.85rem; margin-left:0.5rem;">@${claim.username}</span>
                                <div style="margin-top:0.25rem; display:flex; gap:1rem; font-size:0.82rem; color:var(--text-secondary); flex-wrap:wrap;">
                                    <span>🎓 USN: <strong>${claim.usn || 'N/A'}</strong></span>
                                    <span>🏛️ Dept: <strong>${claim.department || 'N/A'}</strong></span>
                                    <span>📱 Phone: <strong>${claim.phone_number || 'N/A'}</strong></span>
                                </div>
                            </div>
                            <span style="padding:0.3rem 0.8rem; border-radius:20px; font-size:0.78rem; font-weight:700; background:${claim.status === 'approved' ? '#d1fae5' : claim.status === 'rejected' ? '#fee2e2' : '#e0e7ff'}; color:${claim.status === 'approved' ? '#065f46' : claim.status === 'rejected' ? '#991b1b' : '#3730a3'};">${claim.status.toUpperCase()}</span>
                        </div>
                        <p style="margin:0.75rem 0; color:#374151; background:rgba(255,255,255,0.8); padding:0.75rem; border-radius:8px; font-style:italic; border-left:3px solid #a5b4fc;">"${claim.message}"</p>
                        <div style="font-size:0.8rem; color:var(--text-secondary);">Submitted: ${new Date(claim.created_at).toLocaleString()}</div>
                        ${claim.status === 'pending' ? `
                            <div style="display:flex; gap:0.75rem; margin-top:1rem; flex-wrap:wrap;">
                                <button class="btn" style="background:linear-gradient(135deg,#10b981,#14b8a6); color:white; padding:0.45rem 1.2rem; font-size:0.85rem;" onclick="app.decideClaim(${claim.id}, 'approved')">
                                    ${isFound ? '✅ Approve — This Is The Owner' : '✅ Confirm — They Found My Item'}
                                </button>
                                <button class="btn" style="background:linear-gradient(135deg,#ef4444,#f97316); color:white; padding:0.45rem 1.2rem; font-size:0.85rem;" onclick="app.decideClaim(${claim.id}, 'rejected')">❌ Reject</button>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },


    renderDashboard(stats, complexData = {}) {
        const userReport = complexData.userReport || [];
        const yearlyStats = complexData.yearlyStats || [];

        let complexReportHtml = '';
        if (userReport.length > 0) {
            complexReportHtml = `
                <div class="card" style="margin-top: 2rem; overflow-x: auto;">
                    <h3 style="margin-bottom: 1rem;">Complex User Activity Report</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">
                        This report uses SQL INNER JOIN, LEFT OUTER JOIN, and Aggregate Functions with GROUP BY.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--glass-border);">
                                <th style="padding: 0.75rem;">Username</th>
                                <th style="padding: 0.75rem;">Category</th>
                                <th style="padding: 0.75rem;">Total Items</th>
                                <th style="padding: 0.75rem;">Latest Post Date</th>
                                <th style="padding: 0.75rem;">Total Claims</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userReport.map(row => `
                                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                    <td style="padding: 0.75rem;">${row.username}</td>
                                    <td style="padding: 0.75rem;">
                                        <span class="badge ${row.category}">${row.category.toUpperCase()}</span>
                                    </td>
                                    <td style="padding: 0.75rem; font-weight: bold;">${row.total_items}</td>
                                    <td style="padding: 0.75rem; color: var(--text-secondary);">${new Date(row.latest_post).toLocaleString()}</td>
                                    <td style="padding: 0.75rem;">${row.total_claims}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        let yearlyStatsHtml = '';
        if (yearlyStats.length > 0) {
            yearlyStatsHtml = `
                <div class="card" style="margin-top: 2rem; overflow-x: auto;">
                    <h3 style="margin-bottom: 1rem;">Yearly Statistics</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">
                        Aggregated total counts and percentages of lost vs. found items by year.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--glass-border);">
                                <th style="padding: 0.75rem;">Year</th>
                                <th style="padding: 0.75rem;">Total Items</th>
                                <th style="padding: 0.75rem; color: var(--danger);">Lost Items</th>
                                <th style="padding: 0.75rem; color: var(--success);">Found Items</th>
                                <th style="padding: 0.75rem;">Lost %</th>
                                <th style="padding: 0.75rem;">Found %</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${yearlyStats.map(row => `
                                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                    <td style="padding: 0.75rem; font-weight: bold;">${row.year}</td>
                                    <td style="padding: 0.75rem;">${row.total_items}</td>
                                    <td style="padding: 0.75rem; color: var(--danger);">${row.total_lost}</td>
                                    <td style="padding: 0.75rem; color: var(--success);">${row.total_found}</td>
                                    <td style="padding: 0.75rem;">
                                        <div style="background: #fde8e8; border-radius: 4px; height: 8px; width: 100px; display: inline-block; margin-right: 8px;">
                                            <div style="background: var(--danger); height: 100%; width: ${row.lost_percentage}%; border-radius: 4px;"></div>
                                        </div>
                                        <span style="color: var(--danger); font-weight: 600;">${row.lost_percentage}%</span>
                                    </td>
                                    <td style="padding: 0.75rem;">
                                        <div style="background: #d1fae5; border-radius: 4px; height: 8px; width: 100px; display: inline-block; margin-right: 8px;">
                                            <div style="background: var(--success); height: 100%; width: ${row.found_percentage}%; border-radius: 4px;"></div>
                                        </div>
                                        <span style="color: var(--success); font-weight: 600;">${row.found_percentage}%</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        const interactiveSqlHtml = `
            <div class="card" style="margin-top: 2rem; border: 2px solid #e0e7ff; background: linear-gradient(135deg, #f5f3ff, #fdf2f8);">
                <h3 style="margin-bottom: 0.5rem; color: var(--accent-primary);"><i class="fa-solid fa-terminal"></i> Interactive SQL Explorer</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.88rem;">
                    Click any button to execute that specific SQL clause or aggregate function live against the database.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#6366f1,#8b5cf6); font-size:0.82rem;" onclick="ui.executeMaxLost()">⬆️ MAX() — Peak Lost Date</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#14b8a6,#06b6d4); font-size:0.82rem;" onclick="ui.executeMinLost()">⬇️ MIN() — Least Lost Date</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#f97316,#eab308); font-size:0.82rem;" onclick="ui.executeCountByStatus()">🔢 COUNT() — By Status</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#ec4899,#f43f5e); font-size:0.82rem;" onclick="ui.executeAvgItems()">📐 AVG() — Items/User</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#10b981,#84cc16); font-size:0.82rem;" onclick="ui.executeDistinctReporters()">👥 COUNT(DISTINCT)</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#3b82f6,#6366f1); font-size:0.82rem;" onclick="ui.executeSumByCategory()">➕ SUM() — By Category</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#8b5cf6,#ec4899); font-size:0.82rem;" onclick="ui.executeGroupBy()">📅 GROUP BY — 5 Years</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#ef4444,#f97316); font-size:0.82rem;" onclick="ui.executeInnerJoin()">🔗 INNER JOIN — Claims</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg,#0ea5e9,#14b8a6); font-size:0.82rem;" onclick="ui.executeLeftJoin()">↩️ LEFT OUTER JOIN</button>
                </div>
                <div id="interactive-sql-results" style="background: #f8faff; border: 1px solid #e0e7ff; padding: 1rem; border-radius: 10px; min-height: 60px; font-family: monospace; font-size: 0.9rem; color: var(--text-primary); overflow-x: auto;">
                    <span style="color: var(--text-secondary);">Click any button above to execute a query and see results here...</span>
                </div>
            </div>
        `;

        const monthlyExplorerHtml = `
            <div class="card" style="margin-top: 2rem; border: 2px solid #e0e7ff; background: linear-gradient(135deg, #f0fdf4, #ecfdf5);">
                <h3 style="margin-bottom: 0.5rem; color: #059669;"><i class="fa-regular fa-calendar"></i> Monthly Stats Explorer</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.88rem;">
                    Select a specific month and year to see aggregated statistics.
                </p>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: flex-end; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 150px;">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #059669; margin-bottom: 0.25rem;">Month</label>
                        <select id="stats-month-select" class="form-control" style="background: white; border: 1px solid #bbf7d0;">
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #059669; margin-bottom: 0.25rem;">Year</label>
                        <select id="stats-year-select" class="form-control" style="background: white; border: 1px solid #bbf7d0;">
                            <option value="">All Years</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 0.55rem 1.5rem; font-size: 0.85rem; border: none; height: 38px;" onclick="ui.executeMonthlyStatsFromSelectors()">🔍 View Stats</button>
                </div>
                <div id="monthly-stats-results" style="background: white; border: 1px solid #d1fae5; padding: 1rem; border-radius: 10px; min-height: 60px; font-size: 0.95rem; color: var(--text-primary);">
                    <span style="color: var(--text-secondary);">Select a month and a year to view stats...</span>
                </div>
            </div>
        `;

        this.container.innerHTML = `
            <div class="glass card" style="background: rgba(255,255,255,0.9);">
                <h2 style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; font-size: 1.8rem;">Admin Dashboard</h2>
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                    <div class="card" style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; box-shadow: 0 6px 20px rgba(99,102,241,0.35);">
                        <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">👥</div>
                        <h3 style="font-size: 0.9rem; opacity: 0.9; font-weight: 600;">Total Users</h3>
                        <p style="font-size: 2.5rem; font-weight: 800;">${stats.users}</p>
                    </div>
                    <div class="card" style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #ef4444, #f97316); color: white; border: none; box-shadow: 0 6px 20px rgba(239,68,68,0.35);">
                        <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">🔴</div>
                        <h3 style="font-size: 0.9rem; opacity: 0.9; font-weight: 600;">Lost Items</h3>
                        <p style="font-size: 2.5rem; font-weight: 800;">${stats.lost}</p>
                    </div>
                    <div class="card" style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; border: none; box-shadow: 0 6px 20px rgba(16,185,129,0.35);">
                        <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">🟢</div>
                        <h3 style="font-size: 0.9rem; opacity: 0.9; font-weight: 600;">Found Items</h3>
                        <p style="font-size: 2.5rem; font-weight: 800;">${stats.found}</p>
                    </div>
                </div>
                ${monthlyExplorerHtml}
                ${interactiveSqlHtml}
                ${complexReportHtml}
                ${yearlyStatsHtml}
            </div>
        `;
    },

    async executeMonthlyStatsFromSelectors() {
        const monthSelect = document.getElementById('stats-month-select');
        const yearSelect = document.getElementById('stats-year-select');
        const monthVal = monthSelect.value;
        const yearVal = yearSelect.value;
        const monthName = monthSelect.options[monthSelect.selectedIndex].text;
        
        await this.executeMonthlyStats(monthVal, monthName, yearVal);
    },

    async executeMonthlyStats(month, monthName, year = '') {
        const r = document.getElementById('monthly-stats-results');
        const titleStr = year ? `${monthName} ${year}` : `${monthName} (All Years)`;
        r.innerHTML = `<span style="color:#059669;">Loading stats for ${titleStr}...</span>`;
        try {
            const data = await api.getStatsByMonth(month, year);
            if (!data || data.total_items === 0) { 
                r.innerHTML = `<span style="color:var(--text-secondary);">No items reported in ${titleStr}.</span>`; 
                return; 
            }
            r.innerHTML = `
                <strong style="color:#059669;">✅ ${titleStr} Stats:</strong>
                <div style="display:flex; gap:1.5rem; margin-top:0.75rem; flex-wrap:wrap;">
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:0.75rem 1.25rem; text-align:center;">
                        <div style="font-size:0.75rem; color:#475569; text-transform:uppercase; font-weight:700;">Total Items</div>
                        <div style="font-size:2rem; font-weight:800; color:#0f172a;">${data.total_items}</div>
                    </div>
                    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:0.75rem 1.25rem; text-align:center;">
                        <div style="font-size:0.75rem; color:#991b1b; text-transform:uppercase; font-weight:700;">Lost Items</div>
                        <div style="font-size:2rem; font-weight:800; color:#ef4444;">${data.total_lost}</div>
                    </div>
                    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:0.75rem 1.25rem; text-align:center;">
                        <div style="font-size:0.75rem; color:#065f46; text-transform:uppercase; font-weight:700;">Found Items</div>
                        <div style="font-size:2rem; font-weight:800; color:#10b981;">${data.total_found}</div>
                    </div>
                </div>
            `;
        } catch(e) { 
            r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; 
        }
    },

    async executeMaxLost() {
        const resultsContainer = document.getElementById('interactive-sql-results');
        resultsContainer.innerHTML = '<span style="color: var(--accent-primary);">Executing MAX()...</span>';
        try {
            const data = await api.getMaxLost();
            if (!data) {
                resultsContainer.innerHTML = '<span style="color: var(--text-secondary);">No lost items found in database.</span>';
                return;
            }
            const formattedDate = new Date(data.date).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'});
            resultsContainer.innerHTML = `
                <strong style="color: var(--accent-primary);">SUCCESS:</strong> The single date with the MAXIMUM lost items was 
                <span style="color: #0f172a; background: #e2e8f0; padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: 700;">${formattedDate}</span> 
                with <span style="color: var(--danger); font-weight: bold; font-size: 1.1rem;">${data.total_lost}</span> lost items reported!
            `;
        } catch (error) {
            resultsContainer.innerHTML = `<span style="color: var(--danger);">Error executing query: ${error.message}</span>`;
        }
    },

    async executeGroupBy() {
        const resultsContainer = document.getElementById('interactive-sql-results');
        resultsContainer.innerHTML = '<span style="color: var(--accent-primary);">Executing GROUP BY...</span>';
        try {
            const data = await api.getGroupByStats();
            if (!data || data.length === 0) {
                resultsContainer.innerHTML = '<span style="color: var(--text-secondary);">No stats available.</span>';
                return;
            }
            
            let tableRows = data.map(row => `
                <tr>
                    <td style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${row.year}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${row.total_items}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--danger);">${row.lost_items}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--success);">${row.found_items}</td>
                </tr>
            `).join('');

            resultsContainer.innerHTML = `
                <div style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-primary);">SUCCESS:</strong> 5-Year GROUP BY Execution:</div>
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: 'Inter', sans-serif;">
                    <thead>
                        <tr>
                            <th style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">Year</th>
                            <th style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">Total Items</th>
                            <th style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">Lost</th>
                            <th style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">Found</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        } catch (error) {
            resultsContainer.innerHTML = `<span style="color: var(--danger);">Error executing query: ${error.message}</span>`;
        }
    },

    async executeMinLost() {
        const r = document.getElementById('interactive-sql-results');
        r.innerHTML = '<span style="color:#14b8a6;">⬇️ Executing MIN()...</span>';
        try {
            const data = await api.getMinLost();
            if (!data) { r.innerHTML = '<span style="color:var(--text-secondary);">No lost items in database.</span>'; return; }
            const formattedDate = new Date(data.date).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'});
            r.innerHTML = `<strong style="color:#14b8a6;">✅ MIN() Result:</strong> The date with the <em>fewest</em> lost items was
                <span style="background:#d1fae5; color:#065f46; padding:0.2rem 0.6rem; border-radius:6px; font-weight:700;">${formattedDate}</span>
                with only <span style="color:#059669; font-weight:800; font-size:1.1rem;">${data.total_lost}</span> lost item(s)!`;
        } catch(e) { r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; }
    },

    async executeCountByStatus() {
        const r = document.getElementById('interactive-sql-results');
        r.innerHTML = '<span style="color:#f97316;">🔢 Executing COUNT() by status...</span>';
        try {
            const data = await api.getCountByStatus();
            if (!data || data.length === 0) { r.innerHTML = '<span style="color:var(--text-secondary);">No data.</span>'; return; }
            const rows = data.map(row => `<tr><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;font-weight:700;text-transform:uppercase;">${row.status}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;color:#f97316;font-weight:700;">${row.total_items}</td></tr>`).join('');
            r.innerHTML = `<div style="margin-bottom:0.5rem;"><strong style="color:#f97316;">✅ COUNT() by Status:</strong></div><table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;"><thead><tr style="background:#fef3c7;"><th style="padding:0.5rem 0.75rem;color:#92400e;">Status</th><th style="padding:0.5rem 0.75rem;color:#92400e;">Total Items</th></tr></thead><tbody>${rows}</tbody></table>`;
        } catch(e) { r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; }
    },

    async executeAvgItems() {
        const r = document.getElementById('interactive-sql-results');
        r.innerHTML = '<span style="color:#ec4899;">📐 Executing AVG()...</span>';
        try {
            const data = await api.getAvgItemsPerUser();
            if (!data) { r.innerHTML = '<span style="color:var(--text-secondary);">No data.</span>'; return; }
            r.innerHTML = `<strong style="color:#ec4899;">✅ AVG() Result:</strong><div style="display:flex;gap:1.5rem;margin-top:0.75rem;flex-wrap:wrap;"><div style="background:#fdf2f8;border:1px solid #fbcfe8;border-radius:10px;padding:0.75rem 1.25rem;text-align:center;"><div style="font-size:0.75rem;color:#9d174d;text-transform:uppercase;font-weight:700;">AVG Items / User</div><div style="font-size:2rem;font-weight:800;color:#ec4899;">${data.avg_items_per_user}</div></div><div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:0.75rem 1.25rem;text-align:center;"><div style="font-size:0.75rem;color:#14532d;text-transform:uppercase;font-weight:700;">MAX by One User</div><div style="font-size:2rem;font-weight:800;color:#10b981;">${data.max_by_one_user}</div></div><div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:0.75rem 1.25rem;text-align:center;"><div style="font-size:0.75rem;color:#78350f;text-transform:uppercase;font-weight:700;">MIN by One User</div><div style="font-size:2rem;font-weight:800;color:#f59e0b;">${data.min_by_one_user}</div></div></div>`;
        } catch(e) { r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; }
    },

    async executeDistinctReporters() {
        const r = document.getElementById('interactive-sql-results');
        r.innerHTML = '<span style="color:#10b981;">👥 Executing COUNT(DISTINCT)...</span>';
        try {
            const data = await api.getDistinctReporters();
            if (!data || data.length === 0) { r.innerHTML = '<span style="color:var(--text-secondary);">No data.</span>'; return; }
            const rows = data.map(row => `<tr><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;"><span class="badge ${row.category}">${row.category.toUpperCase()}</span></td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;font-weight:700;color:#10b981;">${row.unique_reporters}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;">${row.total_items}</td></tr>`).join('');
            r.innerHTML = `<div style="margin-bottom:0.5rem;"><strong style="color:#10b981;">✅ COUNT(DISTINCT) Unique Reporters per Category:</strong></div><table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;"><thead><tr style="background:#d1fae5;"><th style="padding:0.5rem 0.75rem;color:#065f46;">Category</th><th style="padding:0.5rem 0.75rem;color:#065f46;">Unique Users</th><th style="padding:0.5rem 0.75rem;color:#065f46;">Total Items</th></tr></thead><tbody>${rows}</tbody></table>`;
        } catch(e) { r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; }
    },

    async executeSumByCategory() {
        const r = document.getElementById('interactive-sql-results');
        r.innerHTML = '<span style="color:#3b82f6;">➕ Executing SUM()...</span>';
        try {
            const data = await api.getSumByCategory();
            if (!data || data.length === 0) { r.innerHTML = '<span style="color:var(--text-secondary);">No data.</span>'; return; }
            const rows = data.map(row => `<tr><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;"><span class="badge ${row.category}">${row.category.toUpperCase()}</span></td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;text-transform:capitalize;">${row.status}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;font-weight:700;">${row.total}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;color:#3b82f6;font-weight:700;">${row.category_total}</td></tr>`).join('');
            r.innerHTML = `<div style="margin-bottom:0.5rem;"><strong style="color:#3b82f6;">✅ SUM() by Category &amp; Status (with PARTITION BY):</strong></div><table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;"><thead><tr style="background:#dbeafe;"><th style="padding:0.5rem 0.75rem;color:#1e40af;">Category</th><th style="padding:0.5rem 0.75rem;color:#1e40af;">Status</th><th style="padding:0.5rem 0.75rem;color:#1e40af;">Count</th><th style="padding:0.5rem 0.75rem;color:#1e40af;">Category Total</th></tr></thead><tbody>${rows}</tbody></table>`;
        } catch(e) { r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; }
    },

    async executeInnerJoin() {
        const r = document.getElementById('interactive-sql-results');
        r.innerHTML = '<span style="color:#ef4444;">🔗 Executing INNER JOIN...</span>';
        try {
            const data = await api.getInnerJoinClaims();
            if (!data || data.length === 0) { r.innerHTML = '<span style="color:var(--text-secondary);">No claimed items found. Submit a claim on an item first!</span>'; return; }
            const rows = data.map(row => `<tr><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;font-weight:600;">${row.title}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;"><span class="badge ${row.category}">${row.category.toUpperCase()}</span></td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;">${row.reported_by}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;text-transform:capitalize;">${row.claim_status}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;font-size:0.8rem;">${new Date(row.claim_date).toLocaleDateString()}</td></tr>`).join('');
            r.innerHTML = `<div style="margin-bottom:0.5rem;"><strong style="color:#ef4444;">✅ INNER JOIN (items ∩ claims ∩ users):</strong></div><table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;"><thead><tr style="background:#fee2e2;"><th style="padding:0.5rem 0.75rem;color:#991b1b;">Title</th><th style="padding:0.5rem 0.75rem;color:#991b1b;">Category</th><th style="padding:0.5rem 0.75rem;color:#991b1b;">Reported By</th><th style="padding:0.5rem 0.75rem;color:#991b1b;">Claim Status</th><th style="padding:0.5rem 0.75rem;color:#991b1b;">Date</th></tr></thead><tbody>${rows}</tbody></table>`;
        } catch(e) { r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; }
    },

    async executeLeftJoin() {
        const r = document.getElementById('interactive-sql-results');
        r.innerHTML = '<span style="color:#0ea5e9;">↩️ Executing LEFT OUTER JOIN...</span>';
        try {
            const data = await api.getLeftJoinUsers();
            if (!data || data.length === 0) { r.innerHTML = '<span style="color:var(--text-secondary);">No users found.</span>'; return; }
            const rows = data.map(row => `<tr><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;font-weight:600;">${row.username}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;color:var(--text-secondary);">${row.department || '—'}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;font-weight:700;">${row.total_items}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;color:var(--danger);">${row.lost_count}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #e0e7ff;color:var(--success);">${row.found_count}</td></tr>`).join('');
            r.innerHTML = `<div style="margin-bottom:0.5rem;"><strong style="color:#0ea5e9;">✅ LEFT OUTER JOIN (users → items) — Includes users with 0 items:</strong></div><table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;"><thead><tr style="background:#e0f2fe;"><th style="padding:0.5rem 0.75rem;color:#0c4a6e;">Username</th><th style="padding:0.5rem 0.75rem;color:#0c4a6e;">Department</th><th style="padding:0.5rem 0.75rem;color:#0c4a6e;">Total</th><th style="padding:0.5rem 0.75rem;color:#991b1b;">Lost</th><th style="padding:0.5rem 0.75rem;color:#065f46;">Found</th></tr></thead><tbody>${rows}</tbody></table>`;
        } catch(e) { r.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`; }
    }
};
