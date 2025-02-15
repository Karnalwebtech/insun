import { IUser } from "../../model/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Making 'user' optional to prevent errors
    }
  }
}

