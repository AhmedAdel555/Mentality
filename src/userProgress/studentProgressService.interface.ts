import UpdateStudentProgressDTO from "./dtos/update-student-progress-dto";

interface IstudentProgressServiceInterface {

  updateStudentProgress(updateStudentProgressDTO:UpdateStudentProgressDTO): Promise<void>;

}
export default IstudentProgressServiceInterface;