const db = require('../config/db');

// POST /api/claims - Submit a claim for an item
const submitClaim = async (req, res) => {
    const { item_id, message } = req.body;
    const user_id = req.user.id;

    if (!item_id || !message) {
        return res.status(400).json({ message: 'Item ID and claim message are required' });
    }

    try {
        // Prevent owner from claiming their own item
        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [item_id]);
        if (!items.length) return res.status(404).json({ message: 'Item not found' });
        if (items[0].user_id === user_id) {
            return res.status(400).json({ message: 'You cannot claim your own item' });
        }
        if (items[0].status === 'resolved') {
            return res.status(400).json({ message: 'This item has already been resolved' });
        }

        // Prevent duplicate claim
        const [existing] = await db.query(
            'SELECT * FROM claims WHERE item_id = ? AND user_id = ?',
            [item_id, user_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already submitted a claim for this item' });
        }

        const [result] = await db.query(
            'INSERT INTO claims (item_id, user_id, message, status) VALUES (?, ?, ?, "pending")',
            [item_id, user_id, message]
        );

        res.status(201).json({ id: result.insertId, message: 'Claim submitted successfully! The owner will review it.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/claims/item/:id - Get all claims for a specific item (owner or admin)
const getClaimsForItem = async (req, res) => {
    const item_id = req.params.id;
    const user_id = req.user.id;
    const role = req.user.role;

    try {
        // Verify user owns this item or is admin
        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [item_id]);
        if (!items.length) return res.status(404).json({ message: 'Item not found' });
        if (items[0].user_id !== user_id && role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view claims for this item' });
        }

        const [claims] = await db.query(`
            SELECT c.id, c.message, c.status, c.created_at,
                   u.username, u.name, u.usn, u.department, u.phone_number
            FROM claims c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.item_id = ?
            ORDER BY c.created_at DESC
        `, [item_id]);

        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/claims/:id/approve - Approve a claim (only owner/admin)
const updateClaimStatus = async (req, res) => {
    const claim_id = req.params.id;
    const { status } = req.body; // 'approved' or 'rejected'
    const user_id = req.user.id;
    const role = req.user.role;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    try {
        // Get claim and its item
        const [claims] = await db.query(`
            SELECT c.*, i.user_id as item_owner_id, i.id as item_id
            FROM claims c
            INNER JOIN items i ON c.item_id = i.id
            WHERE c.id = ?
        `, [claim_id]);

        if (!claims.length) return res.status(404).json({ message: 'Claim not found' });

        const claim = claims[0];
        if (claim.item_owner_id !== user_id && role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this claim' });
        }

        // Update claim status
        await db.query('UPDATE claims SET status = ? WHERE id = ?', [status, claim_id]);

        // If approved, mark item as resolved and reject all other pending claims
        if (status === 'approved') {
            await db.query('UPDATE items SET status = "resolved" WHERE id = ?', [claim.item_id]);
            await db.query(
                'UPDATE claims SET status = "rejected" WHERE item_id = ? AND id != ?',
                [claim.item_id, claim_id]
            );
        }

        res.json({ message: `Claim ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitClaim, getClaimsForItem, updateClaimStatus };
