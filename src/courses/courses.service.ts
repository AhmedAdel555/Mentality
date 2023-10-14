import CoursesRegistrationsDAO from "../coursesRegistrations/coursesRegistrations.dao";
import InstructorDAO from "../user/instructor/instructor.dao";
import ResponeStudentInfoDTO from "../user/student/dtos/respone-student-info-dto";
import AppError from "../utils/appError";
import CourseModel from "./course.model";
import CoursesDAO from "./courses.dao";
import ICoursesServices from "./coutsesServices.interface";
import AddCourseRequestDTO from "./dtos/add-course-request-dto";
import DeleteCourseRequestDTO from "./dtos/delete-course-request-dto";
import ResponseCourseInfoDTO from "./dtos/response-course-info-dto";
import UpdateCoursePictureRequest from "./dtos/update-course-picture-dto";
import UpdateCourseRequestDTO from "./dtos/update-course-request-dto";
import fs from "node:fs";
import path from "path";

class CoursesService implements ICoursesServices {
  constructor(private readonly coursesDAO: CoursesDAO, 
              private readonly instructorDAO: InstructorDAO,
              private readonly courseRegistrationDAO: CoursesRegistrationsDAO) {}
  
  public async getCourseUsers(id: string): Promise<ResponeStudentInfoDTO[]> {
    try{
      const courseRegistrations = await this.courseRegistrationDAO.getAllCourseRegistrations();
      const users = courseRegistrations.filter((courseRegistration, index) => {
          return courseRegistration.course.id === id
      }).map((courseRegistration, index) => {
        return {
          id: courseRegistration.student.id,
          user_name: courseRegistration.student.user_name,
          email: courseRegistration.student.email,
          profile_picture: courseRegistration.student.profile_picture,
          phone_number: courseRegistration.student.phone_number,
          address: courseRegistration.student.address,
          points: courseRegistration.student.points,
        }
      })

      return users;
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async addCourse(addCourseRequest: AddCourseRequestDTO): Promise<void> {
    try {
      if (!addCourseRequest.picture) throw new AppError("course picture is required", 404);
      const instructor = await this.instructorDAO.getInstructorById(addCourseRequest.user_id);
      if(!instructor) throw new AppError("Instructor not found", 404);
      const course: CourseModel = new CourseModel(
        addCourseRequest.title,
        addCourseRequest.description,
        addCourseRequest.requirements,
        addCourseRequest.level,
        `/uploads/banners/${addCourseRequest.picture}`,
        instructor
      );
      const newCourse = await this.coursesDAO.createCourse(course);
      if (!newCourse) throw new AppError("Oops problem when create course", 500);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getAllCourses(): Promise<ResponseCourseInfoDTO[]> {
    try {
      const coursesFromDB = await this.coursesDAO.getAllCourses();
      const courses: ResponseCourseInfoDTO[] = coursesFromDB.map((course, index) => {
        return {
          id: course.id, 
          title: course.title,
          description: course.description,
          requirements: course.requirements,
          level: course.level,
          picture: course.picture,
          instructor: {
            id : course.instructor.id,
            user_name: course.instructor.user_name,
            email: course.instructor.email,
            title : course.instructor.title,
            description : course.instructor.description,
            profile_picture : course.instructor.profile_picture,
            phone_number : course.instructor.phone_number,
            address : course.instructor.address
          }
        };
      })
      return courses
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  

  public async getCourse(id: string): Promise<ResponseCourseInfoDTO> {
    try {
      const courseFromDB = await this.coursesDAO.getCourseById(id);
      if (!courseFromDB) throw new AppError(`course not found`, 404);
      const course: ResponseCourseInfoDTO = {
        id: courseFromDB.id, 
        title: courseFromDB.title,
        description: courseFromDB.description,
        requirements: courseFromDB.requirements,
        level: courseFromDB.level,
        picture: courseFromDB.picture,
        instructor: {
          id : courseFromDB.instructor.id,
          user_name: courseFromDB.instructor.user_name,
          email: courseFromDB.instructor.email,
          title : courseFromDB.instructor.title,
          description : courseFromDB.instructor.description,
          profile_picture : courseFromDB.instructor.profile_picture,
          phone_number : courseFromDB.instructor.phone_number,
          address : courseFromDB.instructor.address
        }
      };
      return course;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async updateCourse(updateCourseRequest: UpdateCourseRequestDTO): Promise<void> {
    try {
      const course = await this.coursesDAO.getCourseById(updateCourseRequest.id);
      if (!course) throw new AppError(`course not found`, 404);
      if (updateCourseRequest.user_id !== course.instructor.id) {
        throw new AppError("you can't update this course", 403);
      }
      course.title = updateCourseRequest.title;
      course.description = updateCourseRequest.description;
      course.requirements = updateCourseRequest.requirements;
      course.level = updateCourseRequest.level;
      const updatedCourse = await this.coursesDAO.updateCourse(course);
      if (!updatedCourse) throw new AppError(`Oops faild to update course`, 500);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async updateCoursePicture(updateCoursePictureRequest:UpdateCoursePictureRequest): Promise<string>{
    try{
      if (!updateCoursePictureRequest.picture) throw new AppError("course picture is required", 404);
      const course = await this.coursesDAO.getCourseById(updateCoursePictureRequest.id);
      if (!course) throw new AppError(`course not found`, 404);
      if (updateCoursePictureRequest.user_id !== course.instructor.id) {
        throw new AppError("you can't update this course", 403);
      }
      const filePath = path.join(
        __dirname,
        "../..",
        course.picture
      );
      this.deleteFile(path.join(filePath));

      course.picture = `/uploads/banners/${updateCoursePictureRequest.picture}`;
      const updatedCourse = await this.coursesDAO.updateCourse(course);
      if (!updatedCourse) throw new AppError(`Oops faild to update course`, 500);
      return updatedCourse.picture
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async deleteCourse(deleteCourseRequestDTO: DeleteCourseRequestDTO) : Promise<void> {
    try {
      const course = await this.coursesDAO.getCourseById(deleteCourseRequestDTO.id);
      if (!course) throw new AppError(`course not found`, 404);
      if (deleteCourseRequestDTO.user_id !== course.instructor.id) {
        throw new AppError("you can't delete this course", 403);
      }
      const deletedCourse = await this.coursesDAO.deleteCourseById(deleteCourseRequestDTO.id);
      if (!deletedCourse) throw new AppError(`Oops faild to update course`, 500);
      const filePath = path.join(
        __dirname,
        "../..",
        course.picture
      );
      this.deleteFile(path.join(filePath));
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  private deleteFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File deleted successfully");
      });
    } else {
      console.log("File not found");
    }
  }
}
export default CoursesService;
