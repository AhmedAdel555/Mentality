import ChangeProfilePictureRequsetDTO from "./dtos/change-profile-picture-requset-dto";
import ResetPasswordRequestDTO from "./dtos/reset-password-request-dto";
import ResponeStudentInfoDTO from "./dtos/respone-student-info-dto";
import ResponseAllStudentsDTO from "./dtos/response-all-students-dto";
import UpdateStudentInfoDTO from "./dtos/update-student-info-dto";

interface IStudentService {
  getAllStudents(): Promise<ResponseAllStudentsDTO[]>;
  getStudent(id: string): Promise<ResponeStudentInfoDTO>;
  updateStudent(updateStudentInfoDTO:UpdateStudentInfoDTO) : Promise<void>;
  resetPassword(resetPasswordRequestDTO: ResetPasswordRequestDTO): Promise<void>;
  changeProfilePicture(changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO): Promise<string>;
  deleteStudent(id:string): Promise<void>;
}
export default IStudentService;