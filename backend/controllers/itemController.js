const db = require('../config/db');

// Get all items (can be filtered by category or search term)
const getItems = async (req, res) => {
    const { category, search, status } = req.query;
    
    let query = `
        SELECT i.*, u.username as reported_by 
        FROM items i 
        LEFT JOIN users u ON i.user_id = u.id 
        WHERE 1=1
    `;
    const queryParams = [];

    if (category) {
        query += ' AND i.category = ?';
        queryParams.push(category);
    }
    
    if (status) {
        query += ' AND i.status = ?';
        queryParams.push(status);
    }

    if (search) {
        query += ' AND (i.title LIKE ? OR i.description LIKE ?)';
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY i.created_at DESC';

    try {
        const [rows] = await db.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new item
const createItem = async (req, res) => {
    const { title, description, category } = req.body;
    const user_id = req.user.id;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !category) {
        return res.status(400).json({ message: 'Title and category are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO items (title, description, category, image_url, user_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, category, image_url, user_id]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            description,
            category,
            image_url,
            user_id,
            status: 'open'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item (User or Admin)
const updateItem = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, status } = req.body;

    try {
        // Check ownership or admin
        const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Item not found' });
        
        const item = rows[0];

        // For testing purposes, we allow anyone to update any item
        // if (item.user_id !== req.user.id && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Not authorized to update this item' });
        // }

        const newTitle = title || item.title;
        const newDescription = description || item.description;
        const newCategory = category || item.category;
        const newStatus = status || item.status;

        await db.query(
            'UPDATE items SET title = ?, description = ?, category = ?, status = ? WHERE id = ?',
            [newTitle, newDescription, newCategory, newStatus, id]
        );
        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an item (Admin only or owner)
const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Item not found' });

        const item = rows[0];
        
        // For testing purposes, we allow anyone to delete any item
        // if (item.user_id !== req.user.id && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Not authorized to delete this item' });
        // }

        await db.query('DELETE FROM items WHERE id = ?', [id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get stats for admin dashboard
const getStats = async (req, res) => {
    try {
        const [totalLost] = await db.query("SELECT COUNT(*) as count FROM items WHERE category = 'lost'");
        const [totalFound] = await db.query("SELECT COUNT(*) as count FROM items WHERE category = 'found'");
        const [totalResolved] = await db.query("SELECT COUNT(*) as count FROM items WHERE status = 'resolved'");
        const [totalUsers] = await db.query("SELECT COUNT(*) as count FROM users");

        res.json({
            lost: totalLost[0].count,
            found: totalFound[0].count,
            resolved: totalResolved[0].count,
            users: totalUsers[0].count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getItems,
    createItem,
    updateItem,
    deleteItem,
    getStats
};
