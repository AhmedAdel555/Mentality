import AddInstructorRequestDTO from "./dtos/add-instructor-request-dto";
import bcrypt from "bcrypt";
import config from "../utils/envConfig";
import InstructorDAO from "./instructor.dao";
import InstructorModel from "./instructor.model";
import ResponseAllInstractorsDTO from "./dtos/response-all-instractors-dto";
import CoursesDAO from "../courses/courses.dao";
import ResponseInstractorInfoDTO from "./dtos/response-instractor-info-dto";
import UpdateInstructorRequestDTO from "./dtos/update-instructor-request-dto";

class InstructorService {
  constructor(private readonly instructorDAO: InstructorDAO, 
              private readonly courseDAO: CoursesDAO){};

  public async create(addInstructorRequestDTO: AddInstructorRequestDTO){
      try{
        const instructor = new InstructorModel(
          addInstructorRequestDTO.userName,
          addInstructorRequestDTO.email,
          addInstructorRequestDTO.title,
          addInstructorRequestDTO.description,
          bcrypt.hashSync(`${addInstructorRequestDTO.password}${config.SECRETHASHINGKEY}`,10),
          "/uploads/avatars/defult.jpg"
        );
  
        const newInstructor = await this.instructorDAO.create(instructor);
        if(!newInstructor) throw new Error("Oops can't create instructor");
      }catch(err){
        throw new Error((err as Error).message);
      }
  }

  public async getAll(): Promise<ResponseAllInstractorsDTO[]>{
      try{
        const instructorsFromDB = await this.instructorDAO.getAll();
        const instractors:ResponseAllInstractorsDTO[] = instructorsFromDB.map((instructor, index) => {
          return {
            id : instructor.id,
            userName: instructor.user_name,
            title :instructor.title,
            description : instructor.description,
            profilePicture : instructor.profile_picture
          }
        })
        return instractors;
      }catch(err){
        throw new Error((err as Error).message);
      }
  }

  public async getById(id: string): Promise<ResponseInstractorInfoDTO> {
    try{
      const instructorFromDB = await this.instructorDAO.getById(id);
      const courses = await this.courseDAO.getInstructorCourses(id);
      const instructor: ResponseInstractorInfoDTO = {
        id: instructorFromDB.id,
        userName: instructorFromDB.user_name,
        title : instructorFromDB.title,
        description : instructorFromDB.description,
        email : instructorFromDB.email,
        profilePicture : instructorFromDB.profile_picture,
        courses: courses,
        phoneNumber : instructorFromDB.phone_number,
        address : instructorFromDB.address
      }
      return instructor;
    }
    catch(err){
      throw new Error((err as Error).message);
    }
  }

  public async update(updateInstructorRequestDTO: UpdateInstructorRequestDTO){
    try{
      const instructor = await this.instructorDAO.getById(updateInstructorRequestDTO.id);
      if(!instructor) throw new Error ("instructor not found");
      instructor.user_name = updateInstructorRequestDTO.userName ;
      instructor.title = updateInstructorRequestDTO.title ;
      instructor.description = updateInstructorRequestDTO.description ;
      instructor.email = updateInstructorRequestDTO.email ;
      instructor.phone_number = updateInstructorRequestDTO.phoneNumber;
      instructor.address = updateInstructorRequestDTO.address;
      const updatedInstructor = await this.instructorDAO.update(instructor);
      if(!updatedInstructor) throw new Error('oops error');
    }catch(err){
      throw new Error((err as Error).message);
    }
  }
}

export default InstructorService;