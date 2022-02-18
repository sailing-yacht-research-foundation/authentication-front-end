import { PayloadAction } from '@reduxjs/toolkit';
import { Course } from 'types/Course';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import courseCreateSaga from './saga';
import { CourseState } from './types';

export const initialState: CourseState = {
  course_sequenced_geometries: [],
  page: 1,
  total_course: 0,
  courses: [],
  is_handling_course: false,
};

const slice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourseSequencedGeometries(state, action: PayloadAction<any[]>) {
      state.course_sequenced_geometries = action.payload;
    },
    getCourses() { },
    updateCourse(state, action: PayloadAction<any>) { },
    deleteCourse(state, action: PayloadAction<string>) { },
    createCourse(state, action: PayloadAction<any>) { },
    setCourses(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setTotalCourses(state, action: PayloadAction<number>) {
      state.total_course = action.payload;
    },
    setIsHandlingCourse(state, action: PayloadAction<boolean>) {
      state.is_handling_course = action.payload;
    }
  },
});

export const { actions: courseActions, reducer } = slice;

export const useCourseSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: courseCreateSaga });
  return { actions: slice.actions };
};
