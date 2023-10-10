interface AdminInfoResponseDTO {
   id: string
   user_name:string
   email:string
   profile_picture:string
   phone_number:string | null
   address:string | null
}
export default AdminInfoResponseDTO;