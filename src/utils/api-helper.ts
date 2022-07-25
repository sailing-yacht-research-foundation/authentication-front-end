import { CourseSequencedGeometry } from "types/Course";
import { create as createMarkTracker } from 'services/live-data-server/mark-tracker';

export const addTrackerIdForCourseIfNotExists = async (courseSequencedGeometries, eventId) => {
    const clonedcourseSequencedGeometries: CourseSequencedGeometry[] = JSON.parse(JSON.stringify(courseSequencedGeometries));

    for(let geometry of clonedcourseSequencedGeometries) {
        for (let point of geometry.points) {
            if (!point.markTrackerId) {
                point.markTrackerId = await generateTracker(eventId);
            }
        }
    }

    return clonedcourseSequencedGeometries;
}

export const generateTracker = async (eventId) => {
    const response = await createMarkTracker({
        "name": "Event Tracker",
        "userProfileId": null,
        "calendarEventId": eventId
    });

    if (response.success) return response.data?.id;

    return null;
}
