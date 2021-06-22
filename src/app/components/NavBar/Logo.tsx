import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ReactComponent as LogoLight } from './assets/logo-light.svg';
import { ReactComponent as LogoDark } from './assets/logo-dark.svg';
import { media } from 'styles/media';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';

export function Logo(props) {
  
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const StyledLogoDark = styled(LogoDark)`
    display: block;
    height: 25px;
    
    ${media.medium`
      height: auto;
      display: ${isAuthenticated ? 'none' : 'block'};
    `}
  `;

  const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props.type === 'light' ? '20px' : '0px'} 0;
  `;

  return (
    <Wrapper {...props}>
      <Link to="/">
        {
          props.type === 'light' ? <StyledLogoLight/> : <StyledLogoDark />
        }
      </Link>
    </Wrapper>
  );
}

const StyledLogoLight = styled(LogoLight)`
  height: 25px;
      
  ${media.medium`
    height: auto;
  `}
`;