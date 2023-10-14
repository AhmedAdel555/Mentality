import CoursesDAO from "../courses/courses.dao";
import StudentDAO from "../user/student/student.dao";
import AppError from "../utils/appError";
import CoursesRegistrationsDAO from "./coursesRegistrations.dao";
import CoursesRegistrationsModel from "./coursesRegistrations.model";
import ICoursesRegistrationsServiceInterface from "./coursesRegistrationsService.interface";
import AddCourseRegistrationDTO from "./dtos/add-course-registration-dto";

class CourseRegistrationService implements ICoursesRegistrationsServiceInterface {
  constructor(private readonly courseRegistrationDAO: CoursesRegistrationsDAO,
              private readonly courseDAO: CoursesDAO,
              private readonly studentDAO: StudentDAO){};

  public async addCourseRegistration(addCourseRegistrationDTO: AddCourseRegistrationDTO): Promise<void> {
    try{
      const course = await this.courseDAO.getCourseById(addCourseRegistrationDTO.course_id);
      if(!course) throw new AppError("course not found", 404);
      const student = await this.studentDAO.getStudentById(addCourseRegistrationDTO.user_id);
      if(!student) throw new AppError("student not found", 404);
      const courseRegistration = new CoursesRegistrationsModel(student, course);
      const newCourseRegistration = await this.courseRegistrationDAO.createCourseResgistration(courseRegistration);
      if(!newCourseRegistration) throw new AppError("Oops error", 500);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}
export default CourseRegistrationService;