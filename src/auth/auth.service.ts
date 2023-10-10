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
    let user: UserModel | undefined
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
          const subscriptions =
            await this.subscriptionDAO.getAllSubscriptions();
          const userSubscription = subscriptions.filter(
            (subscription, index) => {
              return subscription.student.id === user.id;
            }
          );
          const token = Jwt.sign(
            {
              id: user.id,
              role: loginRequestDto.role,
              pricing_plan_id: userSubscription[0].pricing_plan.id,
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

  public async register(studentRegisterRequestDto: StudentRegisterRequestDto) {
    try {
      const studentFromDB = await this.studentDAO.getStudentByEmail(
        studentRegisterRequestDto.email
      );
      if (studentFromDB) throw new AppError("email is already exist", 409);
      const student = new StudentModel(
        studentRegisterRequestDto.user_name,
        studentRegisterRequestDto.email,
        bcrypt.hashSync(
          `${studentRegisterRequestDto.password}${config.SECRETHASHINGKEY}`,
          10
        ),
        "/uploads/avatars/defult.jpg"
      );
      const newStudent = await this.studentDAO.createStudent(student);
      const pricingPlan = await this.pricingPlanDAO.getPricingPlanById(1);
      if (!pricingPlan) throw new AppError("oops there is a problem", 404);
      const subscription = new SubscriptionModel(newStudent, pricingPlan);
      const newSubscription =
        this.subscriptionDAO.createSubscription(subscription);
      console.log(newSubscription);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode || 500
      );
    }
  }
}

export default AuthService;
