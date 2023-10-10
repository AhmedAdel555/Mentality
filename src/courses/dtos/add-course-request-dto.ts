import Roles from "../../utils/roles.enum";
import Levels from "../levels.enum";

interface AddCourseRequestDTO {
  user_id:string
  user_role:Roles
  user_pricing_plan_id: string
  title: string,
  description : string,
  level: Levels,
  requirements: string,
  picture: string,
}

export default AddCourseRequestDTO;