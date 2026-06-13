const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  sendToKitchen,
  payOrder,
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  orderIdValidator,
  orderListValidator,
  createOrderValidator,
  updateOrderValidator,
  payOrderValidator,
} = require('../validators/orderValidator');

const router = express.Router();

router.use(authenticate);

router.get('/', orderListValidator, validateRequest, getOrders);
router.get('/:id', orderIdValidator, validateRequest, getOrderById);
router.post('/', createOrderValidator, validateRequest, createOrder);
router.put('/:id', updateOrderValidator, validateRequest, updateOrder);
router.delete('/:id', orderIdValidator, validateRequest, deleteOrder);
router.post(
  '/:id/send-to-kitchen',
  orderIdValidator,
  validateRequest,
  sendToKitchen
);
router.post('/:id/pay', payOrderValidator, validateRequest, payOrder);

module.exports = router;
