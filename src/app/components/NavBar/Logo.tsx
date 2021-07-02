import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ReactComponent as LogoDark } from './assets/logo-dark.svg';
import { media } from 'styles/media';

export function Logo(props) {
  return (
    <Wrapper {...props}>
      <Link to="/deals">
        <StyledLogoDark />
      </Link>
    </Wrapper>
  );
}

const StyledLogoDark = styled(LogoDark)`
  display: block;
  height: 25px;
  
  ${media.medium`
    height: auto;
  `}
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom:0;


${media.medium`
  height: auto;
  position: relative;
`}
`;