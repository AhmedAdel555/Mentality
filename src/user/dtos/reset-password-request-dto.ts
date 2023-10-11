import Roles from "../../utils/roles.enum"

interface ResetPasswordRequestDTO {
  user_id:string
  user_role:Roles
  old_password:string
  password: string
  confirm_password:string
}

export default ResetPasswordRequestDTO;