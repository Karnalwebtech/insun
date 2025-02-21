import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import fileHandler from "../service/file-handler";
import CustomerModel from "../model/customer.model";
import uuidGenerator from "../utils/uuidGenrator";
import { IUser } from "../model/user.model";
import ApiFeatures from "../utils/apiFeatuers";

export const addCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser | undefined = req.user;
        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }
        const filedata = await fileHandler(req, next)
        if (!filedata || typeof filedata !== "object") {
            return next(new ErrorHandler("File upload failed.", 400));
        }
        const { fullname, policy_no, phone, dop, dor, issue_policy_year, si, amount, email, category, healthConditions } = req.body;
        const counter = await CustomerModel.countDocuments();
        const customer = await CustomerModel.create({
            no: counter + 1,
            id: `cust_${uuidGenerator()}_${counter}`,
            addhar_card: filedata.addharCard,
            pan_card: filedata.addharCard,
            document: filedata.addharCard,
            profile_image: filedata.addharCard,
            user: user._id,
            fullname, policy_no, phone, dop, dor, issue_policy_year, si, amount, email, category, health_conditions: healthConditions
        })
        res.status(201).json({
            success: true,
            message: "Customer added successfully",
        });
    } catch (err) {
        next(new ErrorHandler(`Server error: ${err}`, 500)); // Pass error to middleware
    }
};

export const allCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const user = req.user?._id;
        // Initialize ApiFeatures without pagination
        const apifeature = new ApiFeatures(CustomerModel.find({ is_active: true, user }), query);
        apifeature.search().filter();

        // Get the count of filtered results (without pagination)
        const datacounter = await apifeature.getQuery().length;

        // Apply pagination after getting the count
        apifeature.pagination(parseInt(query.rowsPerPage as string, 10) || 10);

        // Fetch filtered and paginated results
        const result = await apifeature.getQuery()
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
            dataCounter: datacounter,  // Correct count of filtered/search results
        });
    } catch (err) {
        next(new ErrorHandler(`Server error: ${err instanceof Error ? err.message : "Unknown error"}`, 500));
    }
};

export const removeCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await CustomerModel.findOne({ id })
        if (!result) {
            return next(new ErrorHandler("Customer id not found", 404));
        }
        result.is_active = false;
        await result.save();
        console.log(result)
        res.status(200).json({
            success: true,
            message: `${result.id} succesfuly removed`
        });
    }
    catch (err) {
        next(new ErrorHandler(`Server error: ${err instanceof Error ? err.message : "Unknown error"}`, 500));

    }
}

export const customerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler("Not found any valid id", 404))
        }
        const result = await CustomerModel.findOne({ id }).populate([
            { path: "user", model: "User" },
            { path: "addhar_card", model: "File" },
            { path: "pan_card", model: "File" },
            { path: "document", model: "File" },
            { path: "profile_image", model: "File" },
        ]);
        if (!result) {
            return next(new ErrorHandler("Customer not found", 404))
        }
        res.status(200).json({
            success: true,
            result,
        })

    }
    catch (err) {
        next(new ErrorHandler(`Server error: ${err instanceof Error ? err.message : "Unknown error"}`, 500));
    }
}