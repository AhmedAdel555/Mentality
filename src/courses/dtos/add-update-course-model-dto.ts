interface AddUpdateCourseModelDTO{
  id ?:string ,
  title : string,
  description : string,
  instructor_id : string,
  level: string,
  requirements: string,
  picture: string
}

export default AddUpdateCourseModelDTO;