import { Request, Response, NextFunction } from "express";
import CoursesService from "./courses.service";
import CoursesDAO from "./courses.dao";

class CoursesContoller {
  constructor(private readonly courseService: CoursesService) {}

  public async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await this.courseService.createCourse({
        ...req.body,
        picture: req.file?.filename,
      });
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
      const newCourse = await this.courseService.getCourse(req.params.courseId);
      return res.status(200).json({ status: "success", data: newCourse });
    } catch (error) {
      next(error);
    }
  }

  public async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const newCourse = await this.courseService.updateCourse({
        ...req.body,
        id: req.params.courseId,
      });
      return res.status(201).json({ status: "success", data: newCourse });
    } catch (error) {
      next(error);
    }
  }

  public async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await this.courseService.deleteCourse(
        req.params.courseId,
        req.body.userId,
        req.body.userRole
      );
      return res.status(201).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }
}
export default new CoursesContoller(new CoursesService(new CoursesDAO()));
