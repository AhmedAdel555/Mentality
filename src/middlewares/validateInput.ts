import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import AppError from "../utils/appError";
const validateInput = (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError( `${result.array()[0].msg}`, 400);
    }
    next();
  }catch(error){
    next(error)
  }
};

export default validateInput;
