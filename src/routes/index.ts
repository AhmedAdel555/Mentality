import { Router } from "express";
import CoursesRoutes from "./api/courses.routes";
const routes = Router();

// all routes
routes.use('/courses', CoursesRoutes);


export default routes;