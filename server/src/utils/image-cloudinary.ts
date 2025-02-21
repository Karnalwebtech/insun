import type { NextFunction, Express } from "express"
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary"
import ErrorHandler from "./errorHandler"
import cloudinary from "../config/cloudinary"
export interface UploadedFile {
    url: string
    signature: string
    resource_type: string
    bytes: number
    asset_folder: string
    publicId: string
    format: string
    width: number
    height: number
    fieldname: string
    originalname: string
}

export interface UploadOptions {
    folder: string
    allowed_formats?: string[]
    transformation?: any[]
}



const defaultOptions: UploadOptions = {
    folder: "uploads",
    allowed_formats: [
        "jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "svg", // Image formats
        "pdf" // PDF format
    ],
    transformation: [{ quality: "auto" }],
}

const uploadToCloudinary = (
    file: Express.Multer.File,
    options: UploadOptions = defaultOptions,
): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error || !result) {
                    reject(new ErrorHandler(`Failed to upload image: ${error?.message || "Unknown error"}`, 500))
                    return
                }
                resolve({
                    signature: result.signature,
                    resource_type: result.resource_type,
                    bytes: result.bytes,
                    asset_folder: result.asset_folder,
                    fieldname: file.fieldname,
                    originalname: file.originalname,
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                })
            },
        )

        uploadStream.end(file.buffer)
    })
}

const ImageUploader = async (
    files: Express.Multer.File[],
    next: NextFunction,
    options?: UploadOptions,
): Promise<UploadedFile[]> => {
    // Validate input
    if (!files?.length) {
        throw new ErrorHandler("No files provided for upload", 400)
    }

    try {
        // Process files in parallel
        const uploadPromises = files.map((file) => uploadToCloudinary(file, options))
        const uploadedFiles = await Promise.all(uploadPromises)
        return uploadedFiles
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown upload error"
        throw new ErrorHandler(message, 500)
    }
}

export default ImageUploader

