import { NextFunction } from "express";
import fileModel from "../model/File.model";
import { IUser } from "../model/user.model";

export interface File_Uploader {
    success: boolean;
    file: string;
    url: string;
}

const addFiles = async (
    data: Express.Multer.File[] | Record<string, Express.Multer.File[]>, 
    file_uploader: unknown[] | File_Uploader[] | void, 
    user: IUser | undefined, 
    next: NextFunction
) => {
    if(!user){
        return null
    }
    try {
        // Ensure file_uploader is an array of File_Uploader objects
        if (!Array.isArray(file_uploader)) {
            file_uploader = [];
        }

        const counter = await fileModel.countDocuments();
        let files_arr: any[] = [];

        // Normalize data into an array of files
        const files = Array.isArray(data) 
            ? data 
            : Object.values(data).flat();

        files_arr = files.map((file, i) => {
            const uploader = (file_uploader as File_Uploader[])[i]; // Type assertion

            return {
                _no: counter + 1 + i,
                fieldname: file.fieldname,
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                path: uploader?.url || "", 
                size: file.size,
                user: user._id,
            };
        });

        if (!files_arr.length) return next(new Error("No files to insert."));

        const addedFiles = await fileModel.insertMany(files_arr);
        return addedFiles;
        
    } catch (error) {
        next(error);
    }
};

export default addFiles;
