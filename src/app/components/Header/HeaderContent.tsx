import React from 'react';
import styled from 'styled-components';
import { Logo } from '../NavBar/Logo';
import { Nav } from '../NavBar/Nav';
import { media } from 'styles/media';
import { SiderToggle } from '../NavBar/SiderToggle';

export const HeaderContent = (props) => {
    return (
        <Wrapper>
            <SiderToggle />
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

    ${media.large`
        width: 90%;
    `};

    ${media.medium`
        width: 100%%;
    `};

    ${media.small`
        width: 100%%;
    `};
`;

const StyledLogo = styled(Logo)`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    ${media.medium`
        position: static;
    `} 
`;