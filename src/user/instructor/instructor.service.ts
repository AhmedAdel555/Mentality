import AddInstructorRequestDTO from "./dtos/add-instructor-request-dto";
import bcrypt from "bcrypt";
import config from "../../utils/envConfig";
import InstructorDAO from "./instructor.dao";
import InstructorModel from "./instructor.model";
import ResponseInstractorInfoDTO from "./dtos/response-instractor-info-dto";
import UpdateInstructorRequestDTO from "./dtos/update-instructor-request-dto";
import IInstructorService from "./instructorService.interface";
import ChangeProfilePictureRequsetDTO from "../dtos/change-profile-picture-requset-dto";
import ResetPasswordRequestDTO from "../dtos/reset-password-request-dto";
import fs from "node:fs";
import path from "node:path";
import CoursesDAO from "../../courses/courses.dao";
import AppError from "../../utils/appError";
import InstructorCoursesResponse from "./dtos/instructor-courses-respons-dto";

class InstructorService implements IInstructorService {
  constructor(
    private readonly instructorDAO: InstructorDAO, private readonly coursesDAO: CoursesDAO
  ) {};
  
  public async addInstructor(addInstructorRequestDTO: AddInstructorRequestDTO): Promise<void> {
    try{
      const instractorFromDB = await this.instructorDAO.getInstructorByEmail(addInstructorRequestDTO.email);
      if(instractorFromDB) throw new AppError("email is already exist", 409);
      const instructor = new InstructorModel(
        addInstructorRequestDTO.user_name,
        addInstructorRequestDTO.email,
        addInstructorRequestDTO.title,
        addInstructorRequestDTO.description,
        bcrypt.hashSync(`${addInstructorRequestDTO.password}${config.SECRETHASHINGKEY}`,10),
        "/uploads/avatars/defult.jpg"
      );
    await this.instructorDAO.createInstructor(instructor);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }


  public async getAllInstructors(): Promise<ResponseInstractorInfoDTO[]> {
    try{
      const instructorsFromDB = await this.instructorDAO.getAllInstructors();
      const instractors:ResponseInstractorInfoDTO[] = instructorsFromDB.map((instructor, index) => {
        return {
          id : instructor.id,
          user_name: instructor.user_name,
          email: instructor.email,
          title :instructor.title,
          description : instructor.description,
          profile_picture : instructor.profile_picture,
          phone_number: instructor.phone_number,
          address: instructor.address
        }
      })
      return instractors;
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async getInstructor(id: string): Promise<ResponseInstractorInfoDTO> {
    try{
      const instructorFromDB = await this.instructorDAO.getInstructorById(id);
      if(!instructorFromDB) throw new AppError("instructor not found", 404);
      const instructor: ResponseInstractorInfoDTO = {
        id : instructorFromDB.id,
        user_name: instructorFromDB.user_name,
        email: instructorFromDB.email,
        title :instructorFromDB.title,
        description : instructorFromDB.description,
        profile_picture : instructorFromDB.profile_picture,
        phone_number: instructorFromDB.phone_number,
        address: instructorFromDB.address
      }
      return instructor;
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async updateInstructor(updateInstructorRequestDTO: UpdateInstructorRequestDTO): Promise<void> {
    try{
      const instructor = await this.instructorDAO.getInstructorById(updateInstructorRequestDTO.user_id);
      if(!instructor) throw new AppError("instructor not found", 404);

      instructor.user_name = updateInstructorRequestDTO.user_name ;
      instructor.title = updateInstructorRequestDTO.title ;
      instructor.description = updateInstructorRequestDTO.description ;
      instructor.phone_number = updateInstructorRequestDTO.phone_number;
      instructor.address = updateInstructorRequestDTO.address;

      await this.instructorDAO.updateInstructor(instructor);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async deleteInstructor(id: string): Promise<void> {
      try{
        const instructor = await this.instructorDAO.getInstructorById(id);
        if(!instructor) throw new AppError("instructor not found", 404);
        await this.instructorDAO.deleteInstructorById(id);
      }catch (err) {
        throw new AppError(
          (err as AppError).message,
          (err as AppError).statusCode
        );
      }
  }

  public async resetPassword(resetPasswordRequestDTO: ResetPasswordRequestDTO): Promise<void> {
    try {
      const instructor = await this.instructorDAO.getInstructorById(resetPasswordRequestDTO.user_id);
      if(!instructor) throw new AppError("instructor not found", 404);

      if (!bcrypt.compareSync(`${resetPasswordRequestDTO.old_password}${config.SECRETHASHINGKEY}`,instructor.password)) {
        throw new AppError("password is incorrect", 401);
      }

      instructor.password = bcrypt.hashSync(
        `${resetPasswordRequestDTO.password}${config.SECRETHASHINGKEY}`,
        10
      );

      await this.instructorDAO.updateInstructor(instructor);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async changeProfilePicture(changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO): Promise<string> {
    try {
      if (!changeProfilePictureRequsetDTO.profile_picture)
          throw new AppError("Oops!", 401);
      // get admin by id
      const instructor = await this.instructorDAO.getInstructorById(changeProfilePictureRequsetDTO.user_id);
      if(!instructor) throw new AppError("instructor not found", 404);

      //  delete it
      if (instructor.profile_picture !== "/uploads/avatars/defult.jpg") {
        const filePath = path.join(
          __dirname,
          "../../..",
          instructor.profile_picture
        );
        this.deleteFile(filePath);
      }
      // update admin

      instructor.profile_picture = `/uploads/avatars/${changeProfilePictureRequsetDTO.profile_picture}`;
      await this.instructorDAO.updateInstructor(instructor);
      return instructor.profile_picture;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getInstructorCourses(id: string): Promise<InstructorCoursesResponse[]> {
    try {
      const courses = await this.coursesDAO.getAllCourses();
      const instructorCourses: InstructorCoursesResponse[] = courses.filter((course, index) => {
        return course.instructor.id === id ;
      }).map((course, index) => {
        return {
          id : course.id,
          title : course.title,
          description : course.description,
          requirements : course.requirements,
          level: course.level,
          picture : course.picture
        }
      })
      return instructorCourses
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

export default InstructorService;
