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

    register(username, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: { username, password }
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
    }
};
