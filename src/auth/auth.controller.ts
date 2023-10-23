import { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";
import StudentDAO from "../user/student/student.dao";
import InstructorDAO from "../user/instructor/instructor.dao";
import AdminDAO from "../user/admin/admin.dao";
import SubscriptionDAO from "../subscription/subscription.dao";
import PricingPlanDAO from "../pricingPlan/pricingPlan.dao";
class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.authService.login({ ...req.body });
      return res
        .status(200)
        .json({ status: "success", data: { token: token } });
    } catch (err) {
      next(err);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.register({ ...req.body });
      return res.status(201).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async getForgotPassowrd(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.getForgotPassword({ ...req.body });
      return res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async updateForgottenPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.updateForgottenPassword({ ...req.body });
      return res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

}

export default new AuthController(
  new AuthService(
    new StudentDAO(),
    new AdminDAO(),
    new InstructorDAO(),
    new SubscriptionDAO(),
    new PricingPlanDAO()
  )
);
