import CourseModel from "../courses/course.model";
import StudentModel from "../user/student/student.model";

class RatesModel {
  public id:string;
  public student: StudentModel;
  public course: CourseModel;
  public rate: number
  constructor(student: StudentModel, course: CourseModel, rate:number){
    this.id = 'un-known';
    this.student = student;
    this.course = course;
    this.rate = rate;
  }
}
export default RatesModel;