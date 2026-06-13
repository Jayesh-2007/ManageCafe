const express = require('express');
const {
  getKdsOrders,
  getKdsOrderById,
  getKdsStats,
  updateKdsStatus,
} = require('../controllers/kdsController');
const { authenticate } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  kdsIdValidator,
  kdsListValidator,
  updateKdsStatusValidator,
} = require('../validators/kdsValidator');

const router = express.Router();

router.use(authenticate);

router.get('/', kdsListValidator, validateRequest, getKdsOrders);
router.get('/stats', getKdsStats);
router.get('/:id', kdsIdValidator, validateRequest, getKdsOrderById);
router.put(
  '/:id/status',
  updateKdsStatusValidator,
  validateRequest,
  updateKdsStatus
);

module.exports = router;
