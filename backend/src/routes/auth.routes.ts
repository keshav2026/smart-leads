import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect, getMe);

export default router;
