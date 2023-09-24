import { NextFunction, Router, Request, Response} from "express";
import CourseContoller from "../../courses/courses.controller";
import CoursesService from "../../courses/courses.service";
import CoursesDAO from "../../courses/courses.dao";
const routes = Router();

routes.route('/')
      .post((req: Request, res: Response, next: NextFunction)=>{
          new CourseContoller(new CoursesService(new CoursesDAO())).createCourse(req, res, next) ;
        }
      );
    
export default routes;