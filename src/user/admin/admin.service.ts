import AdminDAO from "./admin.dao";
import AdminModel from "./admin.model";
import IAdminService from "./adminService.interface";
import AddAdminRequestDTO from "./dtos/add-admin-request-dto";
import bcrypt from "bcrypt";
import config from "../utils/envConfig";
import ResponseAdminInfoDTO from "./dtos/response-admins-into-dto";
import AdminInfoResponseDTO from "./dtos/admin-info-response-dto";
import UpdateAdminRequestDTO from "./dtos/update-admin-request-dto";
class AdminService implements IAdminService{
  constructor(private readonly adminDao: AdminDAO){};


  public async addAdmin(adminAddRequest: AddAdminRequestDTO): Promise<void> {
    try{
      const admin: AdminModel = new AdminModel(
        adminAddRequest.userName,
        adminAddRequest.email,
        bcrypt.hashSync(`${adminAddRequest.password}${config.SECRETHASHINGKEY}`,10),
        "/uploads/avatars/defult.jpg"
      )
      const newAdmin = this.adminDao.addAdmin(admin);
      if(!newAdmin) throw new Error("Oops can't create admin");
    }catch(err){
      throw new Error((err as Error).message);
    }
  }
  public async getAdmins(): Promise<ResponseAdminInfoDTO[]> {
      try{
          const admins = await this.adminDao.getAllAdmins();
          const responseAdmins = admins.map((admin, index) => {
             return {id: admin.id, userName: admin.user_name, email: admin.email, profilePicture: admin.profile_picture};
          })
          return responseAdmins;
      }catch(err){
        throw new Error((err as Error).message);
      }
  }

  public async getAdmin(id: string): Promise<AdminInfoResponseDTO> {
    try{
      const returnedAdminFronDB = await this.adminDao.getAdminById(id);
      if(!returnedAdminFronDB) throw new Error("oops can't fint this admin this his info");
      const admin:AdminInfoResponseDTO = {
          id: returnedAdminFronDB.id,
          userName: returnedAdminFronDB.user_name,
          email: returnedAdminFronDB.email,
          profilePicture: returnedAdminFronDB.profile_picture,
          phoneNumber: returnedAdminFronDB.phone_number || "",
          address: returnedAdminFronDB.address || ""
      }
      return admin;
    }catch(err){
      throw new Error((err as Error).message);
    }
  }

  public async updateAdmin(requestUpdateAdmin: UpdateAdminRequestDTO): Promise<void> {
    try{
       const admin = await this.adminDao.getAdminById(requestUpdateAdmin.id);
       if(!admin) throw new Error("admin is not exist");
       if(admin.id !== requestUpdateAdmin.userId) throw new Error("you don't have a permission to update");
       admin.user_name = requestUpdateAdmin.user_name
       admin.email = requestUpdateAdmin.email;
       admin.address = requestUpdateAdmin.address;
       admin.phone_number = requestUpdateAdmin.phone_number;
       const updatedAdmin = await this.adminDao.updateAdmin(admin);
       if(!updatedAdmin) throw new Error("oops failed to update");
    }catch(err){
      throw new Error((err as Error).message);
    }
  }
}

export default AdminService;