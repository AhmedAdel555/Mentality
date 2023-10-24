import Roles from "../../utils/roles.enum";

interface GetAllCourseTasksSubmissionsDTO {
  course_id: string,
  user_id: string,
  user_role: Roles
}
export default GetAllCourseTasksSubmissionsDTO;