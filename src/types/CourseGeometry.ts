export interface CourseGeometryPoint {
  id: string;
  markTrackerId: string;
  order: number;
  position: number[];
  tracker: any;
}

export interface CourseGeometrySequenced {
  id?: string;
  courseId: string;
  geometryType: string;
  order: number;
  points: CourseGeometryPoint[];
  properties: any;
}

export interface MappedCourseGeometrySequenced {
  id?: string;
  geometryType: string;
  coordinates: number[][];
  properties: any;
  points: any[];
}
