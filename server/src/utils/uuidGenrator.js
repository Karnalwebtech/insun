"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
function uuidGenerator() {
    return (0, uuid_1.v4)().slice(0, 8); // ✅ Corrected function call and slicing
}
exports.default = uuidGenerator;
