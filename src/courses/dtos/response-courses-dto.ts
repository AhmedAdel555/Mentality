interface ResponseCourseDTO{
  id :string ,
  title : string,
  description : string,
  instructor : {
    id: string,
    userName: string,
    title: string,
    description: string,
    profilePicture: string
  },
  level: string,
  requirements: string,
  picture: string
}
export default ResponseCourseDTO;