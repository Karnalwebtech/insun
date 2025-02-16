"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_1 = __importDefault(require("./middlewares/error"));
// import { Request } from "express";
// import rateLimit from "express-rate-limit";
// import helmet from "helmet";
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "cookies",
        "X-CSRF-Token",
        "x-api-key",
    ],
    credentials: true,
    maxAge: 600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
// app.set("trust proxy", 1);
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Max 100 requests per IP per window
//     message: "Too many requests, please try again later.",
//     headers: true, // Sends rate limit headers
//     skip: (req) => req.ip === "192.168.1.1", // Skip for admin IP
//     keyGenerator: async (req: Request): Promise<string> => {
//         // let clientIp = req.ip === "::1" ? "127.0.0.1" : req.ip;
//         // console.log(clientIp);
//         const userKey = await getUserKeyFromDB(req.headers["x-api-key"] as string);
//         return userKey || req.ip || "unknown"; // Ensure it returns a string
//       },
//     // store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) }),
// })
// app.use(limiter); // Apply to all routes
// app.use(
//     helmet({
//       contentSecurityPolicy: false, // Disables CSP (enable if needed)
//       crossOriginEmbedderPolicy: true, // Prevents cross-origin resources from being embedded
//       crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Allows popups to open in the same browsing context
//       crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows resources to be shared across origins
//       dnsPrefetchControl: { allow: false }, // Prevents DNS prefetching
//       frameguard: { action: "deny" }, // Blocks iframes completely (Clickjacking protection)
//       hidePoweredBy: true, // Removes "X-Powered-By" header for security
//       hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Enforces HTTPS
//       ieNoOpen: true, // Blocks IE from executing downloads
//       noSniff: true, // Prevents MIME type sniffing
//       originAgentCluster: true, // Enables better memory isolation
//       permittedCrossDomainPolicies: { permittedPolicies: "none" }, // Prevents Flash & PDF cross-domain access
//       referrerPolicy: { policy: "no-referrer-when-downgrade" }, // Restricts referrer information
//       xssFilter: true, // Helps prevent reflected XSS attacks (deprecated but still useful)
//     })
//   );
// async function getUserKeyFromDB(apiKey: string): Promise<string> {
//     // Simulate a database lookup
//     return apiKey ? `user-${apiKey}` : "default-user";
//   }
const customer_route_1 = __importDefault(require("./routes/customer-route"));
const auth_route_1 = __importDefault(require("./routes/auth-route"));
app.use("/api/v1", customer_route_1.default);
app.use("/api/v1", auth_route_1.default);
app.use(error_1.default);
exports.default = app;
