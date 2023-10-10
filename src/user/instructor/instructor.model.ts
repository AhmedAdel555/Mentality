import UserModel from "../user.model";
class InstructorModel extends UserModel {
  public title :string
  public description : string
  constructor(user_name:string, email:string, title:string, description:string ,password: string, profile_picture:string )
  {
    super(user_name, email, password, profile_picture);
    this.title = title;
    this.description = description;
  };
}

export default InstructorModel;

