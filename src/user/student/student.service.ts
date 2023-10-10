import ChangeProfilePictureRequsetDTO from "./dtos/change-profile-picture-requset-dto";
import ResetPasswordRequestDTO from "./dtos/reset-password-request-dto";
import ResponeStudentInfoDTO from "./dtos/respone-student-info-dto";
import ResponseAllStudentsDTO from "./dtos/response-all-students-dto";
import UpdateStudentInfoDTO from "./dtos/update-student-info-dto";
import StudentDAO from "./student.dao";
import IStudentService from "./studentService.interface";
import bcrypt from "bcrypt";
import config from "../../utils/envConfig";
import fs from "node:fs";
import path from "node:path";

class StudentService implements IStudentService{
  constructor(private readonly studentDAO: StudentDAO){};
  public async getAllStudents(): Promise<ResponseAllStudentsDTO[]> {
    try{
      const studentsFromDB = await this.studentDAO.getAllStudents();
      const students: ResponseAllStudentsDTO[] = studentsFromDB.map((student, index) => {
        return {id: student.id, user_name: student.user_name, 
          profile_picture: student.profile_picture}
      })
      return students;
    }catch(err){
      throw new Error((err as Error).message);
    }
  }
  public async getStudent(id: string): Promise<ResponeStudentInfoDTO> {
     try{
      const studentFromDB = await this.studentDAO.getStudent(id);
     if(!studentFromDB) throw new Error("student not found");
     const student: ResponeStudentInfoDTO = {
        id: studentFromDB.id,
        user_name: studentFromDB.user_name,
        email: studentFromDB.email,
        profile_picture: studentFromDB.profile_picture,
        phone_number: studentFromDB.phone_number,
        address: studentFromDB.address,
        points: studentFromDB.points,
     }
     return student;
     }catch(err){
      throw new Error((err as Error).message);
    }
  }
  public async updateStudent(updateStudentInfoDTO: UpdateStudentInfoDTO): Promise<void> {
    try{
      const studentFromDB = await this.studentDAO.getStudent(updateStudentInfoDTO.userId);
      if(!studentFromDB) throw new Error("student not found");
      studentFromDB.email = updateStudentInfoDTO.email;
      studentFromDB.address = updateStudentInfoDTO.address;
      studentFromDB.phone_number = updateStudentInfoDTO.phoneNumber
      studentFromDB.user_name = updateStudentInfoDTO.userName
      const updatedStudent = await this.studentDAO.updateStudent(studentFromDB);
      if(!updatedStudent) throw new Error("failed not found");
    }catch(err){
      throw new Error((err as Error).message);
    }
  }
  public async resetPassword(
    resetPasswordRequestDTO: ResetPasswordRequestDTO
  ): Promise<void> {
    try {
      // get admin by id
      const student = await this.studentDAO.getStudent(
        resetPasswordRequestDTO.userId
      );
      if (!student) throw new Error("student is not exist");

      // check for old password
      if (
        !bcrypt.compareSync(
          `${resetPasswordRequestDTO.oldPassword}${config.SECRETHASHINGKEY}`,
          student.password
        )
      ) {
        throw new Error("password is not correct");
      }
      // encript new password
      student.password = bcrypt.hashSync(
        `${resetPasswordRequestDTO.password}${config.SECRETHASHINGKEY}`,
        10
      );
      // update student
      const updatedStudent = await this.studentDAO.updateStudentPassword(student);
      if (updatedStudent.password !== student.password) throw new Error("oops failed to reset password");
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  public async changeProfilePicture(
    changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO
  ): Promise<string> {
    try {
      // get admin with the id
      const student = await this.studentDAO.getStudent(
        changeProfilePictureRequsetDTO.userId
      );
      if (!student) throw new Error("student is not exist");
      // if profile picture not the defult
      //  delete it
      if (student.profile_picture !== "/uploads/avatars/defult.jpg") {
        const filePath = path.join(
          __dirname,
          "../../..",
          student.profile_picture
        );
        this.deleteFile(filePath);
      }
      // update student
      if(!changeProfilePictureRequsetDTO.profilePicture) throw new Error('oops error');
      student.profile_picture = `/uploads/avatars/${changeProfilePictureRequsetDTO.profilePicture}`;
      const updatedStudent = await this.studentDAO.updateStudentProfilePicture(student);
      if (!updatedStudent) throw new Error("oops failed to update");
      return updatedStudent.profile_picture;
    } catch (err) {
      throw new Error((err as Error).message);
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
  public async deleteStudent(id: string): Promise<void> {
    try{
      const deletedStudent = await this.studentDAO.deleteStudent(id);
      if(!deletedStudent) throw new Error("failed not found");
    }catch(err){
      throw new Error((err as Error).message);
    }
  }
}
export default StudentService;