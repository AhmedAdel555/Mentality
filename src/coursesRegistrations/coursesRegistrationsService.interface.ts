import ResponseCourseInfoDTO from "../courses/dtos/response-course-info-dto";
import ResponeStudentInfoDTO from "../user/student/dtos/respone-student-info-dto";
import AddCourseRegistrationDTO from "./dtos/add-course-registration-dto";

interface ICoursesRegistrationsServiceInterface {
  addCourseRegistration(addCourseRegistrationDTO:AddCourseRegistrationDTO): Promise<void>;
  getCourseStudents(courseId: string): Promise<ResponeStudentInfoDTO[]>;
  getStudentCourses(studentId: string): Promise<ResponseCourseInfoDTO[]>
}
export default ICoursesRegistrationsServiceInterface;