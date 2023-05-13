import express from 'express';
import auth from '../middlewares/auth.middleware';
import * as AddressControllers from '../controllers/address.controller';
import * as AddressValidations from '../validations/address.validation';

const router = express.Router();

// Address based routes
router.post('/create-address', auth, AddressValidations.createAddress, AddressControllers.createAddress);
router.get('/get-addresses', auth, AddressControllers.getUserAddresses);
router.get('/get-address/:address_id', auth, AddressControllers.getAddress);
router.get('/get-default-address', auth, AddressControllers.getUserDefaultAddress);
router.put('/make-address-default/:address_id', auth, AddressControllers.makeAddressDefault);
router.put('/update-address/:address_id', auth, AddressControllers.updateAddress);
router.delete('/delete-address/:address_id', auth, AddressControllers.deleteAddress);

export default router;
