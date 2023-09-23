import { Router } from "express";
import CourseContoller from "../../courses/courses.controller";
import CoursesService from "../../courses/courses.service";
import CoursesDAO from "../../courses/courses.dao";
const routes = Router();

routes.route('/')
.post(new CourseContoller(new CoursesService(new CoursesDAO())).createCourse)

export default routes;
