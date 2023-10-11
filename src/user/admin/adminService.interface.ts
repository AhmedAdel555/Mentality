import AddAdminRequestDTO from "./dtos/add-admin-request-dto";
import AdminInfoResponseDTO from "./dtos/admin-info-response-dto";
import ChangeProfilePictureRequsetDTO from "../dtos/change-profile-picture-requset-dto";
import ResetPasswordRequestDTO from "../dtos/reset-password-request-dto";
import UpdateAdminRequestDTO from "./dtos/update-admin-request-dto";

interface IAdminService {
    addAdmin(adminAddRequest: AddAdminRequestDTO): Promise<void>;
    getAdmins(): Promise<AdminInfoResponseDTO[]>;
    getAdmin(id: string): Promise<AdminInfoResponseDTO>;
    updateAdmin(requestUpdateAdmin: UpdateAdminRequestDTO): Promise<void>;
    resetPassword(resetPasswordRequestDTO: ResetPasswordRequestDTO): Promise<void>;
    changeProfilePicture(changeProfilePictureRequsetDTO: ChangeProfilePictureRequsetDTO): Promise<string>;
}

export default IAdminService;
