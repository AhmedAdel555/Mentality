import Roles from "../../utils/roles.enum";

interface AddCourseRegistrationDTO {
  user_id:string
  user_role:Roles
  course_id: string
}
export default AddCourseRegistrationDTO;