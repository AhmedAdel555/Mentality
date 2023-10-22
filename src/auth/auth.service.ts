import LoginRequestDto from "./dtos/login-request-dto";
import StudentRegisterRequestDto from "./dtos/student-register-request-dto";
import bcrypt from "bcrypt";
import config from "../utils/envConfig";
import Jwt from "jsonwebtoken";
import StudentDAO from "../user/student/student.dao";
import StudentModel from "../user/student/student.model";
import Roles from "../utils/roles.enum";
import AdminDAO from "../user/admin/admin.dao";
import InstructorDAO from "../user/instructor/instructor.dao";
import UserModel from "../user/user.model";
import SubscriptionDAO from "../subscription/subscription.dao";
import SubscriptionModel from "../subscription/subscription.model";
import PricingPlanDAO from "../pricingPlan/pricingPlan.dao";
import AppError from "../utils/appError";
import GetForgotPasswordRequestDTO from "./dtos/get-forgot-password-request-dto";
import sgMail from "@sendgrid/mail";

class AuthService {
  constructor(
    private readonly studentDAO: StudentDAO,
    private readonly adminDAO: AdminDAO,
    private readonly instructorDAO: InstructorDAO,
    private readonly subscriptionDAO: SubscriptionDAO,
    private readonly pricingPlanDAO: PricingPlanDAO
  ) {}

  private async getUser(
    role: Roles,
    email: string
  ): Promise<UserModel | undefined> {
    let user: UserModel | undefined;
    if (role === Roles.Student) {
      user = await this.studentDAO.getStudentByEmail(email);
    }
    if (role === Roles.Instructor) {
      user = await this.instructorDAO.getInstructorByEmail(email);
    }
    if (role === Roles.Admin) {
      user = await this.adminDAO.getAdminByEmail(email);
    }
    return user;
  }

  public async login(loginRequestDto: LoginRequestDto): Promise<string> {
    try {
      const user = await this.getUser(
        loginRequestDto.role,
        loginRequestDto.email
      );
      if (user) {
        if (
          bcrypt.compareSync(
            `${loginRequestDto.password}${config.SECRETHASHINGKEY}`,
            user.password
          )
        ) {
          const token = Jwt.sign(
            {
              id: user.id,
              role: loginRequestDto.role,
            },
            config.SECRETJWTKEY as string,
            { expiresIn: "24h" }
          );
          return token;
        } else {
          throw new AppError("password is incorrect", 401);
        }
      } else {
        throw new AppError("email is not found", 401);
      }
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode || 500
      );
    }
  }

  public async register(
    studentRegisterRequestDto: StudentRegisterRequestDto
  ): Promise<void> {
    try {
      // check for email exist
      const studentFromDB = await this.studentDAO.getStudentByEmail(
        studentRegisterRequestDto.email
      );
      if (studentFromDB) throw new AppError("email is already exist", 409);
      // create student
      const hashedPassword = bcrypt.hashSync(
        `${studentRegisterRequestDto.password}${config.SECRETHASHINGKEY}`,
        10
      );
      const student = new StudentModel(
        studentRegisterRequestDto.user_name,
        studentRegisterRequestDto.email,
        hashedPassword,
        "/uploads/avatars/defult.jpg"
      );
      const pricingPlan = await this.pricingPlanDAO.getPricingPlanById(1);
      if (!pricingPlan) throw new AppError("oops there is a problem", 404);
      const subscription = new SubscriptionModel(student, pricingPlan);
      // save student
      await this.studentDAO.createStudent(student);
      // student subscribe in basic plan by defult
      await this.subscriptionDAO.createSubscription(subscription);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getForgotPassword(
    getForgotPasswordRequestDTO: GetForgotPasswordRequestDTO
  ): Promise<void> {
    try {
      if (getForgotPasswordRequestDTO.role === Roles.Admin) {
        const admin = await this.adminDAO.getAdminByEmail(
          getForgotPasswordRequestDTO.email
        );
        if (!admin) throw new AppError("email not found", 404);
        const token = this.generateRandomToken();
        admin.reset_password_token = token;
        await this.adminDAO.updateAdmin(admin);
        await this.sendEmail(admin.email, token);
      } else if (getForgotPasswordRequestDTO.role === Roles.Instructor) {
        const instructor = await this.instructorDAO.getInstructorByEmail(
          getForgotPasswordRequestDTO.email
        );
        if (!instructor) throw new AppError("email not found", 404);
        const token = this.generateRandomToken();
        instructor.reset_password_token = token;
        await this.instructorDAO.updateInstructor(instructor);
        await this.sendEmail(instructor.email, token);
      } else if (getForgotPasswordRequestDTO.role === Roles.Student) {
        const student = await this.studentDAO.getStudentByEmail(
          getForgotPasswordRequestDTO.email
        );
        if (!student) throw new AppError("email not found", 404);
        const token = this.generateRandomToken();
        student.reset_password_token = token;
        await this.studentDAO.updateStudent(student);
        await this.sendEmail(student.email, token);
      }
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode || 500
      );
    }
  }

  private generateRandomToken(): string {
    let token = "";
    for (let i = 0; i < 8; i++) {
      token += Math.floor(Math.random() * 9) + 1;
    }
    return token;
  }

  private async sendEmail(email: string, message: string): Promise<void> {
    try {
      sgMail.setApiKey(config.SENDGRID_API_KEY as string);
      const msg = {
        to: [email],
        from: {
          name: "Mentality",
          email: "ahmedbassiouni555@gmail.com",
        }, // Use the email address or domain you verified above
        subject: "Sending with Twilio SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: `<strong>you reset passweord token is ${message}</strong>`,
      };
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
    }
  }
}

export default AuthService;
