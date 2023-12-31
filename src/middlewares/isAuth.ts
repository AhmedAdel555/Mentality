import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import config from "../utils/envConfig";
import AppError from "../utils/appError";

const validateAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const bearer = authHeader.split(" ")[0].toLowerCase();
      const token = authHeader.split(" ")[1];
      if (token && bearer === "bearer") {
        const decode: any = Jwt.verify(token, config.SECRETJWTKEY as string);
        if (decode) {
          req.body.user_id = decode.id;
          req.body.user_role = decode.role;
          next();
        } else {
          throw new AppError("Opps , please sign in", 401);
        }
      } else {
        throw new AppError("Opps , please sign in", 401);
      }
    } else {
      throw new AppError("Opps , please sign in", 401);
    }
  } catch (error) {
    next(error);
  }
};

export default validateAuth;
