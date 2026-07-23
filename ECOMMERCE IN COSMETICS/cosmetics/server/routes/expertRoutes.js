import express from 'express';
import { getAssignedClients, buildExpertCart } from '../controllers/expertController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/clients', protect, authorize(['expert', 'admin']), getAssignedClients);
router.post('/build-cart', protect, authorize(['expert', 'admin']), buildExpertCart);

export default router;
