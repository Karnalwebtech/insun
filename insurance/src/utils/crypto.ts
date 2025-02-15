import CryptoJS from "crypto-js";


export function encryptValue(value: string | null | undefined): string {
    if(!value) return ""
    return CryptoJS.AES.encrypt(value, process.env.NEXT_PUBLIC_SECRET_KEY!).toString();
}

export function decryptValue(value: string | null | undefined): string {
     if(!value) return ""
    const bytes = CryptoJS.AES.decrypt(value, process.env.NEXT_PUBLIC_SECRET_KEY!);
    return bytes.toString(CryptoJS.enc.Utf8);
}
