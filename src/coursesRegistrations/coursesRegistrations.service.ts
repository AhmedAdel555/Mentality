import CoursesDAO from "../courses/courses.dao";
import ResponseCourseInfoDTO from "../courses/dtos/response-course-info-dto";
import ResponeStudentInfoDTO from "../user/student/dtos/respone-student-info-dto";
import StudentDAO from "../user/student/student.dao";
import StudentProgressDAO from "../studentProgress/studentProgress.dao";
import AppError from "../utils/appError";
import CoursesRegistrationsDAO from "./coursesRegistrations.dao";
import CoursesRegistrationsModel from "./coursesRegistrations.model";
import ICoursesRegistrationsServiceInterface from "./coursesRegistrationsService.interface";
import AddCourseRegistrationDTO from "./dtos/add-course-registration-dto";

class CourseRegistrationService
  implements ICoursesRegistrationsServiceInterface
{
  constructor(
    private readonly courseRegistrationDAO: CoursesRegistrationsDAO,
    private readonly courseDAO: CoursesDAO,
    private readonly studentDAO: StudentDAO,
    private readonly studentProgressDAO: StudentProgressDAO
  ) {}

  public async addCourseRegistration(
    addCourseRegistrationDTO: AddCourseRegistrationDTO
  ): Promise<void> {
    try {
      const course = await this.courseDAO.getCourseById(
        addCourseRegistrationDTO.course_id
      );
      if (!course) throw new AppError("course not found", 404);

      const student = await this.studentDAO.getStudentById(
        addCourseRegistrationDTO.user_id
      );
      if (!student) throw new AppError("student not found", 404);

      const courseRegistration = new CoursesRegistrationsModel(student, course);
      await this.courseRegistrationDAO.createCourseResgistration(
        courseRegistration
      );

      await this.studentProgressDAO.populateStudentProgressForCourse(
        courseRegistration.course.id,
        courseRegistration.student.id
      );
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getCourseStudents(
    courseId: string
  ): Promise<ResponeStudentInfoDTO[]> {
    try {
      const courseRegistration =
        await this.courseRegistrationDAO.getCourseRegistrationsForCourse(
          courseId
        );
      const students = courseRegistration.map((courseRegistration, index) => {
        return {
          id: courseRegistration.student.id,
          user_name: courseRegistration.student.user_name,
          email: courseRegistration.student.email,
          phone_number: courseRegistration.student.phone_number,
          address: courseRegistration.student.address,
          points: courseRegistration.student.points,
          profile_picture: courseRegistration.student.profile_picture,
        };
      });
      return students;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getStudentCourses(
    studentId: string
  ): Promise<ResponseCourseInfoDTO[]> {
    try {
      const courseRegistrations =
        await this.courseRegistrationDAO.getCourseRegistrationsForStudent(
          studentId
        );
      const courses = courseRegistrations.map((courseRegistration, index) => {
        return {
          id: courseRegistration.course.id,
          title: courseRegistration.course.title,
          description: courseRegistration.course.description,
          requirements: courseRegistration.course.requirements,
          level: courseRegistration.course.level,
          picture: courseRegistration.course.picture,
          instructor: {
            id: courseRegistration.course.instructor.id,
            user_name: courseRegistration.course.instructor.user_name,
            email: courseRegistration.course.instructor.email,
            title: courseRegistration.course.instructor.title,
            description: courseRegistration.course.instructor.description,
            profile_picture:
              courseRegistration.course.instructor.profile_picture,
            phone_number: courseRegistration.course.instructor.phone_number,
            address: courseRegistration.course.instructor.address,
          },
        };
      });
      return courses;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}
export default CourseRegistrationService;
