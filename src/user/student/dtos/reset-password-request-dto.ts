interface ResetPasswordRequestDTO {
  userId:string
  userRole:string
  oldPassword:string
  password: string
  confirmPassword:string
}

export default ResetPasswordRequestDTO;