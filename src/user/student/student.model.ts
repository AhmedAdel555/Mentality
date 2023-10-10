import UserModel from "../user.model";

class StudentModel extends UserModel {
  public points: number
  constructor(user_name: string, email: string, password: string, profile_picture:string){
    super(user_name, email, password, profile_picture);
    this.points = 0;
  }
}
export default StudentModel;