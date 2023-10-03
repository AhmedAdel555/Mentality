import { Router, Request, Response, NextFunction } from "express";
import adminController from "../../admin/admin.controller";
import { body, param } from "express-validator";
import validateResult from "../../middlewares/validateResulte";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
const routes = Router();

routes
  .route("/")
  .post(
    [
      body("email").trim().isEmail(),
      body("userName").trim().isLength({ min: 5 }),
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
      adminController.addAdmin(req, res, next);
    }
  )
  .get(
    isAuth,
    allowTo("Admin"),
    (req: Request, res: Response, next: NextFunction) => {
      adminController.getAllAdmins(req, res, next);
    }
  );

  routes.route('/adminId')
  .get([
    param('adminId').isUUID()
  ],
    isAuth,
    allowTo("Admin"),
    (req: Request, res: Response, next: NextFunction) => {
    adminController.getAdmin(req, res, next);
  })
  .put([
    body("email").trim().isEmail(),
    body("userName").trim().isLength({ min: 5 }),
  ],
  isAuth,
  allowTo("Admin"),
  (req: Request, res: Response, next: NextFunction) => {
    adminController.updateAdmin(req, res, next);
  }
  )

export default routes;
