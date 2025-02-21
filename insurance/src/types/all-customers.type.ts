export interface SearchableItem {
    id: number | string;
    [key: string]: unknown; // Allows dynamic key-value pairs
}

export interface CustomerProps extends SearchableItem {
    _id: string;
    no: number;
    id: string;
    fullname: string;
    policy_no: string;
    phone: number;
    dop: string;
    dor: string;
    issue_policy_year: string;
    si: number;
    amount: number;
    email: string;
    category: string;
    premium_mode: string;
    addhar_card: DocumentInfo;
    pan_card: DocumentInfo;
    document: DocumentInfo;
    profile_image: DocumentInfo;
    user: User;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface DocumentInfo {
    _id: string;
    no: number;
    originalname: string;
    url: string;
    encoding: string;
    filename: string | null;
    fieldname: string;
    path: string;
    size: number;
    altText: string | null;
    title: string | null;
    caption: string | null;
    user: string;
    is_active: boolean;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    preferences: Preferences;
    _id: string;
    userId: string;
    name: string;
    email: string;
    password: string;
    provider: string;
    image: string | null;
    isVerified: boolean;
    verifyToken: string;
    verifyTokenExpiry: string;
    role: string;
    dashboard: string;
    is2FAEnabled: boolean;
    permissions: string[];
    isProfileComplete: boolean;
    activityLog: Record<string, unknown>[];  // Replaces any[]
    isAccountLocked: boolean;
    socialMediaProfiles: Record<string, unknown>[];  // Replaces any[]
    securityQuestions: Record<string, unknown>[];  // Replaces any[]
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Preferences {
    language: string;
    notifications: boolean;
}

export interface ApiResponse {
    success: boolean;
    message?:string;
    result: CustomerProps[];
    dataCounter: number;
    resultPerPage: number;
}
export interface DetailsResponse {
    success: boolean;
    message?:string;
    result: CustomerProps;
}