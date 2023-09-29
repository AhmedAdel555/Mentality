import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
const validateResult = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    if (req.file) {
      let filePath = req.file.path;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        }
      });
    }
    return res
      .status(400)
      .json({ status: "error", message: `${result.array()[0].msg}` });
  }
  next();
};

export default validateResult;
