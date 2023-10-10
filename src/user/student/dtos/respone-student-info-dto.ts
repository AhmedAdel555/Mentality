interface ResponeStudentInfoDTO{
  id: string
  user_name:string
  email:string
  profile_picture:string
  phone_number:string | null
  address:string | null
  points: number
}

export default ResponeStudentInfoDTO;