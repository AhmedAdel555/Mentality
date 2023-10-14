import CoursesDAO from "../courses/courses.dao";
import StudentDAO from "../user/student/student.dao";
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
        course_id: req.params.course_id,
      });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new CoursesRegistrationsContoller(
  new CourseRegistrationService(
    new CoursesRegistrationsDAO(),
    new CoursesDAO(),
    new StudentDAO()
  )
);
