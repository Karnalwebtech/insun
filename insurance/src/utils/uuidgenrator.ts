import { v4 as uuidv4 } from "uuid";
export default function genrateUUID(): string {
  const uuid: string = uuidv4();
  return uuid.replace(/-/g, "").slice(0, 8);
}
