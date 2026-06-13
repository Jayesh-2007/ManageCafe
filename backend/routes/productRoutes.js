const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  archiveProduct,
} = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  productIdValidator,
  productListValidator,
  createProductValidator,
  updateProductValidator,
} = require('../validators/productValidator');

const router = express.Router();

router.use(authenticate);

router.get('/', productListValidator, validateRequest, getProducts);
router.get('/:id', productIdValidator, validateRequest, getProductById);
router.post(
  '/',
  authorize('admin'),
  createProductValidator,
  validateRequest,
  createProduct
);
router.put(
  '/:id',
  authorize('admin'),
  updateProductValidator,
  validateRequest,
  updateProduct
);
router.delete(
  '/:id',
  authorize('admin'),
  productIdValidator,
  validateRequest,
  archiveProduct
);

module.exports = router;
