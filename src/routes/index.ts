import { Router } from "express";
import AuthRoutes from "./api/auth.routes";
import AdminRoutes from "./api/admin.routes";
import InstructorRoutes from "./api/instructor.routes";
import CoursesRoutes from "./api/courses.routes";
import PricingPlansRoutes from "./api/pricingPlan.routes";
import StudentRoutes from "./api/student.routes";
import SubscriptionsRoutes from "./api/subscription.routes";
const routes = Router();

// all routes
routes.use('/auth', AuthRoutes);
routes.use('/admins', AdminRoutes);
routes.use('/instructors', InstructorRoutes);
routes.use('/courses', CoursesRoutes);
routes.use('/pricing-plans', PricingPlansRoutes);
routes.use('/students', StudentRoutes);
routes.use('/subscriptions', SubscriptionsRoutes);


export default routes;