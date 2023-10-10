import AllCoursesDataRespose from "../../courses/dtos/all-courses-data-respose";
import AddInstructorRequestDTO from "./dtos/add-instructor-request-dto";
import ChangeProfilePictureRequsetDTO from "./dtos/change-profile-picture-requset-dto";
import ResetPasswordRequestDTO from "./dtos/reset-password-request-dto";
import ResponseAllInstractorsDTO from "./dtos/response-all-instractors-dto";
import ResponseInstractorInfoDTO from "./dtos/response-instractor-info-dto";
import UpdateInstructorRequestDTO from "./dtos/update-instructor-request-dto";

interface IInstructorService {
  // add instructor
  addInstructor(addInstructorRequestDTO: AddInstructorRequestDTO): Promise<void>;
  // get instructors
  getAllInstructors(): Promise<ResponseAllInstractorsDTO[]>;
  // get instructor
  getInstructor(id:string): Promise<ResponseInstractorInfoDTO>;
  // update instructor
  updateInstructor(updateInstructorRequestDTO:UpdateInstructorRequestDTO): Promise<void>;
  // delete instuctor
  deleteInstructor(id:string): Promise<void>;
  // show instructor courses
  getInstructorCourses(id: string): Promise<AllCoursesDataRespose[]>;
  // reset password
  resetPassword(resetPasswordRequestDTO: ResetPasswordRequestDTO): Promise<void>;
  // update profile picture
  changeProfilePicture(changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO): Promise<string>;
}
export default IInstructorService;