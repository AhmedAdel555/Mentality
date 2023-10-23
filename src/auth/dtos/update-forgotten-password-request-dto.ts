import Roles from "../../utils/roles.enum";

interface UpdateForgottenPasswordDTO {
  email: string,
  role: Roles,
  verification_code: string,
  password: string,
  confirm_password: string
}
export default UpdateForgottenPasswordDTO;