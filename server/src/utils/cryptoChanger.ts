import CryptoJS from "crypto-js";

export async function encryptValue(
  value: string | null | undefined
): Promise<string> {
  if (!value) return "";
  return CryptoJS.AES.encrypt(value, process.env.SECRET_KEY!).toString();
}

export async function decryptValue(
  value: string | null | undefined
): Promise<string> {
  if (!value) return "";
  const bytes = CryptoJS.AES.decrypt(value, process.env.SECRET_KEY!);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function genrateToken(): Promise<string> {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
}
