import React from 'react';
import styled from 'styled-components';

export const Nav = () => {
    return (
        <Wrapper>
            <InnerWrapper>
                <NavItem>Overview</NavItem>
                <NavItem>Post</NavItem>
                <NavItem className="active">Members</NavItem>
                <NavItem>Events</NavItem>
                <NavItem>Media</NavItem>
            </InnerWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const InnerWrapper = styled.div`
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 5px;
    display: flex;
    flex-direction: row;
`;

const NavItem = styled.div`
    border-radius: 15px;
    padding: 10px 15px;
    margin: 0 10px;
    cursor: pointer;

    &.active {
        background: #fff;
        border: 1px solid #eee;
    }
`;