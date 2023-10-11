import ChangeProfilePictureRequsetDTO from "../dtos/change-profile-picture-requset-dto";
import ResetPasswordRequestDTO from "../dtos/reset-password-request-dto";
import ResponeStudentInfoDTO from "./dtos/respone-student-info-dto";
import UpdateStudentInfoDTO from "./dtos/update-student-info-dto";
import StudentDAO from "./student.dao";
import IStudentService from "./studentService.interface";
import bcrypt from "bcrypt";
import config from "../../utils/envConfig";
import fs from "node:fs";
import path from "node:path";
import AppError from "../../utils/appError";

class StudentService implements IStudentService{
  constructor(private readonly studentDAO: StudentDAO){};

  public async getAllStudents(): Promise<ResponeStudentInfoDTO[]> {
    try{
      const studentsFromDB = await this.studentDAO.getAllStudents();
      const students: ResponeStudentInfoDTO[] = studentsFromDB.map((student, index) => {
        return {
          id: student.id, 
          user_name: student.user_name, 
          email: student.email,
          phone_number: student.phone_number,
          address: student.address,
          points: student.points,
          profile_picture: student.profile_picture}
      })
      return students;
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async getStudent(id: string): Promise<ResponeStudentInfoDTO> {
     try{
      const studentFromDB = await this.studentDAO.getStudentById(id);
     if(!studentFromDB) throw new AppError("student not found", 404);
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
     }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async updateStudent(updateStudentInfoDTO: UpdateStudentInfoDTO): Promise<void> {
    try{
      const studentFromDB = await this.studentDAO.getStudentById(updateStudentInfoDTO.user_id);
      if(!studentFromDB) throw new AppError("student not found", 404);
      studentFromDB.email = updateStudentInfoDTO.email;
      studentFromDB.address = updateStudentInfoDTO.address;
      studentFromDB.phone_number = updateStudentInfoDTO.phone_number
      studentFromDB.user_name = updateStudentInfoDTO.user_name
      const updatedStudent = await this.studentDAO.updateStudent(studentFromDB);
      if(!updatedStudent) throw new AppError("failed to update", 500);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async resetPassword(
    resetPasswordRequestDTO: ResetPasswordRequestDTO
  ): Promise<void> {
    try {
      const student = await this.studentDAO.getStudentById(resetPasswordRequestDTO.user_id);
      if(!student) throw new AppError("instructor not found", 404);

      if (!bcrypt.compareSync(`${resetPasswordRequestDTO.old_password}${config.SECRETHASHINGKEY}`,student.password)) {
        throw new AppError("password is incorrect", 401);
      }

      student.password = bcrypt.hashSync(
        `${resetPasswordRequestDTO.password}${config.SECRETHASHINGKEY}`,
        10
      );

      const updatedStudent = await this.studentDAO.updateStudent(student);
      if(!updatedStudent) throw new AppError('oops error', 500);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async changeProfilePicture(
    changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO
  ): Promise<string> {
    try {
      if (!changeProfilePictureRequsetDTO.profile_picture)
          throw new AppError("Oops!", 401);

        const student = await this.studentDAO.getStudentById(changeProfilePictureRequsetDTO.user_id);
        if(!student) throw new AppError("instructor not found", 404);

      if (student.profile_picture !== "/uploads/avatars/defult.jpg") {
        const filePath = path.join(
          __dirname,
          "../../..",
          student.profile_picture
        );
        this.deleteFile(filePath);
      }

      student.profile_picture = `/uploads/avatars/${changeProfilePictureRequsetDTO.profile_picture}`;
      const updatedStudent = await this.studentDAO.updateStudent(student);
      if(!updatedStudent) throw new AppError('oops error', 500);
      return updatedStudent.profile_picture;
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

  public async deleteStudent(id: string): Promise<void> {
    try{
      const student = await this.studentDAO.getStudentById(id);
      if(!student) throw new AppError("instructor not found", 404);
      const deletedStudent = await this.studentDAO.deleteStudentById(id);
      if(!deletedStudent) throw new AppError("Oops something went wrong", 505);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}
export default StudentService;