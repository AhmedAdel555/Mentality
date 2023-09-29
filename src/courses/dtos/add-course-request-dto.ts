interface AddCourseRequestDTO {
    title: string,
    description : string,
    userId : string,
    userRole: string,
    level: string,
    requirements: string,
    picture: string | undefined,
}

export default AddCourseRequestDTO;