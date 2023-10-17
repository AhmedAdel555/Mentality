import { Request, Response, NextFunction } from "express";
import LessonService from "./lesson.service";
import LessonDAO from "./lesson.dao";
import CoursesDAO from "../courses/courses.dao";

class LessonController{
  constructor(private readonly lessonService: LessonService){};

  public async addLesson(req: Request, res: Response, next: NextFunction){
      try{
        await this.lessonService.addLesson({...req.body, course_id: req.params.course_id})
        res.status(201).json({status: "success", data: null});
      }catch(error){
        next(error)
      }
  }

  public async getCourseLessons(req: Request, res: Response, next: NextFunction){
    try{
      const lessons = await this.lessonService.getCourseLessons(req.params.course_id);
      res.status(200).json({status: "success", data: lessons});
    }catch(error){
      next(error)
    }
  }

  public async getLesson(req: Request, res: Response, next: NextFunction){
    try{
      const lesson = await this.lessonService.getLesson(req.params.lesson_id);
      res.status(200).json({status: "success", data: lesson});
    }catch(error){
      next(error)
    }
  }

  public async updateLesson(req: Request, res: Response, next: NextFunction){
    try{
      await this.lessonService.updateLesson({...req.body, id: req.params.lesson_id, course_id: req.params.course_id});
      res.status(200).json({status: "success", data: null});
    }catch(error){
      next(error)
    }
  }

  public async deleteLesson(req: Request, res: Response, next: NextFunction){
    try{
      await this.lessonService.deleteLesson({...req.body,id:req.params.lesson_id, course_id: req.params.course_id});
      res.status(200).json({status: "success", data: null});
    }catch(error){
      next(error)
    }
  }
}
export default new LessonController(new LessonService(new LessonDAO(), new CoursesDAO()));