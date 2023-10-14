import { Router, Request, Response, NextFunction } from "express";
import coursesRegistrationsController from "../../coursesRegistrations/coursesRegistrations.controller";
import { param } from "express-validator";
import validateInput from "../../middlewares/validateInput";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import Roles from "../../utils/roles.enum";
const routes = Router();

routes.post('/course-registration/:course_id', [
  param("course_id").isUUID()
],
validateInput,
isAuth,
allowTo(Roles.Student),
(req: Request, res:Response, next: NextFunction) => {
  coursesRegistrationsController.addCoursesRegistration(req, res, next);
})

export default routes;