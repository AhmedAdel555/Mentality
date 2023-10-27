import { Router, Request, Response, NextFunction } from "express";
import subscriptionController from "../../subscription/subscription.controller";
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
 *     addSubscription:
 *       type: object
 *       required:
 *         - student_email
 *         - pricing_plan_id
 *       properties:
 *         student_email: 
 *           type: string
 *         pricing_plan_id:
 *           type: integer 
 */

/**
 * @openapi
 * '/api/subscriptions':
 *  post:
 *   tags:
 *   - Subscriptions
 *   summary: add subscription
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addSubscription'
 *   responses:
 *     201:
 *       description: created
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
 *  get:
 *   tags:
 *   - Subscriptions
 *   summary: get all subscription
 *   responses:
 *     200:
 *       description: get all subscription
 *     401: 
 *       description: Un Uathorized
 *     403:
 *       description: Forbidden
 *     500:
 *       description: server error
 */

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

/**
 * @openapi
 * '/api/subscriptions/{subscription_id}':
 *  get:
 *   tags:
 *   - Subscriptions
 *   summary: Get subscription
 *   parameters:
 *    - name: subscription_id
 *      in: path
 *      description: The id of the subscription
 *      required: true
 *   responses:
 *     200:
 *       description: get subscription
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
