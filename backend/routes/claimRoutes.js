const express = require('express');
const router = express.Router();
const { submitClaim, getClaimsForItem, updateClaimStatus } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

// Submit a claim for an item
router.route('/').post(protect, submitClaim);

// Get all claims for a specific item (owner or admin)
router.route('/item/:id').get(protect, getClaimsForItem);

// Approve or reject a claim
router.route('/:id/status').put(protect, updateClaimStatus);

module.exports = router;
