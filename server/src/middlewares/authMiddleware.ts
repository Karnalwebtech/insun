import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import {  IUser, User } from "../model/user.model";
import { decryptValue } from "../utils/cryptoChanger";
declare global {
    namespace Express {
      interface Request {
        user?: IUser;
      }
    }
  }

export const isAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    const authorization: string | undefined = req.headers.authorization?.split(" ")[1] || "";
    if (!authorization) {
        return next(new ErrorHandler("Please log in first", 400));
    }
    try {
        const token = await decryptValue(authorization)
        const user = await User.findOne({ "email": token })
        if (!user) {
            return next(new ErrorHandler("You are not authorization", 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new ErrorHandler(`Invalid token. Please log in again. ${error}`, 401));
    }
}

export const secureApi = async (req: Request, res: Response, next: NextFunction) => {
  const apikey: string = (req.headers["x-api-key"] as string) || "";

  try {
      const decodeapikey = await decryptValue(apikey)
      if (decodeapikey !== process.env.API_KEY!) {
          return next(new ErrorHandler("Api key is not valid", 404));
      }
      next();
  }
  catch (error) {
      return next(new ErrorHandler(`Invalid token. Please log in again. ${error}`, 401));
  }
}
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
              new ErrorHandler(
                `Role: ${req.user?.role} is not allowed to access this resource`,
                403
              )
            );
          }
        next();
    }
}



