const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/categoryValidator');

const router = express.Router();

router.use(authenticate);

router.get('/', getCategories);
router.get('/:id', categoryIdValidator, validateRequest, getCategoryById);
router.post(
  '/',
  authorize('admin'),
  createCategoryValidator,
  validateRequest,
  createCategory
);
router.put(
  '/:id',
  authorize('admin'),
  updateCategoryValidator,
  validateRequest,
  updateCategory
);
router.delete(
  '/:id',
  authorize('admin'),
  categoryIdValidator,
  validateRequest,
  deleteCategory
);

module.exports = router;
