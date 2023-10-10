import { Router, Request, Response, NextFunction } from "express";
import studentController from "../../user/student/student.controller";
import { body, param } from "express-validator";
import validateResult from "../../middlewares/validateInput";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import uploadProfilePicture from "../../utils/uploadProfilePictures";
const routes = Router();

routes.route('/')
.get(isAuth,allowTo('Admin', 'Instructor'),(req: Request, res: Response, next: NextFunction) => {
  studentController.getAllStudent(req, res, next);
})
.patch([
  body("email").trim().isEmail(),
  body("userName").trim().isLength({ min: 5 }),
  body("phoneNumber").custom((value, { req }) => {
    return value === null || typeof value === "string";
  }),
  body("address").custom((value, { req }) => {
    return value === null || typeof value === "string";
  }),
],
validateResult,
isAuth,
allowTo("Student"),
(req: Request, res: Response, next: NextFunction) => {
  studentController.updateStudent(req, res, next);
})

routes.route('/:studentId')
.get(
  [
    param('studentId').isUUID()
  ],
  validateResult,
  isAuth,
  (req: Request, res: Response, next: NextFunction) => {
    studentController.getStudent(req, res, next);
  }
).delete([
  param('studentId').isUUID()
],
validateResult,
isAuth,
allowTo('Admin'),
(req: Request, res: Response, next: NextFunction) => {
  studentController.deleteStudent(req, res, next);
})

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
  validateResult,
  isAuth,
  allowTo("Admin"),
  (req: Request, res: Response, next: NextFunction) => {
    studentController.resetPassword(req, res, next);
  }
);

routes.patch(
  "/change-profile-picture",
  isAuth,
  allowTo("Admin"),
  uploadProfilePicture.single("profilePicture"),
  (req: Request, res: Response, next: NextFunction) => {
    studentController.changeProfilePicture(req, res, next);
  }
);

export default routes;