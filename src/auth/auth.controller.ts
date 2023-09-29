import { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";
import AuthDAO from "./auth.dao";
class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.authService.login({ ...req.body });
      return res
        .status(200)
        .json({ status: "succeed", data: { token: token } });
    } catch (err) {
      next(err);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.register({ ...req.body });
      return res.status(201).json({ status: "succeed", data: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController(new AuthService(new AuthDAO()));
