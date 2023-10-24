import Roles from "../../utils/roles.enum";

interface GetStudentLessonProgressDTO {
  course_id: string,
  lesson_id: string,
  topic_id: string,
  user_id: string,
  user_role: Roles
}
export default GetStudentLessonProgressDTO;