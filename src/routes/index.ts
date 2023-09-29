import { Router } from "express";
import CoursesRoutes from "./api/courses.routes";
import AuthRoutes from "./api/auth.routes";
const routes = Router();

// all routes
routes.use('/courses', CoursesRoutes);
routes.use('/auth', AuthRoutes);

export default routes;