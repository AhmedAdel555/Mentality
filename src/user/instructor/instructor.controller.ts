import { Request, Response, NextFunction } from "express";
import InstructorService from "./instructor.service";
import InstructorDAO from "./instructor.dao";
import CoursesDAO from "../../courses/courses.dao";

class InstructorController{
  constructor(private readonly instructorService:InstructorService){};

  public async addInstructor(req: Request, res:Response, next: NextFunction){
      try{
        await this.instructorService.addInstructor({...req.body});
        res.status(201).json({status: "success", data: null});
      }catch(error){
        next(error)
      }
  }

  public async getAllInstructors(req: Request, res:Response, next: NextFunction){
    try{
      const instractors = await this.instructorService.getAllInstructors();
      res.status(200).json({status: "success", data: instractors});
    }catch(error){
      next(error)
    }
  }

  public async getInstructor(req: Request, res:Response, next: NextFunction){
    try{
      const instractor = await this.instructorService.getInstructor(req.params.instructor_id);
      res.status(200).json({status: "success", data: instractor});
    }catch(error){
      next(error);
    }
  }

  public async updateInstructor(req: Request, res:Response, next: NextFunction){
    try{
      await this.instructorService.updateInstructor({...req.body});
      res.status(200).json({status: "success", data: null});
    }catch(error){
      next(error);
    }
  }

  public async deleteInstructor(req: Request, res:Response, next: NextFunction){
    try{
      await this.instructorService.deleteInstructor(req.params.instructor_id);
      res.status(200).json({status: "success", data: null});
    }catch(error){
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.instructorService.resetPassword({ ...req.body });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async changeProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profilePicture = await this.instructorService.changeProfilePicture({
        ...req.body,
        profile_picture: req.file?.filename,
      });
      res.status(200).json({ status: "success", data: profilePicture });
    } catch (error) {
      next(error);
    }
  }

  public async getInstructorCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const instructorCourses = await this.instructorService.getInstructorCourses(req.params.instructor_id);
      res.status(200).json({status: "success", data: instructorCourses});
    } catch (error) {
      next(error);
    }
  }
}

export default new InstructorController(new InstructorService(new InstructorDAO, new CoursesDAO()));