import AuthDAO from "./auth.dao";
import LoginRequestDto from "./dtos/login-request-dto";
import StudentRegisterRequestDto from "./dtos/student-register-request-dto";
import bcrypt from "bcrypt";
import config from "../utils/envConfig";
import Jwt from "jsonwebtoken";
import StudentRegisterDataDto from "./dtos/student-reister-data-dto";

class AuthService {
  constructor(private readonly authDAO: AuthDAO) {}

  public async login(data: LoginRequestDto): Promise<string> {
    try {
      let role = data.role;
      data.role = data.role.toLowerCase() + "s";
      const user = await this.authDAO.login(data);
      if (user) {
        if (
          bcrypt.compareSync(
            `${data.password}${config.SECRETHASHINGKEY}`,
            user.password
          )
        ) {
          const token = Jwt.sign(
            { id: user.id, role: role },
            config.SECRETJWTKEY as string,
            { expiresIn: "48h" }
          );
          return token;
        } else {
          throw new Error("password is incorrect");
        }
      } else {
        throw new Error("email is not found");
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  public async register(data: StudentRegisterRequestDto) {
    try {
      const user = await this.authDAO.getUserByEmail(data.email);
      if (user) {
        throw new Error("email is already exist");
      }
      data.password = bcrypt.hashSync(
        `${data.password}${config.SECRETHASHINGKEY}`,
        10
      );
      const registerData: StudentRegisterDataDto = {
        ...data,
        avatar: "/uploads/avatars/defult.jpg",
      };
      const registerUser = await this.authDAO.register(registerData);
      if (!registerUser) {
        throw new Error("failed to register");
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export default AuthService;
