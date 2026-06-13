const express = require('express');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { authenticate } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  customerIdValidator,
  customerListValidator,
  createCustomerValidator,
  updateCustomerValidator,
} = require('../validators/customerValidator');

const router = express.Router();

router.use(authenticate);

router.get('/', customerListValidator, validateRequest, getCustomers);
router.get('/:id', customerIdValidator, validateRequest, getCustomerById);
router.post('/', createCustomerValidator, validateRequest, createCustomer);
router.put('/:id', updateCustomerValidator, validateRequest, updateCustomer);
router.delete('/:id', customerIdValidator, validateRequest, deleteCustomer);

module.exports = router;
