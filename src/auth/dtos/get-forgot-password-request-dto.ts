import Roles from "../../utils/roles.enum";

interface GetForgotPasswordRequestDTO {
  email: string,
  role: Roles
}

export default GetForgotPasswordRequestDTO;