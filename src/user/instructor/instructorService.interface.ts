import AddInstructorRequestDTO from "./dtos/add-instructor-request-dto";
import ChangeProfilePictureRequsetDTO from "../dtos/change-profile-picture-requset-dto";
import ResetPasswordRequestDTO from "../dtos/reset-password-request-dto";
import ResponseInstractorInfoDTO from "./dtos/response-instractor-info-dto";
import UpdateInstructorRequestDTO from "./dtos/update-instructor-request-dto";
import InstructorCoursesResponse from "./dtos/instructor-courses-respons-dto";

interface IInstructorService {
  // add instructor
  addInstructor(addInstructorRequestDTO: AddInstructorRequestDTO): Promise<void>;
  // get instructors
  getAllInstructors(): Promise<ResponseInstractorInfoDTO[]>;
  // get instructor
  getInstructor(id:string): Promise<ResponseInstractorInfoDTO>;
  // update instructor
  updateInstructor(updateInstructorRequestDTO:UpdateInstructorRequestDTO): Promise<void>;
  // delete instuctor
  deleteInstructor(id:string): Promise<void>;
  // show instructor courses
  getInstructorCourses(id: string): Promise<InstructorCoursesResponse[]>;
  // reset password
  resetPassword(resetPasswordRequestDTO: ResetPasswordRequestDTO): Promise<void>;
  // update profile picture
  changeProfilePicture(changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO): Promise<string>;
}
export default IInstructorService;