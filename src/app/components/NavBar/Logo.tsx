import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ReactComponent as LogoDark } from './assets/logo-dark.svg';
import { media } from 'styles/media';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';

export function Logo(props) {

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const location = useLocation();

  const [leftAligned, setLeftAligned] = React.useState<boolean>(false);


  React.useEffect(() => {
    setLeftAligned((location.pathname === '/') && !isAuthenticated);
  }, [location]);

  return (
    <Wrapper {...props} className={leftAligned ? 'left-aligned-logo' : ''}>
      <Link to="/">
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

  &.left-aligned-logo {
    left: 0 !important;
    right: auto;
  }

${media.medium`
  height: auto;
  position: relative;
`}
`;