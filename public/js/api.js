const API_URL = '/api';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            ...(options.headers || {})
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            if (options.body && typeof options.body === 'object') {
                options.body = JSON.stringify(options.body);
            }
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }

        return data;
    },

    login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: { username, password }
        });
    },

    register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: userData
        });
    },

    getItems(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/items${query ? '?' + query : ''}`);
    },

    createItem(formData) {
        return this.request('/items', {
            method: 'POST',
            body: formData // FormData will skip Content-Type and let browser set it with boundary
        });
    },

    updateItem(id, data) {
        return this.request(`/items/${id}`, {
            method: 'PUT',
            body: data
        });
    },

    deleteItem(id) {
        return this.request(`/items/${id}`, {
            method: 'DELETE'
        });
    },

    getStats() {
        return this.request('/items/stats');
    },

    getComplexReport() {
        return this.request('/items/complex-report');
    },

    getMaxLost() {
        return this.request('/items/max-lost');
    },

    getGroupByStats() {
        return this.request('/items/groupby-stats');
    },

    getMinLost() {
        return this.request('/items/min-lost');
    },

    getCountByStatus() {
        return this.request('/items/count-by-status');
    },

    getAvgItemsPerUser() {
        return this.request('/items/avg-items-per-user');
    },

    getDistinctReporters() {
        return this.request('/items/distinct-reporters');
    },

    getSumByCategory() {
        return this.request('/items/sum-by-category');
    },

    getInnerJoinClaims() {
        return this.request('/items/inner-join-claims');
    },

    getLeftJoinUsers() {
        return this.request('/items/left-join-users');
    },

    getStatsByMonth(month, year = '') {
        const query = year ? `?year=${year}` : '';
        return this.request(`/items/month/${month}${query}`);
    },

    submitClaim(item_id, message) {
        return this.request('/claims', {
            method: 'POST',
            body: { item_id, message }
        });
    },

    getClaimsForItem(item_id) {
        return this.request(`/claims/item/${item_id}`);
    },

    updateClaimStatus(claim_id, status) {
        return this.request(`/claims/${claim_id}/status`, {
            method: 'PUT',
            body: { status }
        });
    }
};
