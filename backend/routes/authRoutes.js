const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  registerValidator,
  loginValidator,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);

router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get('/admin-only', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
  });
});

module.exports = router;
