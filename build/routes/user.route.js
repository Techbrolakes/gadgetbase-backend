"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserControllers = __importStar(require("../controllers/user.controller"));
const UserValidations = __importStar(require("../validations/user.validation"));
const ProfileValidations = __importStar(require("../validations/profile.validation"));
const UserProfile = __importStar(require("../controllers/profile.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.post('/register', UserValidations.registerUser, UserControllers.registerUser);
router.post('/resend', UserValidations.resendVerification, UserControllers.resendVerification);
router.post('/login', UserValidations.loginUser, UserControllers.loginUser);
router.post('/recover', UserValidations.recoverPassword, UserControllers.recoverPassword);
router.post('/verify-otp', UserValidations.verifyOTP, UserControllers.verifyOTP);
router.post('/reset-password', UserValidations.resetPassword, UserControllers.resetPassword);
router.get('/get', auth_middleware_1.default, UserProfile.getUserDetails);
router.put('/edit', auth_middleware_1.default, UserProfile.editProfile);
router.post('/reset', auth_middleware_1.default, ProfileValidations.validateResetPassword, UserProfile.resetPassword);
exports.default = router;
