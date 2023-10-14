import CourseModel from "../courses/course.model";
import StudentModel from "../user/student/student.model";

class CoursesRegistrationsModel { 
    public id: string
    public student: StudentModel
    public course: CourseModel
    public course_progress: number

    constructor(student: StudentModel, course: CourseModel){
      this.id = 'un-known';
      this.student = student;
      this.course = course;
      this.course_progress = 0;
    }

}
export default CoursesRegistrationsModel;