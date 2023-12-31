import Roles from "../../../utils/roles.enum";

interface AddInstructorRequestDTO {
  user_id:string
  user_role:Roles
  email: string,
  user_name: string,
  password: string;
  confirm_password:string,
  title :string
  description : string
}

export default AddInstructorRequestDTO;