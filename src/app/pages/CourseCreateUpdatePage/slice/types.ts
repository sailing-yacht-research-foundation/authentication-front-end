/* --- STATE --- */
export interface CourseState {
    course_sequenced_geometries: any[];
    page: number;
    total_course: number;
    courses: any[];
    is_handling_course: boolean;
}

export type ContainerState = CourseState;
