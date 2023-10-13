import CoursesDAO from "../courses/courses.dao";
import AppError from "../utils/appError";
import AddLessonRequestDTO from "./dtos/add-lesson-request-dto";
import LessonResponsDTO from "./dtos/lesson-respons-dto";
import UpdateLessonRequestDTO from "./dtos/update-lesson-request-dto";
import LessonDAO from "./lesson.dao";
import LessonModel from "./lesson.model";
import ILessonService from "./lesson.servise.interface";

class LessonService implements ILessonService {

  constructor(private readonly lessonDAO: LessonDAO, 
    private readonly courseDAO: CoursesDAO){};

  public async addLesson(addLessonRequestDTO: AddLessonRequestDTO): Promise<void> {
    try{
      const course = await this.courseDAO.getCourseById(addLessonRequestDTO.course_id);
      if(!course) throw new AppError("course not found", 404);
      const lessons = await this.lessonDAO.getAllLessons();
      const courseLessons = lessons.filter((lesson) => {
          return lesson.course.id === addLessonRequestDTO.course_id;
      })
      const lesson = new LessonModel(addLessonRequestDTO.title, courseLessons.length + 1, course);
      const newLesson = await this.lessonDAO.createLesson(lesson);
      if(!newLesson) throw new AppError("Opps something wrong", 500);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getCourseLessons(courseId: string): Promise<LessonResponsDTO[]> {
      try{
        const course = await this.courseDAO.getCourseById(courseId);
        if(!course) throw new AppError("course not found", 404);
        const lessons = await this.lessonDAO.getAllLessons();
        const courseLessons:LessonResponsDTO[]  = lessons.filter((lesson, index) => {
            return lesson.course.id === courseId;
        }).map((lesson, index) => {
            return {
               id: lesson.id,
               title: lesson.title,
               lesson_order: lesson.lesson_order
            }
        })
        return courseLessons;
      } catch (err) {
        throw new AppError(
          (err as AppError).message,
          (err as AppError).statusCode
        );
      }
  }

  public async getLesson(id: string): Promise<LessonResponsDTO> {
    try{
      const lesson = await this.lessonDAO.getlessonById(id);
      if(!lesson) throw new AppError("lesson not found", 404);
      return {
        id: lesson.id,
        title: lesson.title,
        lesson_order: lesson.lesson_order
      }
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  
  public async updateLesson(updateLessonRequestDTO: UpdateLessonRequestDTO): Promise<void> {
      try{
        const course = await this.courseDAO.getCourseById(updateLessonRequestDTO.course_id);
        if(!course) throw new AppError("course not found", 404);
        if(course.instructor.id !== updateLessonRequestDTO.user_id){
          throw new AppError("you can't update this course", 403);
        }
        const lesson = await this.lessonDAO.getlessonById(updateLessonRequestDTO.id);
        if(!lesson) throw new AppError("lesson not found", 404);
        lesson.title = updateLessonRequestDTO.title
        lesson.lesson_order = updateLessonRequestDTO.lesson_order
        const updatedLesson = await this.lessonDAO.updateLesson(lesson);
        if(!updatedLesson) throw new AppError(`Oops faild to update lesson`, 500);
      }catch (err) {
        throw new AppError(
          (err as AppError).message,
          (err as AppError).statusCode
        );
      }
  }

  public async deleteLesson(id: string): Promise<void> {
    try{
      const lesson = await this.lessonDAO.getlessonById(id);
      if(!lesson) throw new AppError("lesson not found", 404);
      const deletedLesson = this.lessonDAO.deleteLessonById(id);
      if(!deletedLesson) throw new AppError(`Oops faild to delete lesson`, 500);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}
export default LessonService;