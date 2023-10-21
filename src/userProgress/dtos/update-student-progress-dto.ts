import Roles from "../../utils/roles.enum";
import StatusProgress from "../statusProgress.enum";

interface UpdateStudentProgressDTO {
  user_id:string
  user_role: Roles
  course_id: string
  lesson_id:string
  topic_id:string
  status: StatusProgress
}
export default UpdateStudentProgressDTO;