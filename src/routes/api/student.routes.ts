import { Router, Request, Response, NextFunction } from "express";
import studentController from "../../user/student/student.controller";
import coursesRegistrationsController from "../../coursesRegistrations/coursesRegistrations.controller";
import subscriptionController from "../../subscription/subscription.controller";
import { body, param } from "express-validator";
import validateInput from "../../middlewares/validateInput";
import validateFileUpload from "../../middlewares/validateFileUpload";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import uploadProfilePicture from "../../utils/uploadProfilePictures";
import Roles from "../../utils/roles.enum";
const routes = Router();

routes
  .route("/")
  .get(
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      studentController.getAllStudents(req, res, next);
    }
  )
  .patch(
    [
      body("user_name").trim().isLength({ min: 3 }),
      body("phone_number").custom((value, { req }) => {
        return value === null || typeof value === "string";
      }),
      body("address").custom((value, { req }) => {
        return value === null || typeof value === "string";
      }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Student),
    (req: Request, res: Response, next: NextFunction) => {
      studentController.updateStudent(req, res, next);
    }
  );

routes
  .route("/:student_id")
  .get(
    [param("student_id").isUUID()],
    validateInput,
    isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      studentController.getStudent(req, res, next);
    }
  );

routes.patch(
  "/reset-password",
  [
    body("old_password").trim().notEmpty(),
    body("password")
      .trim()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/
      )
      .withMessage(
        `password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`
      ),
    body("confirm_password").custom((value, { req }) => {
      return value === req.body.password;
    }),
  ],
  validateInput,
  isAuth,
  allowTo(Roles.Student),
  (req: Request, res: Response, next: NextFunction) => {
    studentController.resetPassword(req, res, next);
  }
);

routes.patch(
  "/change-profile-picture",
  uploadProfilePicture.single("profile_picture"),
  validateFileUpload,
  isAuth,
  allowTo(Roles.Student),
  (req: Request, res: Response, next: NextFunction) => {
    studentController.changeProfilePicture(req, res, next);
  }
);

routes.get(
  "/:student_id/courses",
  [param("student_id").isUUID()],
  validateInput,
  isAuth,
  (req: Request, res: Response, next: NextFunction) => {
    coursesRegistrationsController.getStudentCourses(req, res, next);
  }
);

routes.get(
  "/:student_id/subscriptions",
  [param("student_id").isUUID()],
  validateInput,
  isAuth,
  allowTo(Roles.Student, Roles.Admin),
  (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.getStudentSubscriptions(req, res, next);
  }
)

export default routes;
