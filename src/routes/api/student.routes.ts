import { Router, Request, Response, NextFunction } from "express";
import studentController from "../../user/student/student.controller";
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
      body("email").trim().isEmail(),
      body("user_name").trim().isLength({ min: 5 }),
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
    allowTo(Roles.Admin, Roles.Instructor, Roles.Student),
    (req: Request, res: Response, next: NextFunction) => {
      studentController.getStudent(req, res, next);
    }
  )
  .delete(
    [param("student_id").isUUID()],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      studentController.deleteStudent(req, res, next);
    }
  );

routes.patch(
  "/reset-password",
  [
    body("password")
      .trim()
      .matches(
        "^(?=.*d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*@])(?=.*[a-zA-Z]).{8,16}$"
      )
      .withMessage(
        `password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`
      ),
    body("confirmPassword").custom((value, { req }) => {
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

export default routes;
