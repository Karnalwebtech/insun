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
const File_model_1 = __importDefault(require("../model/File.model"));
const addFiles = (data, file_uploader, user, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user) {
        return null;
    }
    try {
        // Ensure file_uploader is an array of File_Uploader objects
        if (!Array.isArray(file_uploader)) {
            file_uploader = [];
        }
        const counter = yield File_model_1.default.countDocuments();
        let files_arr = [];
        // Normalize data into an array of files
        const files = Array.isArray(data)
            ? data
            : Object.values(data).flat();
        files_arr = files.map((file, i) => {
            const uploader = file_uploader[i]; // Type assertion
            return {
                _no: counter + 1 + i,
                fieldname: file.fieldname,
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                path: (uploader === null || uploader === void 0 ? void 0 : uploader.url) || "",
                size: file.size,
                user: user._id,
            };
        });
        if (!files_arr.length)
            return next(new Error("No files to insert."));
        const addedFiles = yield File_model_1.default.insertMany(files_arr);
        return addedFiles;
    }
    catch (error) {
        next(error);
    }
});
exports.default = addFiles;
