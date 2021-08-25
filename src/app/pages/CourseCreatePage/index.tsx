import React from 'react';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { CourseCreate } from './components/CourseCreate';

export const CourseCreatePage = () => {
    return (
        <Wrapper>
            <CourseCreate />
        </Wrapper>
    );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;