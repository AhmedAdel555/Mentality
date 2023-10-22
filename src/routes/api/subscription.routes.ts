import { Router, Request, Response, NextFunction } from "express";
import subscriptionController from "../../subscription/subscription.controller";
import { body, param } from "express-validator";
import validateInput from "../../middlewares/validateInput";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import Roles from "../../utils/roles.enum";
const routes = Router();

routes
  .route("/")
  .post(
    [
      body("student_email")
        .trim()
        .isEmail()
        .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
        .withMessage("please enter an valide email"),
      body("pricing_plan_id").custom((value, { req }) => {
        return typeof value === "number";
      }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.addSubscription(req, res, next);
    }
  ).get(
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getAllSubscriptions(req, res, next);
    }
  )

routes
  .route("/:subscription_id")
  .delete(
    [param("subscription_id").isUUID()],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.deleteSubscription(req, res, next);
    }
  );

export default routes;
