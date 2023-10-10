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
          req.body.user_pricing_plan_id = decode.pricing_plan_id
          next();
        } else {
          throw new AppError("Opps error , please sign in", 403);
        }
      } else {
        throw new AppError("Opps error , please sign in", 403);
      }
    } else {
      throw new AppError("Opps error , please sign in", 403);
    }
  } catch (error) {
    next(error);
  }
};

export default validateAuth;
