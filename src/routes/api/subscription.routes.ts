import { Router, Request, Response, NextFunction } from "express";
import subscriptionController from "../../subscription/subscription.controller";
import { body, param } from "express-validator";
import validateResult from "../../middlewares/validateInput";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
const routes = Router();

routes.route('/')
.post([
  body('student_id').isUUID(),
  body('pricing_plan_id').isUUID()
],
  validateResult,
  isAuth,
  allowTo("Admin"),
  (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.createSubscription(req, res, next);
  }
)
.get(
  isAuth,
  allowTo("Admin"),
  (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.getAllSubscriptions(req, res, next);
}
)

routes.route("/:subscriptionId")
.get([
  param('subscriptionId').isUUID()
],
validateResult,
isAuth,
(req: Request, res: Response, next: NextFunction) => {
  subscriptionController.getSubscription(req, res, next);
}
)
.delete([
  param('subscriptionId').isUUID()
],
validateResult,
isAuth,
allowTo("Admin"),
(req: Request, res: Response, next: NextFunction) => {
  subscriptionController.deleteSubscription(req, res, next);
}
)

export default routes;