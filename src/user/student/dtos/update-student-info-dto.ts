interface UpdateStudentInfoDTO {
  userName:string
  email:string
  phoneNumber:string | null
  address:string | null
  userId:string
  userRole:string 
}

export default UpdateStudentInfoDTO;