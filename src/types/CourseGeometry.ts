export interface CourseGeometrySequenced {
  id?: string;
  courseId: string;
  geometryType: string;
  order: number;
  coordinates: number[][];
}

export interface MappedCourseGeometrySequenced {
  id?: string;
  geometryType: string;
  coordinates: number[][];
}
