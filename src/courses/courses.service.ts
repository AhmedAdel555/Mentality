import CoursesDAO from "./courses.dao";
import AddCourseRequestDTO from "./dtos/add-course-request-dto";
import AddUpdateCourseModelDTO from "./dtos/add-update-course-model-dto";
import AllCoursesDataRespose from "./dtos/all-courses-data-respose";
import ResponseCourseDTO from "./dtos/response-courses-dto";
import UpdateCourseRequestDTO from "./dtos/update-course-request-dto";

class CoursesService {
  constructor(private readonly coursesDAO: CoursesDAO) {}

  public async createCourse(addCourseRequest: AddCourseRequestDTO) {
    try {
      if (!addCourseRequest.picture) {
        throw new Error("course picture is required");
      }
      const course: AddUpdateCourseModelDTO = {
        title: addCourseRequest.title,
        description: addCourseRequest.description,
        requirements: addCourseRequest.requirements,
        instructor_id: addCourseRequest.userId,
        level: addCourseRequest.level,
        picture: `/uploads/banners/${addCourseRequest.picture}`,
      };
      const newCourse = await this.coursesDAO.createCourse(course);
      if (!newCourse) {
        throw new Error("there is a problem -> can't create course");
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  public async getAllCourses(): Promise<AllCoursesDataRespose[]> {
    try {
      return this.coursesDAO.getAllCourses();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  public async getCourse(id: string): Promise<ResponseCourseDTO> {
    try {
      const courseFromDB = await this.coursesDAO.getCourse(id);
      if (!courseFromDB) throw new Error(`faild to get course check id: ${id}`);
      const course = {
        id: courseFromDB.id,
        title: courseFromDB.title,
        description: courseFromDB.description,
        instructor: {
          id: courseFromDB.instructor_id,
          userName: courseFromDB.instructor_user_name,
          title: courseFromDB.title,
          description: courseFromDB.instructor_description,
          profilePicture: courseFromDB.instructor_profile_picture,
        },
        level: courseFromDB.level_name,
        requirements: courseFromDB.requirements,
        picture: courseFromDB.picture,
      };
      return course;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  public async updateCourse(updateCourseRequest: UpdateCourseRequestDTO) {
    try {
      if (updateCourseRequest.userRole === "Instractor") {
        const instructorId = (await this.getCourse(updateCourseRequest.id))
          .instructor.id;
        if (updateCourseRequest.userId !== instructorId) {
          throw new Error("this is not your course you can not update course");
        }
      }
      const course: AddUpdateCourseModelDTO = {
        id: updateCourseRequest.id,
        title: updateCourseRequest.title,
        description: updateCourseRequest.description,
        requirements: updateCourseRequest.requirements,
        instructor_id: updateCourseRequest.userId,
        level: updateCourseRequest.level,
        picture: "",
      };
      const updatedCourse = await this.coursesDAO.updateCourse(course);
      if (!updatedCourse)
        throw new Error(
          `faild to update course check id: ${updateCourseRequest.id}`
        );
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  public async deleteCourse(id: string, userId: string, userRole: string) {
    try {
      if (userRole === "instructor") {
        const instructorId = (await this.getCourse(id)).instructor.id;
        if (userId !== instructorId) {
          throw new Error("this is not your course you can not delete course");
        }
      }
      const deletedCourse = await this.coursesDAO.deleteCourse(id);
      if (!deletedCourse)
        throw new Error(`faild to delete course check id: ${id}`);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
export default CoursesService;
