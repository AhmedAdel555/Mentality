import CourseModel from "../../courses/course.model";
import UserModel from "../user.model";
class InstructorModel extends UserModel {
  public title :string
  public description : string
  public courses: CourseModel[];
  constructor(user_name:string, email:string, title:string, description:string ,password: string, profile_picture:string, )
  {
    super(user_name, email, password, profile_picture);
    this.title = title;
    this.description = description;
    this.courses = [];
  };
}

export default InstructorModel;

