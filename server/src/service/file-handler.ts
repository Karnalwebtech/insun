import { NextFunction, Request } from "express";
import addFiles, { File_Uploader } from "../utils/file-controller";
import ErrorHandler from "../utils/errorHandler";
import { IUser } from "../model/user.model";
import ImageUploader from "../utils/image-cloudinary";
const fileHandler = async (req: Request, next: NextFunction): Promise<Record<string, any> | void>  => {
    try {
        const user: IUser | undefined = req.user;
        const files = req.files;
        let processedFiles: Express.Multer.File[] = [];
        if (Array.isArray(files)) {
            processedFiles = files;
        } else if (typeof files === "object") {
            processedFiles = Object.values(files).flat();
        }
        const uploadedImage: File_Uploader[] | void | unknown[] = await ImageUploader(processedFiles, next);
        if (!uploadedImage) {
            return next(new ErrorHandler("Image upload failed on the server", 404));
        }
        const imageData = await addFiles(
            uploadedImage,
            user,
            next,
        );
        if (!imageData) {
            return next(new ErrorHandler("Image not added to database", 404));
        }
        return imageData.reduce((acc, { fieldname, _id }) => {
            acc[fieldname] = _id; 
            return acc;
        }, {} as Record<string, any>);


    } catch (err) {
        return next(new ErrorHandler(`Server error ${err}`, 404));

    }
}
export default fileHandler