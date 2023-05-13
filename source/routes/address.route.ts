import express from 'express';
import auth from '../middlewares/auth.middleware';
import * as AddressControllers from '../controllers/address.controller';
import * as AddressValidations from '../validations/address.validation';
import exp from 'constants';

const router = express.Router();

// Address based routes
router.post('/create-address', auth, AddressValidations.createAddress, AddressControllers.createAddress);
router.get('/get-addresses', auth, AddressControllers.getUserAddresses);
router.put('/update-address/:address_id', auth, AddressControllers.updateAddress);

export default router;
