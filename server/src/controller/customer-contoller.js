"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerDetails = exports.removeCustomer = exports.allCustomers = exports.addCustomerController = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const file_handler_1 = __importDefault(require("../service/file-handler"));
const customer_model_1 = __importDefault(require("../model/customer.model"));
const uuidGenrator_1 = __importDefault(require("../utils/uuidGenrator"));
const apiFeatuers_1 = __importDefault(require("../utils/apiFeatuers"));
const addCustomerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        const filedata = yield (0, file_handler_1.default)(req, next);
        if (!filedata || typeof filedata !== "object") {
            return next(new errorHandler_1.default("File upload failed.", 400));
        }
        const { fullname, policy_no, phone, dop, dor, issue_policy_year, si, amount, email, category, healthConditions } = req.body;
        const counter = yield customer_model_1.default.countDocuments();
        const customer = yield customer_model_1.default.create({
            no: counter + 1,
            id: `cust_${(0, uuidGenrator_1.default)()}_${counter}`,
            addhar_card: filedata.addharCard,
            pan_card: filedata.addharCard,
            document: filedata.addharCard,
            profile_image: filedata.addharCard,
            user: user._id,
            fullname, policy_no, phone, dop, dor, issue_policy_year, si, amount, email, category, health_conditions: healthConditions
        });
        res.status(201).json({
            success: true,
            message: "Customer added successfully",
        });
    }
    catch (err) {
        next(new errorHandler_1.default(`Server error: ${err}`, 500)); // Pass error to middleware
    }
});
exports.addCustomerController = addCustomerController;
const allCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = req.query;
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Initialize ApiFeatures without pagination
        const apifeature = new apiFeatuers_1.default(customer_model_1.default.find({ is_active: true, user }), query);
        apifeature.search().filter();
        // Get the count of filtered results (without pagination)
        const datacounter = yield apifeature.getQuery().length;
        // Apply pagination after getting the count
        apifeature.pagination(parseInt(query.rowsPerPage, 10) || 10);
        // Fetch filtered and paginated results
        const result = yield apifeature.getQuery()
            .populate([
            { path: "user", model: "User" },
            { path: "addhar_card", model: "File" },
            { path: "pan_card", model: "File" },
            { path: "document", model: "File" },
            { path: "profile_image", model: "File" },
        ])
            .sort({ _id: -1 })
            .exec();
        res.status(200).json({
            success: true,
            result,
            dataCounter: datacounter, // Correct count of filtered/search results
        });
    }
    catch (err) {
        next(new errorHandler_1.default(`Server error: ${err instanceof Error ? err.message : "Unknown error"}`, 500));
    }
});
exports.allCustomers = allCustomers;
const removeCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield customer_model_1.default.findOne({ id });
        if (!result) {
            return next(new errorHandler_1.default("Customer id not found", 404));
        }
        result.is_active = false;
        yield result.save();
        console.log(result);
        res.status(200).json({
            success: true,
            message: `${result.id} succesfuly removed`
        });
    }
    catch (err) {
        next(new errorHandler_1.default(`Server error: ${err instanceof Error ? err.message : "Unknown error"}`, 500));
    }
});
exports.removeCustomer = removeCustomer;
const customerDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new errorHandler_1.default("Not found any valid id", 404));
        }
        const result = yield customer_model_1.default.findOne({ id }).populate([
            { path: "user", model: "User" },
            { path: "addhar_card", model: "File" },
            { path: "pan_card", model: "File" },
            { path: "document", model: "File" },
            { path: "profile_image", model: "File" },
        ]);
        if (!result) {
            return next(new errorHandler_1.default("Customer not found", 404));
        }
        res.status(200).json({
            success: true,
            result,
        });
    }
    catch (err) {
        next(new errorHandler_1.default(`Server error: ${err instanceof Error ? err.message : "Unknown error"}`, 500));
    }
});
exports.customerDetails = customerDetails;
