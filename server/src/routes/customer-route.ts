import { Router } from "express";
import { addCustomerController, allCustomers, customerDetails, removeCustomer } from "../controller/customer-contoller";
import upload from "../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser, secureApi } from "../middlewares/authMiddleware";
const router = Router();

router.post('/add-customer', secureApi, isAuthenticatedUser, authorizeRoles("admin"), upload.fields([
    { name: "addharCard", maxCount: 5 },
    { name: "panCard", maxCount: 5 },
    { name: "document", maxCount: 5 },
    { name: "profileImage", maxCount: 1 }
]), addCustomerController)

router.get('/all-customer',
    secureApi, isAuthenticatedUser, authorizeRoles("admin"),
    allCustomers)
router.delete('/action/:id',
    secureApi, isAuthenticatedUser, authorizeRoles("admin"),
    removeCustomer)
router.get('/action/:id',
    secureApi, isAuthenticatedUser, authorizeRoles("admin"),
    customerDetails)


export default router;