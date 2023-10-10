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
      body("email").trim().isEmail(),
      body("user_name").trim().isLength({ min: 5 }),
      body("password")
        .trim()
        .matches(
          "^(?=.*d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*@])(?=.*[a-zA-Z]).{8,16}$"
        )
        .withMessage(
          `password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`
        ),
      body("confirm_password").custom((value, { req }) => {
        return value === req.body.password;
      }),
      body("title").trim().isLength({ min: 8 }),
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
      body("email").trim().isEmail(),
      body("user_name").trim().isLength({ min: 5 }),
      body("title").trim().isLength({ min: 8 }),
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
    body("password")
      .trim()
      .matches(
        "^(?=.*d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*@])(?=.*[a-zA-Z]).{8,16}$"
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
  )
  .delete(
    [param("instructor_id").isUUID()],
    validateInput,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      InstructorController.deleteInstructor(req, res, next);
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
