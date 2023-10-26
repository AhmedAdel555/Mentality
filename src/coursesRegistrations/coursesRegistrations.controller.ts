import CoursesDAO from "../courses/courses.dao";
import StudentDAO from "../user/student/student.dao";
import StudentProgressDAO from "../studentProgress/studentProgress.dao";
import CoursesRegistrationsDAO from "./coursesRegistrations.dao";
import CourseRegistrationService from "./coursesRegistrations.service";
import { Request, Response, NextFunction } from "express";

class CoursesRegistrationsContoller {
  constructor(
    private readonly coursesRegistrationsService: CourseRegistrationService
  ) {}

  public async addCoursesRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.coursesRegistrationsService.addCourseRegistration({
        ...req.body,
        ...req.params,
      });
      res.status(201).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async getCourseStudents(req: Request, res: Response, next: NextFunction){
    try{
     const students = await this.coursesRegistrationsService.getCourseStudents(req.params.course_id)
    res.status(200).json({status: "success", data: students});
    }catch (error) {
     next(error);
   }
 }

  public async getStudentCourses(req: Request, res: Response, next: NextFunction){
    try{
      const courses = await this.coursesRegistrationsService.getStudentCourses(req.params.student_id);
      res.status(200).json({status: "success", data: courses});
    }catch (error) {
      next(error);
    }
  }
}

export default new CoursesRegistrationsContoller(
  new CourseRegistrationService(
    new CoursesRegistrationsDAO(),
    new CoursesDAO(),
    new StudentDAO(),
    new StudentProgressDAO()
  )
);
