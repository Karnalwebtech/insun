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
const file_controller_1 = __importDefault(require("../utils/file-controller"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const image_uploader_1 = __importDefault(require("../utils/image-uploader"));
const fileHandler = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const files = req.files;
        let processedFiles = [];
        if (Array.isArray(files)) {
            processedFiles = files;
        }
        else if (typeof files === "object") {
            processedFiles = Object.values(files).flat();
        }
        const uploadedImage = yield (0, image_uploader_1.default)(processedFiles, next);
        if (!uploadedImage) {
            return next(new errorHandler_1.default("Image upload failed on the server", 404));
        }
        const imageData = yield (0, file_controller_1.default)(processedFiles, uploadedImage, user, next);
        if (!imageData) {
            return next(new errorHandler_1.default("Image not added to database", 404));
        }
        return imageData.reduce((acc, { fieldname, _id }) => {
            acc[fieldname] = _id;
            return acc;
        }, {});
    }
    catch (err) {
        return next(new errorHandler_1.default(`Server error ${err}`, 404));
    }
});
exports.default = fileHandler;
