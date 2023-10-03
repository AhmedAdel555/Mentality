interface AddInstructorRequestDTO {
  userId:string,
  userRole:string,
  email: string,
  userName: string,
  password: string;
  confirmPassword:string,
  title :string
  description : string
}

export default AddInstructorRequestDTO;