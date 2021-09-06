import * as React from 'react';
import { CourseList } from './components/CoursesList';
import { Wrapper } from 'app/components/SyrfGeneral';

export function HomePage() {
  return (
    <Wrapper>
      <CourseList/>
    </Wrapper>
  );
}