import { Request, Response, NextFunction } from "express";
import AdminDAO from "./admin.dao";
import AdminService from "./admin.service";

class AdminController {

    constructor (private readonly adminService: AdminService){};

    public async addAdmin(req: Request, res: Response, next: NextFunction){
      try{
        await this.adminService.addAdmin({...req.body});
        res.status(201).json({status: "success", data: null});
      }catch(err){
        next(err)
      }
    }

    public async getAllAdmins(_req: Request, res: Response, next: NextFunction){
      try{
        const admins = await this.adminService.getAdmins();
        res.status(200).json({status: "success", data: admins});
      }catch(err){
        next(err)
      }
    }

    public async getAdmin(req: Request, res: Response, next: NextFunction){
      try{
        const admin = await this.adminService.getAdmin(req.body.id);
        res.status(200).json({status: "success", data: admin});
      }catch(err){
        next(err);
      }
    }

    public async updateAdmin(req: Request, res: Response, next: NextFunction){
      await this.adminService.updateAdmin({...req.body, id: req.params.adminId});
      res.status(200).json({status: "success", data: null});
    }
}

export default new AdminController(new AdminService(new AdminDAO));