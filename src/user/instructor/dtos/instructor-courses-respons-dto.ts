import Levels from "../../../courses/levels.enum"

interface InstructorCoursesResponse{
  id : string
  title : string
  description : string
  requirements : string
  level: Levels
  picture : string
}

export default InstructorCoursesResponse;