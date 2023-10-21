import AppError from "../utils/appError";
import UpdateStudentProgressDTO from "./dtos/update-student-progress-dto";
import StudentProgressDAO from "./studentProgress.dao";
import IstudentProgressServiceInterface from "./studentProgressService.interface";

class StudentProgressService implements IstudentProgressServiceInterface {

 constructor(private readonly studentProgressDAO: StudentProgressDAO){};
 
 public async updateStudentProgress(updateStudentProgressDTO: UpdateStudentProgressDTO): Promise<void> {
      try{
        const studentProgress = await this.studentProgressDAO.getStudentProgress(updateStudentProgressDTO.user_id, updateStudentProgressDTO.topic_id);
        studentProgress.status = updateStudentProgressDTO.status;
        await this.studentProgressDAO.updateStudentProgress(studentProgress);
      } catch (err) {
        throw new AppError(
          (err as AppError).message,
          (err as AppError).statusCode
        );
      }
  }
}
export default StudentProgressService;