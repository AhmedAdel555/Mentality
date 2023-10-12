import CourseModel from "../courses/course.model"

class LessonModel{
  public id: string
  public title:string
  public lesson_order: number
  public course: CourseModel

  constructor(title:string, lesson_order:number, course: CourseModel){
    this.id = 'un-known';
    this.title = title;
    this.lesson_order = lesson_order;
    this.course = course;
  }
}

export default LessonModel;