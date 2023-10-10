import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../../auth/auth.controller";
import Roles from "../../utils/roles.enum";
import { body } from "express-validator";
import validateResult from "../../middlewares/validateInput";
const routes = Router();

routes.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
      .withMessage("please enter an valide email"),
    body("password")
      .trim()
      .matches(
        "^(?=.*d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*@])(?=.*[a-zA-Z]).{8,16}$"
      )
      .withMessage(
        `password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`
      ),
    body("role").isIn(Object.values(Roles)),
  ],
  validateResult,
  (req: Request, res: Response, next: NextFunction) => {
    AuthController.login(req, res, next);
  }
);

routes.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
      .withMessage("please enter a valide email"),
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
  validateResult,
  (req: Request, res: Response, next: NextFunction) => {
    AuthController.register(req, res, next);
  }
);

export default routes;
