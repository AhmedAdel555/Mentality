import ResponseInstractorInfoDTO from "../../user/instructor/dtos/response-instractor-info-dto"
import Levels from "../levels.enum"

interface ResponseCourseInfoDTO{
   id : string
   title : string
   description : string
   requirements : string
   level: Levels
   picture : string
   instructor: ResponseInstractorInfoDTO
}

export default ResponseCourseInfoDTO;