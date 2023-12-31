import { NextFunction, Router, Request, Response } from "express";
import CoursesContoller from "../../courses/courses.controller";
import coursesRegistrationsController from "../../coursesRegistrations/coursesRegistrations.controller";
import studentProgressController from "../../studentProgress/studentProgress.controller";
import lessonController from "../../lessons/lesson.controller";
import topicsContoller from "../../topics/topics.contoller";
import { body, param } from "express-validator";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import uploadCoursesbanners from "../../utils/uploadCoursesBanners";
import Levels from "../../courses/levels.enum";
import validateInput from "../../middlewares/validateInput";
import validateFileUpload from "../../middlewares/validateFileUpload";
import Roles from "../../utils/roles.enum";
import Topics from "../../topics/topics.enum";
const routes = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     addCourseRequest:
 *       type: object
 *       required:
 *         - picture
 *         - title
 *         - level
 *         - description
 *         - requirements
 *       properties:
 *         picture: 
 *           type: file
 *         title: 
 *           type: string
 *         level:
 *           type:  string
 *           enum:
 *            - beginner
 *            - intermediate
 *            - expert
 *         description:
 *           type:  string
 *         requirements:
 *           type:  string
 *     updateCourseRequest:
 *       type: object
 *       required:
 *         - title
 *         - level
 *         - description
 *         - requirements
 *       properties:
 *         title: 
 *           type: string
 *         level:
 *           type:  string
 *           enum:
 *            - beginner
 *            - intermediate
 *            - expert
 *         description:
 *           type:  string
 *         requirements:
 *           type:  string
 *     updateCoursePicture:
 *       type: object
 *       required:
 *         - picture
 *       properties:
 *         picture: 
 *           type: file
 *     addLessonToCourse:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title: 
 *           type: string
 *     updateLesson:
 *       type: object
 *       required:
 *         - title
 *         - lesson_order
 *       properties:
 *         title: 
 *           type: string
 *         lesson_order:
 *           type: integer
 *     addTopicRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - points
 *         - pricing_plan_id
 *         - content_url
 *         - topic_type
 *       properties:
 *         title: 
 *           type: string
 *         description:
 *           type: string
 *         points:
 *           type: integer  
 *         pricing_plan_id:
 *           type: integer
 *         content_url:
 *            - type: string
 *            - type: null 
 *         topic_type:
 *           type: string
 *           enum:
 *            - tutorial
 *            - task
 *            - exam
 *     updateTopicRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - topic_order
 *         - points
 *         - pricing_plan_id
 *         - content_url
 *         - topic_type
 *       properties:
 *         title: 
 *           type: string
 *         description:
 *           type: string
 *         points:
 *           type: integer  
 *         topic_order:
 *           type: integer
 *         pricing_plan_id:
 *           type: integer
 *         content_url:
 *            - type: string
 *            - type: null 
 *         topic_type:
 *           type: string
 *           enum:
 *            - tutorial
 *            - task
 *            - exam
 *     finishTopic:
 *       type: object
 *       required:
 *         - task_solution
 *       properties:
 *         task_solution: 
 *           oneOf:
 *            - type: string
 *            - type: null 
 *     addGrade:
 *       type: object
 *       required:
 *         - student_id
 *         - grade
 *       properties:
 *         grade: 
 *           type: integer
 *         student_id:
 *           type: string  
 */

/**
 * @openapi
 * '/api/courses':
 *  post:
 *   tags:
 *   - Courses
 *   summary: add course
 *   requestBody:
 *     required: true
 *     content:
 *       multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/addCourseRequest'
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
 *   - Courses
 *   summary: get all courses
 *   responses:
 *     200:
 *       description: get all courses
 *     500:
 *       description: server error
 */
routes
  .route("/")
  .post(
    uploadCoursesbanners.single("picture"),
    validateFileUpload,
    [
      body("title").trim().notEmpty(),
      body("description").trim().notEmpty().isLength({ min: 10 }),
      body("level").isIn(Object.values(Levels)),
      body("requirements").trim().notEmpty().isLength({ min: 10 }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.createCourse(req, res, next);
    }
  )
  .get((req: Request, res: Response, next: NextFunction) => {
    CoursesContoller.getAllCourses(req, res, next);
  });

/**
 * @openapi
 * '/api/courses/{course_id}':
 *  get:
 *   tags:
 *   - Courses
 *   summary: get course
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *   responses:
 *     200:
 *       description: get course
 *     400: 
 *       description: bad request
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error
 *  patch:
 *   tags:
 *   - Courses
 *   summary: update course
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/updateCourseRequest'
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
 *   - Courses
 *   summary: delete course
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
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
  .route("/:course_id")
  .get(
    [param("course_id").isUUID()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.getCourse(req, res, next);
    }
  )
  .patch(
    [
      param("course_id").isUUID(),
      body("title").trim().notEmpty(),
      body("description").trim().notEmpty().isLength({ min: 10 }),
      body("level").isIn(Object.values(Levels)),
      body("requirements").trim().notEmpty().isLength({ min: 10 }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.updateCourse(req, res, next);
    }
  )
  .delete(
    [param("course_id").isUUID()],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.deleteCourse(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/courses/{course_id}/change-picture':
 *  patch:
 *   tags:
 *   - Courses
 *   summary: change course picture
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/updateCoursePicture'
 *   responses:
 *     200:
 *       description: get course
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
  "/:course_id/change-picture",
  uploadCoursesbanners.single("picture"),
  validateFileUpload,
  [param("course_id").isUUID()],
  validateInput,
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    CoursesContoller.updateCoursePicture(req, res, next);
  }
);

// course registration

/**
 * @openapi
 * '/api/courses/{course_id}/register':
 *  post:
 *   tags:
 *   - Courses
 *   summary: register in course
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
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
 */

routes.post(
  "/:course_id/register",
  [param("course_id").isUUID()],
  validateInput,
  isAuth,
  allowTo(Roles.Student),
  (req: Request, res: Response, next: NextFunction) => {
    coursesRegistrationsController.addCoursesRegistration(req, res, next);
  }
);

/**
 * @openapi
 * '/api/courses/{course_id}/students':
 *  get:
 *   tags:
 *   - Courses
 *   summary: get all student courses
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *   responses:
 *     200:
 *       description: get all student courses 
 *     400: 
 *       description: bad request
 *     401: 
 *       description: Un Uathorized
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error
 */

routes.get(
  "/:course_id/students",
  [param("course_id").isUUID()],
  validateInput,
  isAuth,
  (req: Request, res: Response, next: NextFunction) => {
    coursesRegistrationsController.getCourseStudents(req, res, next);
  }
);

// lessons routes
/**
 * @openapi
 * '/api/courses/{course_id}/lessons':
 *  get:
 *   tags:
 *   - lessons
 *   summary: get all course lessons
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *   responses:
 *     200:
 *       description: get all course lessons 
 *     400: 
 *       description: bad request
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error
 *  post:
 *   tags:
 *   - lessons
 *   summary: add lesson
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addLessonToCourse'
 *   responses:
 *     201:
 *       description: created 
 *     400: 
 *       description: bad request
 *     401: 
 *       description: Un Uathorized
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error
 */
routes
  .route("/:course_id/lessons")
  .get(
    [param("course_id").isUUID()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      lessonController.getCourseLessons(req, res, next);
    }
  )
  .post(
    [body("title").trim().notEmpty(), param("course_id").isUUID()],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      lessonController.addLesson(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/courses/{course_id}/lessons/{lesson_id}':
 *  get:
 *   tags:
 *   - lessons
 *   summary: get lesson by id
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *   responses:
 *     200:
 *       description: get all course lessons 
 *     400: 
 *       description: bad request
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error
 *  patch:
 *   tags:
 *   - lessons
 *   summary: update lesson
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/updateLesson'
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
 *   - lessons
 *   summary: delete lesson
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
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
  .route("/:course_id/lessons/:lesson_id")
  .get(
    [param("course_id").isUUID(), param("lesson_id").isUUID()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      lessonController.getLesson(req, res, next);
    }
  )
  .patch(
    [
      param("course_id").isUUID(),
      param("lesson_id").isUUID(),
      body("title").trim().notEmpty(),
      body("lesson_order").custom((value, { req }) => {
        return typeof value === "number";
      }),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      lessonController.updateLesson(req, res, next);
    }
  )
  .delete(
    [param("course_id").isUUID(), param("lesson_id").isUUID()],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      lessonController.deleteLesson(req, res, next);
    }
  );

// topics routes

/**
 * @openapi
 * '/api/courses/{course_id}/lessons/{lesson_id}/topics':
 *  post:
 *   tags:
 *   - topics
 *   summary: add topic
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addTopicRequest'
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
 *   - topics
 *   summary: get all lesson topics
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *   responses:
 *     200:
 *       description: get all lessons topics
 *     400: 
 *       description: bad request
 *     404: 
 *       description: Not found
 *     500:
 *       description: server error
 */

routes
  .route("/:course_id/lessons/:lesson_id/topics")
  .post(
    [
      param("course_id").isUUID(),
      param("lesson_id").isUUID(),
      body("title").trim().notEmpty(),
      body("description").trim().notEmpty(),
      body("points").custom((value, { req }) => {
        return typeof value === "number";
      }),
      body("pricing_plan_id").custom((value, { req }) => {
        return typeof value === "number";
      }),
      body("content_url").custom((value, { req }) => {
        return value === null || typeof value === "string"
      }),
      body("topic_type").isIn(Object.values(Topics))
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      topicsContoller.addTopic(req, res, next);
    }
  )
  .get(
    [param("course_id").isUUID(), param("lesson_id").isUUID()],
    validateInput,
    (req: Request, res: Response, next: NextFunction) => {
      topicsContoller.getAllLessonTopics(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/courses/{course_id}/lessons/{lesson_id}/topics/{topic_id}':
 *  get:
 *   tags:
 *   - topics
 *   summary: get topic
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *    - name: topic_id
 *      in: path
 *      description: The id of the topic
 *      required: true
 *   responses:
 *     200:
 *       description: get all topic
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
 *  patch:
 *   tags:
 *   - topics
 *   summary: update the topic
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *    - name: topic_id
 *      in: path
 *      description: The id of the topic
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/updateTopicRequest'
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
 *   - topics
 *   summary: delete topic
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *    - name: topic_id
 *      in: path
 *      description: The id of the topic
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
  .route("/:course_id/lessons/:lesson_id/topics/:topic_id")
  .get(
    [
      param("course_id").isUUID(),
      param("lesson_id").isUUID(),
      param("topic_id").isUUID(),
    ],
    validateInput,
    isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      topicsContoller.getTopic(req, res, next);
    }
  )
  .patch(
    [
      param("course_id").isUUID(),
      param("lesson_id").isUUID(),
      param("topic_id").isUUID(),
      body("title").trim().notEmpty(),
      body("description").trim().notEmpty(),
      body("topic_order").custom((value, { req }) => {
        return typeof value === "number";
      }),
      body("points").custom((value, { req }) => {
        return typeof value === "number";
      }),
      body("pricing_plan_id").custom((value, { req }) => {
        return typeof value === "number";
      }),
      body("content_url").custom((value, { req }) => {
        return value === null || typeof value === "string"
      }),
      body("topic_type").isIn(Object.values(Topics)),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      topicsContoller.updateTopic(req, res, next);
    }
  )
  .delete(
    [
      param("course_id").isUUID(),
      param("lesson_id").isUUID(),
      param("topic_id").isUUID(),
    ],
    validateInput,
    isAuth,
    allowTo(Roles.Instructor),
    (req: Request, res: Response, next: NextFunction) => {
      topicsContoller.deleteTopic(req, res, next);
    }
  );

/**
 * @openapi
 * '/api/courses/{course_id}/lessons/{lesson_id}/progress':
 *  get:
 *   tags:
 *   - topics
 *   summary: get progress of topics
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *   responses:
 *     200:
 *       description: get all topic
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
  "/:course_id/lessons/:lesson_id/progress",
  [param("course_id").isUUID(), param("lesson_id").isUUID()],
  validateInput,
  isAuth,
  allowTo(Roles.Student),
  (req: Request, res: Response, next: NextFunction) => {
    studentProgressController.getStudentLessonProgress(req, res, next);
  }
);

/**
 * @openapi
 * '/api/courses/{course_id}/lessons/{lesson_id}/topics/{topic_id}/finished-topic':
 *  patch:
 *   tags:
 *   - topics
 *   summary: student finish topic 
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *    - name: topic_id
 *      in: path
 *      description: The id of the topic
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/finishTopic'
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
  "/:course_id/lessons/:lesson_id/topics/:topic_id/finished-topic",
  [
    param("course_id").isUUID(),
    param("lesson_id").isUUID(),
    param("topic_id").isUUID(),
    body("task_solution").custom((value, { req }) => {
      return value === null || typeof value === "string";
    }),
  ],
  validateInput,
  isAuth,
  allowTo(Roles.Student),
  (req: Request, res: Response, next: NextFunction) => {
    studentProgressController.finishTopic(req, res, next);
  }
);

/**
 * @openapi
 * '/api/courses/{course_id}/tasks-submissions':
 *  get:
 *   tags:
 *   - topics
 *   summary: get all tasks submissions
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *   responses:
 *     200:
 *       description: get all topic
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
  "/:course_id/tasks-submissions",
  [param("course_id").isUUID()],
  validateInput,
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    studentProgressController.getAllCourseTasksSubmissions(req, res, next);
  }
);

/**
 * @openapi
 * '/api/courses/{course_id}/lessons/{lesson_id}/topics/{topic_id}/grade':
 *  patch:
 *   tags:
 *   - topics
 *   summary: grade the task
 *   parameters:
 *    - name: course_id
 *      in: path
 *      description: The id of the course
 *      required: true
 *    - name: lesson_id
 *      in: path
 *      description: The id of the lesson
 *      required: true
 *    - name: topic_id
 *      in: path
 *      description: The id of the topic
 *      required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/addGrade'
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
  "/:course_id/lessons/:lesson_id/topics/:topic_id/grade",
  [
    param("course_id").isUUID(),
    param("lesson_id").isUUID(),
    param("topic_id").isUUID(),
    body("student_id").isUUID(),
    body("grade").custom((value, { req }) => {
      return typeof value === "number";
    }),
  ],
  validateInput,
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    studentProgressController.gradeTask(req, res, next);
  }
);

export default routes;
