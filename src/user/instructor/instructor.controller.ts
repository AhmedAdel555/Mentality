import { Request, Response, NextFunction } from "express";
import InstructorService from "./instructor.service";

class InstructorController{
  constructor(private readonly instructorService:InstructorService){};

  public async create(req: Request, res:Response, next: NextFunction){
      await this.instructorService.create({...req.body});
      res.status(201).json({status: "success", data: null});
  }

  public async getAll(req: Request, res:Response, next: NextFunction){
    const instractors = await this.instructorService.getAll();
    res.status(200).json({status: "success", data: instractors});
  }

  public async getById(req: Request, res:Response, next: NextFunction){
    
  }
}