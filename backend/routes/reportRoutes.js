const express = require('express');
const {
  getSummary,
  getSalesTrend,
  getTopProducts,
  getTopCategories,
  exportReport,
} = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  reportDateValidator,
  exportReportValidator,
} = require('../validators/reportValidator');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/summary', reportDateValidator, validateRequest, getSummary);
router.get('/sales-trend', reportDateValidator, validateRequest, getSalesTrend);
router.get('/top-products', reportDateValidator, validateRequest, getTopProducts);
router.get(
  '/top-categories',
  reportDateValidator,
  validateRequest,
  getTopCategories
);
router.get('/export', exportReportValidator, validateRequest, exportReport);

module.exports = router;
