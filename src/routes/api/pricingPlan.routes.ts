import { Router, Request, Response, NextFunction } from "express";
import PricingPlanController from "../../pricingPlan/pricingplan.controller";
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
      body("plan_name").trim().notEmpty().isLength({ min: 3 }),
      body("attributes").trim().notEmpty(),
      body("price").trim().isNumeric(),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      PricingPlanController.addPricingPlan(req, res, next);
    }
  )
  .get((req: Request, res: Response, next: NextFunction) => {
    PricingPlanController.getAllPricingPlans(req, res, next);
  });

routes
  .route("/:pricing_plan_id")
  .get(
    [param("pricing_plan_id").isUUID()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      PricingPlanController.getPricingPlan(req, res, next);
    }
  )
  .patch(
    [
      param("pricing_plan_id").isUUID(),
      body("plan_name").trim().notEmpty().isLength({ min: 3 }),
      body("attributes").trim().notEmpty(),
      body("price").trim().isNumeric(),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      PricingPlanController.updatePricingPlan(req, res, next);
    }
  )
  .delete(
    [param("pricing_plan_id").isUUID()],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      PricingPlanController.deletePricingPlan(req, res, next);
    }
  );

export default routes;
