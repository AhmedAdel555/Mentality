import Roles from "../../utils/roles.enum";
import Levels from "../levels.enum";

interface UpdateCourseRequestDTO {
  user_id:string
  user_role:Roles
  id: string
  title: string,
  description : string,
  level: Levels,
  requirements: string,
}

export default UpdateCourseRequestDTO;