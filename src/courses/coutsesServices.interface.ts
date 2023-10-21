import AddCourseRequestDTO from "./dtos/add-course-request-dto";
import DeleteCourseRequestDTO from "./dtos/delete-course-request-dto";
import ResponseCourseInfoDTO from "./dtos/response-course-info-dto";
import UpdateCoursePictureRequest from "./dtos/update-course-picture-dto";
import UpdateCourseRequestDTO from "./dtos/update-course-request-dto";

interface ICoursesServices {
  addCourse(addCourseRequest: AddCourseRequestDTO): Promise<void> 
  getAllCourses(): Promise<ResponseCourseInfoDTO[]>;
  getCourse(id: string): Promise<ResponseCourseInfoDTO>;
  updateCourse(updateCourseRequest: UpdateCourseRequestDTO): Promise<void>;
  updateCoursePicture(updateCoursePictureRequest:UpdateCoursePictureRequest): Promise<string>;
  deleteCourse(deleteCourseRequestDTO: DeleteCourseRequestDTO) : Promise<void>;
}

export default ICoursesServices;