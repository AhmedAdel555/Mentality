import { Router } from "express";
import AuthRoutes from "./api/auth.routes";
import AdminRoutes from "./api/admin.routes";
import CoursesRoutes from "./api/courses.routes";
const routes = Router();

// all routes
routes.use('/auth', AuthRoutes);
routes.use('/admin', AdminRoutes);
routes.use('/courses', CoursesRoutes);


export default routes;