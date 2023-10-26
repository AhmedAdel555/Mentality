import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  try{
    if (!req.file) {
      throw new AppError( "no file uploaded", 404);
    }
    next();
  }catch(error){
    next(error);
  }
};

export default validateFileUpload;