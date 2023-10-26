import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../../auth/auth.controller";
import Roles from "../../utils/roles.enum";
import { body } from "express-validator";
import validateResult from "../../middlewares/validateInput";
import authController from "../../auth/auth.controller";
const routes = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - role
 *       properties:
 *         email: 
 *           type: string
 *         password: 
 *           type: string
 *         role:
 *           type:  string
 *           enum:
 *            - student
 *            - admin
 *            - instructor
 *     register:
 *       type: object
 *       required:
 *         - email
 *         - user_name
 *         - password
 *         - confirm_password
 *       properties:
 *         email: 
 *           type: string
 *         user_name:
 *           type: string
 *         password: 
 *           type: string
 *         confirm_password:
 *           type:  string
 *     forgetPasswordGetRequest:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         email: 
 *           type: string
 *         role:
 *           type:  string
 *           enum:
 *            - student
 *            - admin
 *            - instructor
 *     forgetPasswordPostRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - confirm_password
 *         - verification_code
 *         - role
 *       properties:
 *         email: 
 *           type: string
 *         verification_code:
 *           type: string
 *         password: 
 *           type: string
 *         confirm_password:
 *           type:  string
 *         role:
 *           type:  string
 *           enum:
 *            - student
 *            - admin
 *            - instructor
 */

/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *   tags:
 *   - Auth
 *   summary:
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/login'
 *   responses:
 *     200:
 *       description: login successfully
 *     400: 
 *       description: bad request  
 *     404:
 *       description: Not found
 *     500:
 *       description: server error 
 */
routes.post(
  "/login",
  [
    body("email")
      .trim()
      .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
      .withMessage("please enter an valide email"),
    body("password")
      .trim()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/
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

/**
 * @openapi
 * '/api/auth/register':
 *  post:
 *   tags:
 *   - Auth
 *   summary:
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/register'
 *   responses:
 *     201:
 *       description: created
 *     400: 
 *       description: bad request  
 *     404:
 *       description: Not found
 *     500:
 *       description: server error 
 */

routes.post(
  "/register",
  [
    body("email")
      .trim()
      .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
      .withMessage("please enter a valide email"),
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
  ],
  validateResult,
  (req: Request, res: Response, next: NextFunction) => {
    AuthController.register(req, res, next);
  }
);

/**
 * @openapi
 * '/api/auth/forgot-password':
 *  get:
 *   tags:
 *   - Auth
 *   summary:
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/forgetPasswordGetRequest'
 *   responses:
 *     200:
 *       description: verification code email has sent
 *     400: 
 *       description: bad request  
 *     404:
 *       description: Not found
 *     500:
 *       description: server error 
 */

routes.get(
  "/forgot-password",
  [
    body("email")
      .trim()
      .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
      .withMessage("please enter an valide email"),
    body("role").isIn(Object.values(Roles)),
  ],
  validateResult,
  (req: Request, res: Response, next: NextFunction) => {
    authController.getForgotPassowrd(req, res, next);
  }
)

/**
 * @openapi
 * '/api/auth/forgot-password':
 *  post:
 *   tags:
 *   - Auth
 *   summary:
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/forgetPasswordPostRequest'
 *   responses:
 *     200:
 *       description: password is changed
 *     400: 
 *       description: bad request  
 *     404:
 *       description: Not found
 *     500:
 *       description: server error 
 */

routes.post(
  "/forgot-password",
  [
    body("email")
      .trim()
      .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
      .withMessage("please enter an valide email"),
    body("role").isIn(Object.values(Roles)),
    body("verification_code").trim().notEmpty(),
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
  validateResult,
  (req: Request, res: Response, next: NextFunction) => {
    authController.updateForgottenPassword(req, res, next);
  }
)


export default routes;
