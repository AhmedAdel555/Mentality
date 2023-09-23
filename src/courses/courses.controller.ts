import CoursesService from "./courses.service";
import { Request, Response, NextFunction } from "express";
class CourseContoller{

  constructor(private readonly courseService: CoursesService){};

  public async createCourse(req:Request , res:Response, next:NextFunction){
      try{
        const newCourse = await this.courseService.createCourse(req.body.title, req.body.description, req.body.userId, req.body.userRole, req.body.level);
        return res.status(201).json({status: "success", data: newCourse});
      }catch(error){
        next(error);
      }
  }
}
export default CourseContoller;