import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import config from "../utils/envConfig";

const validateAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const bearer = authHeader.split(" ")[0].toLowerCase();
      const token = authHeader.split(" ")[1];
      if (token && bearer === "bearer") {
        const decode: any = Jwt.verify(token, config.SECRETJWTKEY as string);
        if (decode) {
          req.body.userId = decode.id;
          req.body.userRole = decode.role;
          next();
        } else {
          throw new Error("Opps error , please sign in");
        }
      } else {
        throw new Error("Opps error , please sign in");
      }
    } else {
      throw new Error("Opps error , please sign in");
    }
  } catch (error) {
    next(error);
  }
};

export default validateAuth;
