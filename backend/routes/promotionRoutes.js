const express = require('express');
const {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotionCoupon,
} = require('../controllers/promotionController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  promotionIdValidator,
  createPromotionValidator,
  updatePromotionValidator,
  validateCouponValidator,
} = require('../validators/promotionValidator');

const router = express.Router();

router.use(authenticate);

router.get('/', getPromotions);
router.get('/:id', promotionIdValidator, validateRequest, getPromotionById);
router.post('/validate', validateCouponValidator, validateRequest, validatePromotionCoupon);
router.post(
  '/',
  authorize('admin'),
  createPromotionValidator,
  validateRequest,
  createPromotion
);
router.put(
  '/:id',
  authorize('admin'),
  updatePromotionValidator,
  validateRequest,
  updatePromotion
);
router.delete(
  '/:id',
  authorize('admin'),
  promotionIdValidator,
  validateRequest,
  deletePromotion
);

module.exports = router;
