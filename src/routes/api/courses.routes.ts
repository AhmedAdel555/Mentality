import { NextFunction, Router, Request, Response } from "express";
import CoursesContoller from "../../courses/courses.controller";
import lessonController from "../../lessons/lesson.controller";
import { body, param } from "express-validator";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import uploadCoursesbanners from "../../utils/uploadCoursesBanners";
import Levels from "../../courses/levels.enum";
import validateInput from "../../middlewares/validateInput";
import validateFileUpload from "../../middlewares/validateFileUpload";
import Roles from "../../utils/roles.enum";
const routes = Router();

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
  )

routes.patch('/:course_id/change-picture',
  uploadCoursesbanners.single("picture"),
  validateFileUpload,
  [param("course_id").isUUID()],
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    CoursesContoller.updateCoursePicture(req, res, next);
  }
)

// lessons routes
routes
.route('/:course_id/lessons')
.get([
  param("course_id").isUUID()
],
validateInput,
(req: Request, res: Response, next: NextFunction) => {
  lessonController.getCourseLessons(req, res, next);
}
).post(
  [
    body("title").trim().notEmpty(),
    param("course_id").isUUID()
  ],
  validateInput,
  isAuth,
  allowTo(Roles.Instructor),
  (req: Request, res: Response, next: NextFunction) => {
    lessonController.addLesson(req, res, next);
  }
)

routes
.route('/:course_id/lessons/:lesson_id')
.get([
  param("course_id").isUUID(),
  param("lesson_id").isUUID()
],
validateInput,
(req: Request, res: Response, next: NextFunction) => {
  lessonController.getLesson(req, res, next);
}
)
.patch([
  param("course_id").isUUID(),
  param("lesson_id").isUUID(),
  body("title").trim().notEmpty(),
  body("lesson_order").custom((value, {req}) => {
    return (typeof value === 'number')
  })
],
validateInput,
isAuth,
allowTo(Roles.Instructor),
(req: Request, res: Response, next: NextFunction) => {
  lessonController.updateLesson(req, res, next);
})
.delete([
  param("course_id").isUUID(),
  param("lesson_id").isUUID(),
],
validateInput,
isAuth,
allowTo(Roles.Instructor),
(req: Request, res: Response, next: NextFunction) => {
  lessonController.deleteLesson(req, res, next);
})
export default routes;
