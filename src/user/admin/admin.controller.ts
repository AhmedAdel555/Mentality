import { Request, Response, NextFunction } from "express";
import AdminDAO from "./admin.dao";
import AdminService from "./admin.service";

class AdminController {
  constructor(private readonly adminService: AdminService) {}

  public async addAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      await this.adminService.addAdmin({ ...req.body });
      res.status(201).json({ status: "success", data: null });
    } catch (err) {
      next(err);
    }
  }

  public async getAllAdmins(_req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminService.getAdmins();
      res.status(200).json({ status: "success", data: admins });
    } catch (err) {
      next(err);
    }
  }

  public async getAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await this.adminService.getAdmin(req.params.admin_id);
      res.status(200).json({ status: "success", data: admin });
    } catch (err) {
      next(err);
    }
  }

  public async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      await this.adminService.updateAdmin({ ...req.body });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.adminService.resetPassword({ ...req.body });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async changeProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profilePicture = await this.adminService.changeProfilePicture({
        ...req.body,
        profile_picture: req.file?.filename,
      });
      res.status(200).json({ status: "success", data: profilePicture });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController(new AdminService(new AdminDAO()));
