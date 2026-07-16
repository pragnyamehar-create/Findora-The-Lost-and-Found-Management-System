const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getItems, createItem, updateItem, deleteItem, getStats, getComplexReport, getMaxLost, getGroupByStats, getMinLost, getCountByStatus, getAvgItemsPerUser, getDistinctReporters, getSumByCategory, getInnerJoinClaims, getLeftOuterJoinUsers, getStatsByMonth } = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

router.route('/')
    .get(getItems)
    .post(protect, upload.single('image'), createItem);

router.route('/stats')
    .get(protect, admin, getStats);

router.route('/complex-report')
    .get(protect, admin, getComplexReport);

router.route('/max-lost')
    .get(protect, admin, getMaxLost);

router.route('/groupby-stats')
    .get(protect, admin, getGroupByStats);

router.route('/min-lost')
    .get(protect, admin, getMinLost);

router.route('/count-by-status')
    .get(protect, admin, getCountByStatus);

router.route('/avg-items-per-user')
    .get(protect, admin, getAvgItemsPerUser);

router.route('/distinct-reporters')
    .get(protect, admin, getDistinctReporters);

router.route('/sum-by-category')
    .get(protect, admin, getSumByCategory);

router.route('/inner-join-claims')
    .get(protect, admin, getInnerJoinClaims);

router.route('/left-join-users')
    .get(protect, admin, getLeftOuterJoinUsers);

router.route('/month/:month')
    .get(protect, admin, getStatsByMonth);

router.route('/:id')
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
