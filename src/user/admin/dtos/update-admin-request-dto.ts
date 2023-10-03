interface UpdateAdminRequestDTO{
   id: string
   user_name:string
   email:string
   phone_number:string | null
   address:string | null
   userId:string
    userRole:string 
}
export default UpdateAdminRequestDTO;