import { Router, Request, Response, NextFunction } from "express";
import PricingPlanController from "../../pricingPlan/pricingplan.controller";
import { body, param } from "express-validator";
import validateInput from "../../middlewares/validateInput";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import Roles from "../../utils/roles.enum";
const routes = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     addUpdatePricingPlan:
 *       type: object
 *       required:
 *         - plan_name
 *         - attributes
 *         - price
 *       properties:
 *         plan_name: 
 *           type: string
 *         attributes:
 *           type: string
 *         price: 
 *           type: number
 */

/**
 * @openapi
 * '/api/pricing-plans':
 *  post:
 *   tags:
 *   - Pricing Plans
 *   summary: create an pricing plan
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addUpdatePricingPlan'
 *   responses:
 *     201:
 *       description: created
 *     400: 
 *       description: bad request  
 *     401: 
 *       description: Un Uathorized
 *     403:
 *       description: Forbidden
 *     500:
 *       description: server error 
 *  get:
 *   tags:
 *   - Pricing Plans
 *   summary: get all pricing plans
 *   responses:
 *     200:
 *       description: get all pricing plans
 *     500:
 *       description: server error 
 */

routes
  .route("/")
  .post(
    [
      body("plan_name").trim().notEmpty().isLength({ min: 3 }),
      body("attributes").trim().notEmpty(),
      body("price").trim().custom((value, {req}) => {
        return (typeof value === 'number')
    })
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

/**
 * @openapi
 * '/api/pricing-plans/{pricing_plan_id}':
 *  get:
 *   tags:
 *   - Pricing Plans
 *   summary: get pricing plan by id
 *   parameters:
 *    - name: pricing_plan_id
 *      in: path
 *      description: The id of the pricing plan
 *      required: true
 *   responses:
 *     200:
 *       description: get all pricing plans
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error 
 *  patch:
 *   tags:
 *   - Pricing Plans
 *   summary: update an pricing plan
 *   parameters:
 *    - name: pricing_plan_id
 *      in: path
 *      description: The id of the pricing plan
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addUpdatePricingPlan'
 *   responses:
 *     200:
 *       description: updated
 *     400: 
 *       description: bad request  
 *     401: 
 *       description: Un Uathorized
 *     403:
 *       description: Forbidden
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error 
 *  delete:
 *   tags:
 *   - Pricing Plans
 *   summary: delete pricing plan by id
 *   parameters:
 *    - name: pricing_plan_id
 *      in: path
 *      description: The id of the pricing plan
 *      required: true
 *   responses:
 *     200:
 *       description: deleted
 *     400: 
 *       description: bad request  
 *     401: 
 *       description: Un Uathorized
 *     403:
 *       description: Forbidden
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error 
 */

routes
  .route("/:pricing_plan_id")
  .get(
    [param("pricing_plan_id").isNumeric()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      PricingPlanController.getPricingPlan(req, res, next);
    }
  )
  .patch(
    [
      param("pricing_plan_id").isNumeric(),
      body("plan_name").trim().notEmpty().isLength({ min: 3 }),
      body("attributes").trim().notEmpty(),
      body("price").trim().custom((value, {req}) => {
        return (typeof value === 'number')
    }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      PricingPlanController.updatePricingPlan(req, res, next);
    }
  )
  .delete(
    [param("pricing_plan_id").isNumeric()],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      PricingPlanController.deletePricingPlan(req, res, next);
    }
  );

export default routes;
