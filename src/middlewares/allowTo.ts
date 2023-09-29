import {NextFunction, Request, Response} from "express";

const allowTo = (...roles: string[])=>{
    return (req: Request, _res:Response, next:NextFunction)=>{
      try{
        if(!roles.includes(req.body.userRole)){
          throw new Error("you don't have a permision to do this");
        }
        next()
      }catch(err){
        next(err)
      }
    }
}

export default allowTo;