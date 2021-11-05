import React from 'react';
import styled from 'styled-components';
import { UserName, UserAvatarContainer, UserDescription, UserItem, UserInforContainer } from './Main';

export const RightPane = () => {
    return (
        <Wrapper>
            <SectionContainer>
                <SectionTitle>Members (30)</SectionTitle>
                <MemberList>
                    <UserItem>
                        <UserAvatarContainer style={{ background: "url('https://cdn.dribbble.com/users/439063/avatars/small/4f4177a2f6c0cc8e75dde4ff6b3705ae.png?1634834389')", backgroundSize: 'cover' }} />
                        <UserInforContainer>
                            <UserName>John Doe</UserName>
                            <UserDescription>Admin</UserDescription>
                        </UserInforContainer>
                    </UserItem>

                    <UserItem>
                        <UserAvatarContainer style={{ background: "url('https://cdn.dribbble.com/users/439063/avatars/small/4f4177a2f6c0cc8e75dde4ff6b3705ae.png?1634834389')", backgroundSize: 'cover' }} />
                        <UserInforContainer>
                            <UserName>John Doe</UserName>
                            <UserDescription>Admin</UserDescription>
                        </UserInforContainer>
                    </UserItem>
                </MemberList>
            </SectionContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 75%;
    margin-left: 15px;
    margin-top: 15px;
`;

const SectionContainer = styled.div`
    border: 1px solid #eee;
    border-radius: 10px;
    background: #fff;
    padding: 15px;
`;

const SectionTitle = styled.h3`
    padding: 10px 0;
`;

const MemberList = styled.div`

`;