import React from 'react';
import styled from 'styled-components/macro';
import { Logo } from '../NavBar/Logo';
import { Nav } from '../NavBar/Nav';

export const HeaderContent = (props) => {
    return (
        <Wrapper>
            <Logo type="dark" />
            <Nav />
        </Wrapper>
    )
}

const Wrapper = styled.nav`
display: flex;
margin-right: -1rem;
justify-content: space-between;
align-self: center;
width: 95%;
`;