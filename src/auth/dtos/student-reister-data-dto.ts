import StudentRegisterRequestDto from "./student-register-request-dto";

interface StudentRegisterDataDto extends StudentRegisterRequestDto{
    avatar: string
};

export default StudentRegisterDataDto;