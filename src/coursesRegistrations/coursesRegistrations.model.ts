import CourseModel from "../courses/course.model";
import StudentModel from "../user/student/student.model";

class CoursesRegistrationsModel { 
    public id: string
    public student: StudentModel
    public course: CourseModel
    public course_progress: number

    constructor(student: StudentModel, course: CourseModel, course_progress: number){
      this.id = 'un-known';
      this.student = student;
      this.course = course;
      this.course_progress = course_progress;
    }

}
export default CoursesRegistrationsModel;