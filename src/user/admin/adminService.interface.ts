import AddAdminRequestDTO from "./dtos/add-admin-request-dto";

interface IAdminService {
    addAdmin(admin: AddAdminRequestDTO): Promise<void>;
    getAdmins(): Promise<ResponseAdminInfoDTO[]>;
    getAdmin(id:string): Promise<AdminInfoDTO>;
    updateAdmin(admin: AdminInfoDTO): Promise<void>;
}

export default IAdminService;
