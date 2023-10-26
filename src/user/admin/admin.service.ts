import AdminDAO from "./admin.dao";
import AdminModel from "./admin.model";
import IAdminService from "./adminService.interface";
import AddAdminRequestDTO from "./dtos/add-admin-request-dto";
import bcrypt from "bcrypt";
import config from "../../utils/envConfig";
import AdminInfoResponseDTO from "./dtos/admin-info-response-dto";
import UpdateAdminRequestDTO from "./dtos/update-admin-request-dto";
import ResetPasswordRequestDTO from "../dtos/reset-password-request-dto";
import ChangeProfilePictureRequsetDTO from "../dtos/change-profile-picture-requset-dto";
import fs from "node:fs";
import path from "node:path";
import AppError from "../../utils/appError";
class AdminService implements IAdminService {
  constructor(private readonly adminDao: AdminDAO) {}

  public async addAdmin(addAdminRequestDTO: AddAdminRequestDTO): Promise<void> {
    try {
      const adminFromDB = await this.adminDao.getAdminByEmail(
        addAdminRequestDTO.email
      );
      if (adminFromDB) throw new AppError("email is already exist", 400);
      // check for email or not ?
      const hashedPassword = bcrypt.hashSync(
        `${addAdminRequestDTO.password}${config.SECRETHASHINGKEY}`,
        10
      )
      const admin: AdminModel = new AdminModel(
        addAdminRequestDTO.user_name,
        addAdminRequestDTO.email,
        hashedPassword,
        "/uploads/avatars/defult.jpg"
      );
      await this.adminDao.createAdmin(admin);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getAdmins(): Promise<AdminInfoResponseDTO[]> {
    try {
      const adminsFromDB = await this.adminDao.getAllAdmins();
      const admins: AdminInfoResponseDTO[] = adminsFromDB.map(
        (admin, index) => {
          return {
            id: admin.id,
            user_name: admin.user_name,
            email: admin.email,
            phone_number: admin.phone_number,
            address: admin.address,
            profile_picture: admin.profile_picture,
          };
        }
      );
      return admins;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getAdmin(id: string): Promise<AdminInfoResponseDTO> {
    try {
      const adminFromDB = await this.adminDao.getAdminById(id);
      if (!adminFromDB) throw new AppError("admin does not exist", 404);
      const admin: AdminInfoResponseDTO = {
        id: adminFromDB.id,
        user_name: adminFromDB.user_name,
        email: adminFromDB.email,
        phone_number: adminFromDB.phone_number,
        address: adminFromDB.address,
        profile_picture: adminFromDB.profile_picture,
      };
      return admin;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async updateAdmin(
    updateAdminRequestDTO: UpdateAdminRequestDTO
  ): Promise<void> {
    try {
      const admin = await this.adminDao.getAdminById(
        updateAdminRequestDTO.user_id
      );
      if (!admin) throw new AppError("admin does not exist", 404);
      admin.user_name = updateAdminRequestDTO.user_name;
      admin.address = updateAdminRequestDTO.address;
      admin.phone_number = updateAdminRequestDTO.phone_number;
      await this.adminDao.updateAdmin(admin);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async resetPassword(
    resetPasswordRequestDTO: ResetPasswordRequestDTO
  ): Promise<void> {
    try {
      // get admin by id
      const admin = await this.adminDao.getAdminById(
        resetPasswordRequestDTO.user_id
      );
      if (!admin) throw new AppError("admin does not exist", 404);
      // check for old password
      if (
        !bcrypt.compareSync(
          `${resetPasswordRequestDTO.old_password}${config.SECRETHASHINGKEY}`,
          admin.password
        )
      ) {
        throw new AppError("password is incorrect", 401);
      }
      // encript new password
      admin.password = bcrypt.hashSync(
        `${resetPasswordRequestDTO.password}${config.SECRETHASHINGKEY}`,
        10
      );
      // update admin
      await this.adminDao.updateAdmin(admin);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async changeProfilePicture(
    changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO
  ): Promise<string> {
    try {
      // check for picture
      if (!changeProfilePictureRequsetDTO.profile_picture)
        throw new AppError("Oops file not uploaded!", 401);
      // get admin with the id
      const admin = await this.adminDao.getAdminById(
        changeProfilePictureRequsetDTO.user_id
      );
      if (!admin) throw new AppError("admin does not exist", 404);
      // if profile picture not the defult
      //  delete it
      if (admin.profile_picture !== "/uploads/avatars/defult.jpg") {
        const filePath = path.join(
          __dirname,
          "../../..",
          admin.profile_picture
        );
        this.deleteFile(filePath);
      }
      // update admin
      admin.profile_picture = `/uploads/avatars/${changeProfilePictureRequsetDTO.profile_picture}`;
      await this.adminDao.updateAdmin(admin);
      return admin.profile_picture;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  private deleteFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File deleted successfully");
      });
    } else {
      console.log("File not found");
    }
  }
}

export default AdminService;
