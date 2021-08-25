import * as React from 'react';
import styled from 'styled-components/macro';
import { CourseList } from './components/CoursesList';
import { StyleConstants } from 'styles/StyleConstants';
export function HomePage() {

  return (
    <Wrapper>
      <CourseList/>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;