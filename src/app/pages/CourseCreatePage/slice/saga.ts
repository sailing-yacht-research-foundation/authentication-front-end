/**
 * Root saga manages watcher lifecycle
 */
 import { courseActions } from ".";
 import { call, put, takeLatest } from 'redux-saga/effects';
 import { list, create, deleteCourse, update } from "services/live-data-server/courses";
import { toast } from "react-toastify";


export function* getCourses() {
    const response = yield call(list);

    if (response.data && response.data?.rows > 0) {
        yield put(courseActions.setCourses(response.data?.rows));
        yield put(courseActions.setTotalCourses(response.data?.count));
    } else {
        toast.error('Unable to get course data');
    }
}

export function* createCourse(courseData) {
    const response = yield call(create, courseData);

    if (response.data) {
        toast.success('Course created successfully!');
    }
}

export function* deleteCourseHandler(courseId) {
    const response = yield call(deleteCourse, courseId);

    if (response.data) {
        toast.success('Successfully delete the course!');
    }
}

export function* updateCourse(data) {
    const response = yield call(update, data.courseId, data.courseData);

    if (response.data) {
        toast.success('Course updated successfully!');
    }
}

export default function* courseCreateSaga() {
    yield takeLatest(courseActions.createCourse.type, createCourse);
    yield takeLatest(courseActions.deleteCourse.type, deleteCourseHandler);
    yield takeLatest(courseActions.updateCourse.type, updateCourse);
    yield takeLatest(courseActions.getCourses.type, getCourses);
}
