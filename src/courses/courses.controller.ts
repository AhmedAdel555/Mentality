import { Request, Response, NextFunction } from "express";
import CoursesService from "./courses.service";
import CoursesDAO from "./courses.dao";
import InstructorDAO from "../user/instructor/instructor.dao";
import CoursesRegistrationsDAO from "../coursesRegistrations/coursesRegistrations.dao";

class CoursesContoller {
  constructor(private readonly courseService: CoursesService) {}

  public async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await this.courseService.addCourse({...req.body,picture: req.file?.filename,});
      return res.status(201).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async getAllCourses(_req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await this.courseService.getAllCourses();
      return res.status(200).json({ status: "success", data: courses });
    } catch (error) {
      next(error);
    }
  }

  public async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await this.courseService.getCourse(req.params.course_id);
      return res.status(200).json({ status: "success", data: course });
    } catch (error) {
      next(error);
    }
  }

  public async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await this.courseService.updateCourse({...req.body,id: req.params.course_id});
      return res.status(201).json({ status: "success", data: null});
    } catch (error) {
      next(error);
    }
  }

  public async updateCoursePicture(req: Request, res: Response, next: NextFunction) {
    try {
      const picture = await this.courseService.updateCoursePicture({...req.body, id: req.params.course_id, picture: req.file?.filename,});
      return res.status(201).json({ status: "success", data: picture });
    } catch (error) {
      next(error);
    }
  }
  public async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await this.courseService.deleteCourse({...req.body, id: req.params.course_id});
      return res.status(201).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async getCourseStudents(req: Request, res: Response, next: NextFunction){
     try{
      const students = await this.courseService.getCourseUsers(req.params.course_id)
     res.status(200).json({status: "success", data: students});
     }catch (error) {
      next(error);
    }
  }
}
export default new CoursesContoller(new CoursesService(new CoursesDAO(), 
                                    new InstructorDAO(), 
                                    new CoursesRegistrationsDAO()));
