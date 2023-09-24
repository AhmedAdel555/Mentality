import levels from "./levels.enum";
type course = {
    id? :string,
    title: string,
    description: string,
    instructorId: string,
    levelId: levels
};

export default course;