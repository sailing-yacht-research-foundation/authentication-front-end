import { Profile } from "./Profile";

export interface Course {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    calendarEventId: string;
    createdById: string;
    updatedById: string;
    developerId: string;
    competitionUnit: any[];
    courseSequencedGeometries: CourseSequencedGeometry[];
    courseUnsequencedUntimedGeometry: any[];
    courseUnsequencedTimedGeometry: any[];
    event: Event;
    createdBy: Profile;
    updatedBy: Profile;
}

export interface CourseSequencedGeometry {
    id: string;
    validFrom: null;
    validTo: null;
    courseId: string;
    geometryType: string;
    order: number;
    properties: CourseSequencedGeometryProperties;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    updatedById: string;
    developerId: null;
    points: Point[];
}

export interface Point {
    id: string;
    position: number[];
    order: number;
    properties: PointProperties;
    markTrackerId: null;
    tracker: null;
}

export interface PointProperties {
    side: string;
}

export interface CourseSequencedGeometryProperties {
    name: string;
}