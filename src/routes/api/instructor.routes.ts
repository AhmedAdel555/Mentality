import { Router, Request, Response, NextFunction } from "express";
import InstructorController from "../../user/instructor/instructor.controller";
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
 * components:
 *   schemas:
 *     addInstructorInput:
 *       type: object
 *       required:
 *         - email
 *         - user_name
 *         - password
 *         - confirm_password
 *         - title
 *         - description
 *       properties:
 *         email: 
 *           type: string
 *         user_name:
 *           type: string
 *         password: 
 *           type: string
 *         confirm_password:
 *           type:  string
 *         title:
 *           type:  string
 *         description:
 *           type:  string
 *     updateInstructorInfoInput:
 *       type: object
 *       required:
 *         - user_name
 *         - phone_number
 *         - address
 *         - title
 *         - description
 *       properties:
 *         user_name: 
 *           type: string
 *         phone_number:
 *           oneOf:
 *            - type: string
 *            - type: null    
 *         address:
 *           oneOf:
 *            - type: string
 *            - type: null   
 *         title:
 *           type:  string
 *         description:
 *           type:  string
 *     resetInstructorPasswordInfo:
 *       type: object
 *       required:
 *         - old_password
 *         - password
 *         - confirm_password
 *       properties:
 *         old_password: 
 *           type: string
 *         password:
 *           type: string
 *         confirm_password:
 *           type:  string
 *     changeInstructorProfilePicture:
 *       type: object
 *       required:
 *         - profile_picture
 *       properties:
 *         profile_picture: 
 *           type: file
 */


/**
 * @openapi
 * '/api/instructors':
 *  post:
 *   tags:
 *   - Instructors
 *   summary: create an instructor
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addInstructorInput'
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
 *   - Instructors
 *   summary: Get all Instructors
 *   responses:
 *     200:
 *       description: get all instructors
 *     500:
 *       description: server error 
 *  patch:
 *   tags:
 *   - Instructors
 *   summary: update instructor
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/updateInstructorInfoInput'
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
      body("title").trim().isLength({ min: 5 }),
      body("description").trim().isLength({ min: 10 }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      InstructorController.addInstructor(req, res, next);
    }
  )
  .get((req: Request, res: Response, next: NextFunction) => {
    InstructorController.getAllInstructors(req, res, next);
  })
  .patch(
    [
      body("user_name").trim().isLength({ min: 3 }),
      body("phone_number").custom((value, { req }) => {
        return value === null || typeof value === "string";
      }),
      body("address").custom((value, { req }) => {
        return value === null || typeof value === "string";
      }),
      body("title").trim().isLength({ min: 5 }),
      body("description").trim().isLength({ min: 10 }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      InstructorController.updateInstructor(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/instructors/reset-password':
 *  patch:
 *   tags:
 *   - Instructors
 *   summary: update instructor password
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/resetInstructorPasswordInfo'
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
    }),
  ],
  validateInput,
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    InstructorController.resetPassword(req, res, next);
  }
);

/**
 * @openapi
 * '/api/instructors/change-profile-picture':
 *  patch:
 *   tags:
 *   - Instructors
 *   summary: update instructor profile picture
 *   requestBody:
 *     required: true
 *     content:
 *       multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/changeInstructorProfilePicture'
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

routes.patch(
  "/change-profile-picture",
  uploadProfilePicture.single("profile_picture"),
  validateFileUpload,
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    InstructorController.changeProfilePicture(req, res, next);
  }
);

/**
 * @openapi
 * '/api/instructors/{instructor_id}':
 *  get:
 *   tags:
 *   - Instructors
 *   summary: Get instructor by id
 *   parameters:
 *    - name: instructor_id
 *      in: path
 *      description: The id of the instructor
 *      required: true
 *   responses:
 *     200:
 *       description: get instructor
 *     400: 
 *       description: bad request  
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error 
 */

routes
  .route("/:instructor_id")
  .get(
    [param("instructor_id").isUUID()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      InstructorController.getInstructor(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/instructors/{instructor_id}/courses':
 *  get:
 *   tags:
 *   - Instructors
 *   summary: Get Instructor courses
 *   parameters:
 *    - name: instructor_id
 *      in: path
 *      description: The id of the instructor
 *      required: true
 *   responses:
 *     200:
 *       description: get all instructors
 *     400: 
 *       description: bad request  
 *     500:
 *       description: server error 
 */

routes.get(
  "/:instructor_id/courses",
  [param("instructor_id").isUUID()],
  validateInput,
  (req: Request, res: Response, next: NextFunction) => {
    InstructorController.getInstructorCourses(req, res, next);
  }
);

export default routes;
