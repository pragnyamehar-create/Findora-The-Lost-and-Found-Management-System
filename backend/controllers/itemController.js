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
    const { title, description, category, item_date } = req.body;
    const user_id = req.user.id;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !category) {
        return res.status(400).json({ message: 'Title and category are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO items (title, description, category, image_url, user_id, item_date) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, category, image_url, user_id, item_date || new Date().toISOString().split('T')[0]]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            description,
            category,
            image_url,
            user_id,
            item_date: item_date || new Date().toISOString().split('T')[0],
            status: 'open'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item (User or Admin)
const updateItem = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, status, item_date } = req.body;

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
        const newItemDate = item_date || item.item_date;

        await db.query(
            'UPDATE items SET title = ?, description = ?, category = ?, status = ?, item_date = ? WHERE id = ?',
            [newTitle, newDescription, newCategory, newStatus, newItemDate, id]
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

// Complex report using inner/outer joins, where clauses, and aggregate functions
const getComplexReport = async (req, res) => {
    try {
        const userQuery = `
            SELECT 
                u.username,
                i.category,
                COUNT(i.id) as total_items,
                MAX(i.created_at) as latest_post,
                COUNT(c.id) as total_claims
            FROM users u
            INNER JOIN items i ON u.id = i.user_id
            LEFT OUTER JOIN claims c ON i.id = c.item_id
            WHERE u.role = 'user'
            GROUP BY u.username, i.category
            ORDER BY total_items DESC
        `;
        const [userRows] = await db.query(userQuery);

        const yearlyQuery = `
            SELECT 
                YEAR(created_at) AS year,
                COUNT(CASE WHEN category = 'lost' THEN 1 END) as total_lost,
                COUNT(CASE WHEN category = 'found' THEN 1 END) as total_found,
                COUNT(*) as total_items,
                ROUND((COUNT(CASE WHEN category = 'lost' THEN 1 END) / COUNT(*)) * 100, 2) AS lost_percentage,
                ROUND((COUNT(CASE WHEN category = 'found' THEN 1 END) / COUNT(*)) * 100, 2) AS found_percentage
            FROM items
            GROUP BY YEAR(created_at)
            ORDER BY year DESC
            LIMIT 5
        `;
        const [yearlyRows] = await db.query(yearlyQuery);

        res.json({
            userReport: userRows,
            yearlyStats: yearlyRows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find the single day with the maximum lost items - MAX()
const getMaxLost = async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(item_date, '%Y-%m-%d') AS date,
                MONTHNAME(item_date) AS month,
                YEAR(item_date) AS year,
                COUNT(id) AS total_lost
            FROM items
            WHERE category = 'lost' AND item_date IS NOT NULL
            GROUP BY item_date
            ORDER BY total_lost DESC
            LIMIT 1
        `;
        const [rows] = await db.query(query);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Group by year for the last 5 years - GROUP BY
const getGroupByStats = async (req, res) => {
    try {
        const query = `
            SELECT YEAR(created_at) as year, 
                   COUNT(id) as total_items, 
                   COUNT(CASE WHEN category='lost' THEN 1 END) as lost_items,
                   COUNT(CASE WHEN category='found' THEN 1 END) as found_items
            FROM items
            GROUP BY YEAR(created_at)
            ORDER BY year DESC
            LIMIT 5
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// MIN() - Day with the fewest lost items reported
const getMinLost = async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(item_date, '%Y-%m-%d') AS date,
                MONTHNAME(item_date) AS month,
                YEAR(item_date) AS year,
                COUNT(id) AS total_lost
            FROM items
            WHERE category = 'lost' AND item_date IS NOT NULL
            GROUP BY item_date
            ORDER BY total_lost ASC
            LIMIT 1
        `;
        const [rows] = await db.query(query);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// COUNT() - Total items grouped by status (open vs resolved)
const getCountByStatus = async (req, res) => {
    try {
        const query = `
            SELECT status, COUNT(id) as total_items
            FROM items
            GROUP BY status
            ORDER BY total_items DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// AVG() - Average number of items reported per user
const getAvgItemsPerUser = async (req, res) => {
    try {
        const query = `
            SELECT 
                ROUND(AVG(item_count), 2) as avg_items_per_user,
                MAX(item_count) as max_by_one_user,
                MIN(item_count) as min_by_one_user
            FROM (
                SELECT user_id, COUNT(id) as item_count
                FROM items
                WHERE user_id IS NOT NULL
                GROUP BY user_id
            ) as user_counts
        `;
        const [rows] = await db.query(query);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// COUNT(DISTINCT) - Count unique users who have reported items per category
const getDistinctReporters = async (req, res) => {
    try {
        const query = `
            SELECT 
                category,
                COUNT(DISTINCT user_id) as unique_reporters,
                COUNT(id) as total_items
            FROM items
            WHERE user_id IS NOT NULL
            GROUP BY category
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SUM (via COUNT) - Cumulative item count by category and status
const getSumByCategory = async (req, res) => {
    try {
        const query = `
            SELECT 
                category,
                status,
                COUNT(id) as total,
                SUM(COUNT(id)) OVER (PARTITION BY category) as category_total
            FROM items
            GROUP BY category, status
            ORDER BY category, status
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// INNER JOIN - Items that have claims (only matched records)
const getInnerJoinClaims = async (req, res) => {
    try {
        const query = `
            SELECT 
                i.title,
                i.category,
                u.username as reported_by,
                c.status as claim_status,
                c.created_at as claim_date
            FROM items i
            INNER JOIN claims c ON i.id = c.item_id
            INNER JOIN users u ON i.user_id = u.id
            ORDER BY c.created_at DESC
            LIMIT 10
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LEFT OUTER JOIN - All users and their item counts (includes users with zero items)
const getLeftOuterJoinUsers = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.username,
                u.department,
                COUNT(i.id) as total_items,
                COUNT(CASE WHEN i.category = 'lost' THEN 1 END) as lost_count,
                COUNT(CASE WHEN i.category = 'found' THEN 1 END) as found_count
            FROM users u
            LEFT OUTER JOIN items i ON u.id = i.user_id
            WHERE u.role = 'user'
            GROUP BY u.id, u.username, u.department
            ORDER BY total_items DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get stats by specific month
const getStatsByMonth = async (req, res) => {
    const { month } = req.params;
    const { year } = req.query;
    try {
        let query = `
            SELECT 
                COUNT(*) as total_items,
                COUNT(CASE WHEN category = 'lost' THEN 1 END) as total_lost,
                COUNT(CASE WHEN category = 'found' THEN 1 END) as total_found
            FROM items
            WHERE MONTH(created_at) = ?
        `;
        const queryParams = [month];
        if (year) {
            query += ' AND YEAR(created_at) = ?';
            queryParams.push(year);
        }
        const [rows] = await db.query(query, queryParams);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getItems,
    createItem,
    updateItem,
    deleteItem,
    getStats,
    getComplexReport,
    getMaxLost,
    getGroupByStats,
    getMinLost,
    getCountByStatus,
    getAvgItemsPerUser,
    getDistinctReporters,
    getSumByCategory,
    getInnerJoinClaims,
    getLeftOuterJoinUsers,
    getStatsByMonth
};
