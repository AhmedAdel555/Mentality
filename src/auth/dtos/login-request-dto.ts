import Roles from "../../utils/roles.enum";

interface LoginRequestDto {
  email: string,
  password: string,
  role: Roles
}

export default LoginRequestDto;