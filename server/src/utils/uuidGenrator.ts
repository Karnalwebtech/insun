import { v4 as uuidv4 } from "uuid";

function uuidGenerator(): string {
    return uuidv4().slice(0, 8); // ✅ Corrected function call and slicing
}
export default uuidGenerator;

