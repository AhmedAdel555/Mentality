import { Request, Response, NextFunction } from "express";
import StudentProgressService from "./studentProgress.service";
import StudentProgressDAO from "./studentProgress.dao";
import CoursesRegistrationsDAO from "../coursesRegistrations/coursesRegistrations.dao";
import SubscriptionDAO from "../subscription/subscription.dao";
import StudentDAO from "../user/student/student.dao";
import CoursesDAO from "../courses/courses.dao";

class StudentProgressController {
  constructor(
    private readonly studentProgressService: StudentProgressService
  ) {}

  public async getStudentLessonProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const topicsProgress =
        await this.studentProgressService.getStudentLessonProgress({
          ...req.body,
          ...req.params,
        });
      res.status(200).json({ status: "success", data: topicsProgress });
    } catch (error) {
      next(error);
    }
  }

  public async finishTopic(req: Request, res: Response, next: NextFunction) {
    try {
      await this.studentProgressService.finishTopic({
        ...req.body,
        ...req.params,
      });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async getAllCourseTasksSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pendingTasks =
        await this.studentProgressService.getAllCourseTasksSubmissions({
          ...req.body,
          ...req.params,
        });
      res.status(200).json({ status: "success", data: pendingTasks });
    } catch (error) {
      next(error);
    }
  }

  public async gradeTask(req: Request, res: Response, next: NextFunction) {
    try {
      await this.studentProgressService.gradeTask({
        ...req.body,
        ...req.params,
      });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }
}
export default new StudentProgressController(
  new StudentProgressService(
    new StudentProgressDAO(),
    new CoursesRegistrationsDAO(),
    new SubscriptionDAO(),
    new StudentDAO(),
    new CoursesDAO()
  )
);
