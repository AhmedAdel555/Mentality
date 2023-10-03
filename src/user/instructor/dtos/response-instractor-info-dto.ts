import CourseModel from "../../../courses/course.model"

interface ResponseInstractorInfoDTO {
  id :string
  userName:string
  title :string
  description : string
  email :string
  profilePicture : string
  courses: CourseModel[]
  phoneNumber ?:string | null
  address ?: string | null
}

export default ResponseInstractorInfoDTO;