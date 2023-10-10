import UserModel from "../user.model";

class AdminModel extends UserModel {
  constructor(
    user_name: string,
    email: string,
    password: string,
    profile_picture: string
  ) {
    super(user_name, email, password, profile_picture);
  }
}

export default AdminModel;
