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


/**
 * @openapi
 * '/api/admins':
 *  post:
 *   tags:
 *   - Admin
 *   summary: create an admin
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addAdminInput'
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
 *   - Admin
 *   summary: Get all admins
 *   responses:
 *     200:
 *       description: get all admins
 *     401: 
 *       description: Un Uathorized
 *     403:
 *       description: Forbidden
 *     500:
 *       description: server error 
 *  patch:
 *   tags:
 *   - Admin
 *   summary: update admin info
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/updateAdminInfoInput'
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
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     addAdminInput:
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
 *     updateAdminInfoInput:
 *       type: object
 *       required:
 *         - user_name
 *         - phone_number
 *         - address
 *       properties:
 *         user_name: 
 *           type: string
 *         phone_number:
 *           type: string | null
 *         address:
 *           type:  string | null
 */
routes
  .route("/")
  .post(
    [
      body("email")
        .trim()
        .matches("^[a-zA-Z0-9._%+-]+@gmail.com$")
        .withMessage("please enter an valide email"),
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
      body("user_name").trim().isLength({ min: 3 }),
      body("phone_number").custom((value, { req }) => {
        return value === null || typeof value === "string";
      }),
      body("address").custom((value, { req }) => {
        return value === null || typeof value === "string";
      })
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      adminController.updateAdmin(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/admins/{admin_id}':
 *  get:
 *   - Admin
 *   summary: get admin info
 *   parameters:
 *    - name: admin_id
 *      in: path
 *      description: The id of the admin
 *      required: true
 *   responses:
 *     200:
 *       description: get admin
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
    body("old_password").trim().notEmpty(),
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
    })
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
