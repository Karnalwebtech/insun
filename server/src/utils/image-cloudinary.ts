import { NextFunction } from "express";
import ErrorHandler from "./errorHandler";
import { getFirebaseInstance } from "../config/firebase";
import { generateRandomId } from "./generateRandomId";
import { File_Uploader } from "./file-controller";

const ImageUploader = async (files:Express.Multer.File[], next: NextFunction):Promise<File_Uploader[] | unknown[] | void> => {
    if (!files || !Array.isArray(files) || files.length === 0) {
        return next(new ErrorHandler("No files uploaded.", 400));
    }
   
    try {





//         import express from "express";
// import cloudinary from "../config/cloudinary.js";
// import upload from "../middlewares/multer.js";
// import Image from "../models/Image.js";

// const router = express.Router();

// // Upload Image to Cloudinary and Save to DB
// router.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload_stream(
//       { folder: "uploads" }, // Optional: Store inside a folder
//       async (error, result) => {
//         if (error) return res.status(500).json({ error: error.message });

//         // Save URL & public_id to MongoDB
//         const newImage = new Image({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });

//         await newImage.save();

//         res.status(201).json({ message: "Image uploaded", image: newImage });
//       }
//     );

//     result.end(req.file.buffer); // Convert file to stream

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

        // return await Promise.all(uploadPromises);
    } catch (error: any) {
        console.error("Upload Error:", error); // Log the error
        return next(new ErrorHandler(error.message, 500));
    }

}
export default ImageUploader;