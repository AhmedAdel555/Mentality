import { Router, Request, Response, NextFunction } from "express";
import InstructorController from "../../user/instructor/instructor.controller";
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
  .post(
    [
      body("email")
        .trim()
        .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
        .withMessage("please enter an valide email"),
      body("user_name").trim().isLength({ min: 3 }),
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
      body("title").trim().isLength({ min: 5 }),
      body("description").trim().isLength({ min: 10 }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      InstructorController.addInstructor(req, res, next);
    }
  )
  .get((req: Request, res: Response, next: NextFunction) => {
    InstructorController.getAllInstructors(req, res, next);
  })
  .patch(
    [
      body("user_name").trim().isLength({ min: 3 }),
      body("phone_number").custom((value, { req }) => {
        return value === null || typeof value === "string";
      }),
      body("address").custom((value, { req }) => {
        return value === null || typeof value === "string";
      }),
      body("title").trim().isLength({ min: 5 }),
      body("description").trim().isLength({ min: 10 }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      InstructorController.updateInstructor(req, res, next);
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
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    InstructorController.resetPassword(req, res, next);
  }
);

routes.patch(
  "/change-profile-picture",
  uploadProfilePicture.single("profile_picture"),
  validateFileUpload,
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    InstructorController.changeProfilePicture(req, res, next);
  }
);

routes
  .route("/:instructor_id")
  .get(
    [param("instructor_id").isUUID()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      InstructorController.getInstructor(req, res, next);
    }
  );

routes.get(
  "/:instructor_id/courses",
  [param("instructor_id").isUUID()],
  validateInput,
  (req: Request, res: Response, next: NextFunction) => {
    InstructorController.getInstructorCourses(req, res, next);
  }
);

export default routes;
