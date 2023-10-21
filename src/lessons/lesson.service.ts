import CoursesDAO from "../courses/courses.dao";
import AppError from "../utils/appError";
import AddLessonRequestDTO from "./dtos/add-lesson-request-dto";
import DeleteLessonRequestDTO from "./dtos/delete-lesson-request-dto";
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

      const count = await this.lessonDAO.getCountLessonInCourse(addLessonRequestDTO.course_id);
    
      const lesson = new LessonModel(addLessonRequestDTO.title, count + 1, course);
      await this.lessonDAO.createLesson(lesson);

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

        const lessons = await this.lessonDAO.getAllCourseLessons(courseId);

        const courseLessons:LessonResponsDTO[]  = lessons.map((lesson, index) => {
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
        const lesson = await this.lessonDAO.getlessonById(updateLessonRequestDTO.lesson_id);
        if(!lesson) throw new AppError("lesson not found", 404);

        if(lesson.course.instructor.id  !== updateLessonRequestDTO.user_id){
          throw new AppError("you can't update this course", 403);
        }

        lesson.title = updateLessonRequestDTO.title
        lesson.lesson_order = updateLessonRequestDTO.lesson_order

        await this.lessonDAO.updateLesson(lesson);

      }catch (err) {
        throw new AppError(
          (err as AppError).message,
          (err as AppError).statusCode
        );
      }
  }

  public async deleteLesson(deleteLessonRequestDTO:DeleteLessonRequestDTO): Promise<void> {
    try{
      const lesson = await this.lessonDAO.getlessonById(deleteLessonRequestDTO.lesson_id);
      if(!lesson) throw new AppError("lesson not found", 404);

      if(lesson.course.instructor.id !== deleteLessonRequestDTO.user_id){
        throw new AppError('you do not have permmision to do this', 403);
      }

      await this.lessonDAO.deleteLessonById(lesson.id);
      
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}
export default LessonService;