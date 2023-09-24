import CoursesService from "./courses.service";
import { Request, Response, NextFunction } from "express";
class CoursesContoller{

  constructor(private readonly courseService: CoursesService){};

  public async createCourse(req:Request , res:Response, next:NextFunction){
      try{
        const newCourse = await this.courseService.createCourse(req.body.title, req.body.description, req.body.userId, req.body.userRole, req.body.level);
        return res.status(201).json({status: "success", data: newCourse});
      }catch(error){
        next(error);
      }
  }

  public async getAllCourses(_req:Request , res:Response, next:NextFunction){
    try{
      const newCourse = await this.courseService.getAllCourses();
      return res.status(201).json({status: "success", data: newCourse});
    }catch(error){
      next(error);
    }
  }

    public async getCourse(req:Request , res:Response, next:NextFunction){
      try{
        const newCourse = await this.courseService.getCourse(req.params.courseId);
        return res.status(201).json({status: "success", data: newCourse});
      }catch(error){
        next(error);
      }
    }

    public async updateCourse(req:Request , res:Response, next:NextFunction){
      try{
        const newCourse = await this.courseService.updateCourse(req.params.courseId,req.body.title, req.body.description, req.body.userId, req.body.userRole, req.body.level);
        return res.status(201).json({status: "success", data: newCourse});
      }catch(error){
        next(error);
      }
  }

    public async deleteCourse(req:Request , res:Response, next:NextFunction){
      try{
        await this.courseService.deleteCourse(req.params.courseId, req.body.userId, req.body.userRole);
        return res.status(201).json({status: "success", data: null});
      }catch(error){
        next(error);
      }
    }
}
export default CoursesContoller;