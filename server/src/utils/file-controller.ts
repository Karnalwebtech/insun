import { NextFunction } from "express";
import fileModel from "../model/File.model";
import { IUser } from "../model/user.model";

export interface File_Uploader {
    success: boolean;
    file: string;
    url: string;
    signature: string,
    bytes: number,
    asset_folder: string,
    fieldname: string,
    originalname: string,
    publicId: string,
    format: string,
    width: number,
    height: number
}

const addFiles = async (
    file_uploader: unknown[] | File_Uploader[] | void,
    user: IUser | undefined,
    next: NextFunction
) => {
    if (!user) {
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
        const files = Array.isArray(file_uploader)
            ? file_uploader
            : Object.values(file_uploader).flat();

        files_arr = files.map((file, i) => {
            const uploader = (file_uploader as File_Uploader[])[i]; // Type assertion

            return {
                _no: counter + 1 + i,
                fieldname: uploader.fieldname,
                publicId: uploader.publicId,
                signature: uploader.signature,
                originalname: uploader.originalname,
                size: uploader.bytes,
                format: uploader.format,
                destination: uploader.asset_folder,
                filename: uploader.originalname,
                path: uploader?.url || "",
                width: uploader?.width,
                height: uploader?.height || "",
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
