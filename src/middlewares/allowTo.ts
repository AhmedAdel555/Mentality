import {NextFunction, Request, Response} from "express";
import Roles from "../utils/roles.enum";
import AppError from "../utils/appError";

const allowTo = (...roles: Roles[])=>{
    return (req: Request, _res:Response, next:NextFunction)=>{
      try{
        if(!roles.includes(req.body.userRole)){
          throw new AppError("you don't have a permision to do this", 403);
        }
        next()
      }catch(err){
        next(err)
      }
    }
}
export default allowTo;