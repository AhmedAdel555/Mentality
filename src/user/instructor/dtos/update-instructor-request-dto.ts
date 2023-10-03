interface UpdateInstructorRequestDTO {
  id :string
  userName:string
  title :string
  description : string
  email :string
  phoneNumber ?:string | null
  address ?: string | null
  userId: string
  userRole: string
}

export default UpdateInstructorRequestDTO;