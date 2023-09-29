import { NextFunction, Router, Request, Response } from "express";
import CoursesContoller from "../../courses/courses.controller";
import { body, param } from "express-validator";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
import multer from "multer";
import path from "path";
import Levels from "../../courses/levels.enum";
import validateResult from "../../middlewares/validateResulte";
const routes = Router();

const diskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "..", "..", "uploads", "banners"));
  },
  filename: function (_req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(new Error("file type not resolved"));
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
});

routes
  .route("/")
  .post(
    upload.single("banner"),
    [
      body("title").trim().notEmpty(),
      body("description").trim().notEmpty().isLength({ min: 10 }),
      body("level").isIn(Object.values(Levels)),
      body("requirements").trim().notEmpty().isLength({ min: 10 }),
    ],
    validateResult,
    isAuth,
    allowTo("Instructor"),
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.createCourse(
        req,
        res,
        next
      );
    }
  )
  .get((req: Request, res: Response, next: NextFunction) => {
    CoursesContoller.getAllCourses(
      req,
      res,
      next
    );
  });

routes
  .route("/:courseId")
  .get(
    param("courseId").isUUID(),
    validateResult,
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.getCourse(
        req,
        res,
        next
      );
    }
  )
  .put(
    [
      param("courseId").isUUID(),
      body("title").trim().notEmpty(),
      body("description").trim().notEmpty().isLength({ min: 10 }),
      body("level").isIn(Object.values(Levels)),
      body("requirements").trim().notEmpty().isLength({ min: 10 }),
    ],
    validateResult,
    isAuth,
    allowTo("Instractor", "Admin"),
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.updateCourse(
        req,
        res,
        next
      );
    }
  )
  .delete(
    param("courseId").isUUID(),
    validateResult,
    isAuth,
    allowTo("Instructor", "Admin"),
    (req: Request, res: Response, next: NextFunction) => {
      CoursesContoller.deleteCourse(
        req,
        res,
        next
      );
    }
  );

export default routes;
