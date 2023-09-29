interface UpdateCourseRequestDTO {
  id: string
  title: string,
  description : string,
  userId : string,
  userRole: string,
  level: string,
  requirements: string,
}

export default UpdateCourseRequestDTO;