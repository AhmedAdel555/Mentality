import { NextFunction, Router, Request, Response} from "express";
import CoursesContoller from "../../courses/courses.controller";
import CoursesService from "../../courses/courses.service";
import CoursesDAO from "../../courses/courses.dao";
const routes = Router();

routes.route('/')
      .post((req: Request, res: Response, next: NextFunction)=>{
          new CoursesContoller(new CoursesService(new CoursesDAO())).createCourse(req, res, next);
        }
      )
      .get((req: Request, res: Response, next: NextFunction) => {
        new CoursesContoller(new CoursesService(new CoursesDAO())).getAllCourses(req, res, next);
      })

routes.route('/:courseId')
      .get((req: Request, res: Response, next: NextFunction) => {
        new CoursesContoller(new CoursesService(new CoursesDAO())).getCourse(req, res, next);
      })
      .put((req: Request, res: Response, next: NextFunction) => {
        new CoursesContoller(new CoursesService(new CoursesDAO())).updateCourse(req, res, next);
      })
      .delete((req: Request, res: Response, next: NextFunction) => {
        new CoursesContoller(new CoursesService(new CoursesDAO())).deleteCourse(req, res, next);
      })

export default routes;