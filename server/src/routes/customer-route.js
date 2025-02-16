"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_contoller_1 = require("../controller/customer-contoller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/add-customer', authMiddleware_1.secureApi, authMiddleware_1.isAuthenticatedUser, (0, authMiddleware_1.authorizeRoles)("admin"), multer_1.default.fields([
    { name: "addharCard", maxCount: 5 },
    { name: "panCard", maxCount: 5 },
    { name: "document", maxCount: 5 },
    { name: "profileImage", maxCount: 1 }
]), customer_contoller_1.addCustomerController);
router.get('/all-customer', authMiddleware_1.secureApi, authMiddleware_1.isAuthenticatedUser, (0, authMiddleware_1.authorizeRoles)("admin"), customer_contoller_1.allCustomers);
router.delete('/action/:id', authMiddleware_1.secureApi, authMiddleware_1.isAuthenticatedUser, (0, authMiddleware_1.authorizeRoles)("admin"), customer_contoller_1.removeCustomer);
router.get('/action/:id', authMiddleware_1.secureApi, authMiddleware_1.isAuthenticatedUser, (0, authMiddleware_1.authorizeRoles)("admin"), customer_contoller_1.customerDetails);
exports.default = router;
