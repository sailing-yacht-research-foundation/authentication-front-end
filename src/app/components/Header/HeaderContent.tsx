import React from 'react';
import styled from 'styled-components';
import { Logo } from '../NavBar/Logo';
import { Nav } from '../NavBar/Nav';
import { media } from 'styles/media';
import { SiderToggle } from '../NavBar/SiderToggle';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';


export const HeaderContent = (props) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return (
        <Wrapper>
            {
                !isAuthenticated ? <>
                    <Logo type="dark" align="left" />
                </> : (
                    <>
                        <SiderToggle />
                        <div></div>
                    </>
                )
            }
            <StyledLogo type="dark" align="left" />
            <Nav />
        </Wrapper>
    )
}

const Wrapper = styled.nav`
    display: flex;
    justify-content: space-between;
    align-self: center;
    width: 100%;
    flex-direction: row-reverse;

    ${media.medium`
        width: 90%;
        flex-direction: row;
    `};

    ${media.small`
        width: 100%%;
    `};
`;

const StyledLogo = styled(Logo)`
    display: flex;

    ${media.medium`
        display: none;
    `}
`