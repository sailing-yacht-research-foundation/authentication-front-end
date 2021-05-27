import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ReactComponent as LogoLight } from './assets/logo-light.svg';
import { ReactComponent as LogoDark } from './assets/logo-dark.svg';



export function Logo(props) {
  const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props.type === 'light' ? '20px' : '0px'} 0;
  `;

  return (
    <Wrapper>
      <Link to="/">
        {
          props.type === 'light' ? <LogoLight /> : <LogoDark />
        }
      </Link>
    </Wrapper>
  );
}

