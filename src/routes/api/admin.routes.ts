import { Router, Request, Response, NextFunction } from "express";
import adminController from "../../user/admin/admin.controller";
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
        .isEmail()
        .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
        .withMessage("please enter an valide email"),
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
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      adminController.addAdmin(req, res, next);
    }
  )
  .get(
    isAuth,
    allowTo(Roles.Admin, Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      adminController.getAllAdmins(req, res, next);
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
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      adminController.updateAdmin(req, res, next);
    }
  );

routes
  .route("/:admin_id")
  .get(
    [param("admin_id").isUUID()],
    validateInput,
    isAuth,
    allowTo(Roles.Admin, Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      adminController.getAdmin(req, res, next);
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
  allowTo(Roles.Admin),
  (req: Request, res: Response, next: NextFunction) => {
    adminController.resetPassword(req, res, next);
  }
);

routes.patch(
  "/change-profile-picture",
  uploadProfilePicture.single("profile_picture"),
  validateFileUpload,
  isAuth,
  allowTo(Roles.Admin),
  (req: Request, res: Response, next: NextFunction) => {
    adminController.changeProfilePicture(req, res, next);
  }
);

export default routes;
