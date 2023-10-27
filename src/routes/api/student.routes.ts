import { Router, Request, Response, NextFunction } from "express";
import studentController from "../../user/student/student.controller";
import coursesRegistrationsController from "../../coursesRegistrations/coursesRegistrations.controller";
import subscriptionController from "../../subscription/subscription.controller";
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
 *     updateStudentInfoInput:
 *       type: object
 *       required:
 *         - user_name
 *         - phone_number
 *         - address
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
 *     resetStudentPassword:
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
 *     changeStudentProfilePicture:
 *       type: object
 *       required:
 *         - profile_picture
 *       properties:
 *         profile_picture: 
 *           type: file
 */

/**
 * @openapi
 * '/api/students':
 *  get:
 *   tags:
 *   - Student
 *   summary: Get all students
 *   responses:
 *     200:
 *       description: get all students
 *     401: 
 *       description: Un Uathorized
 *     403:
 *       description: Forbidden
 *     500:
 *       description: server error 
 *  patch:
 *   tags:
 *   - Student
 *   summary: update student info
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/updateStudentInfoInput'
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
  .get(
    isAuth,
    allowTo(Roles.Admin),
    (req: Request, res: Response, next: NextFunction) => {
      studentController.getAllStudents(req, res, next);
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
      }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Student),
    (req: Request, res: Response, next: NextFunction) => {
      studentController.updateStudent(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/students/{student_id}':
 *  get:
 *   tags:
 *   - Student
 *   summary: Get student by id
 *   parameters:
 *    - name: student_id
 *      in: path
 *      description: The id of the student
 *      required: true
 *   responses:
 *     200:
 *       description: get student
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
  .route("/:student_id")
  .get(
    [param("student_id").isUUID()],
    validateInput,
    isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      studentController.getStudent(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/students/reset-password':
 *  patch:
 *   tags:
 *   - Student
 *   summary: reset password
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/resetStudentPassword'
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
  allowTo(Roles.Student),
  (req: Request, res: Response, next: NextFunction) => {
    studentController.resetPassword(req, res, next);
  }
);

/**
* @openapi
 * '/api/students/change-profile-picture':
 *  patch:
 *   tags:
 *   - Student
 *   summary: change profile picture
 *   requestBody:
 *    required: true
 *    content:
 *      multipart/form-data:
 *        schema:
 *          $ref: '#/components/schemas/changeStudentProfilePicture'
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
  allowTo(Roles.Student),
  (req: Request, res: Response, next: NextFunction) => {
    studentController.changeProfilePicture(req, res, next);
  }
);

/**
 * @openapi
 * '/api/students/{student_id}/courses':
 *  get:
 *   tags:
 *   - Student
 *   summary: Get student courses
 *   parameters:
 *    - name: student_id
 *      in: path
 *      description: The id of the student
 *      required: true
 *   responses:
 *     200:
 *       description: get student courses
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

routes.get(
  "/:student_id/courses",
  [param("student_id").isUUID()],
  validateInput,
  isAuth,
  (req: Request, res: Response, next: NextFunction) => {
    coursesRegistrationsController.getStudentCourses(req, res, next);
  }
);

/**
 * @openapi
 * '/api/students/{student_id}/subscriptions':
 *  get:
 *   tags:
 *   - Student
 *   summary: Get student subscriptions
 *   parameters:
 *    - name: student_id
 *      in: path
 *      description: The id of the student
 *      required: true
 *   responses:
 *     200:
 *       description: get student subscriptions
 *     401:
 *       description: Un Uathorized
 *     403:
 *       description: Forbidden
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error 
 */

routes.get(
  "/:student_id/subscriptions",
  [param("student_id").isUUID()],
  validateInput,
  isAuth,
  allowTo(Roles.Student, Roles.Admin),
  (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.getStudentSubscriptions(req, res, next);
  }
)

export default routes;
