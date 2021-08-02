import * as React from 'react';
import styled from 'styled-components/macro';
import { Main } from './components/Main';
import { StyleConstants } from 'styles/StyleConstants';

export function HomePage() {
  return (
    <Wrapper>
      <Main/>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;