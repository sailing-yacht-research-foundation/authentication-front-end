import React from 'react';
import styled from 'styled-components';
import { AiFillUnlock } from 'react-icons/ai';
import { UserName, UserAvatarContainer, UserDescription, UserItem, UserInforContainer } from './Main';

export const LeftPane = () => {
    return (
        <Wrapper>
            <SectionContainer style={{ textAlign: 'center' }}>
                <GroupAvatar style={{ background: "url('/hero-homepage-3.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
                <GroupName>SYRF Sailing Group</GroupName>
                <GroupType>Organization</GroupType>
                <GroupTypeAndMemeber><AiFillUnlock /> Private Group • 225k members</GroupTypeAndMemeber>
            </SectionContainer>

            <SectionContainer>
                <SectionTitle>About</SectionTitle>
                <GroupDescription>
                    We're SYRF Sailing Group.
                </GroupDescription>
            </SectionContainer>

            <SectionContainer>
                <SectionTitle>Admins (10)</SectionTitle>
                <AdminListContainer>
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

                    <UserItem>
                        <UserAvatarContainer style={{ background: "url('https://cdn.dribbble.com/users/439063/avatars/small/4f4177a2f6c0cc8e75dde4ff6b3705ae.png?1634834389')", backgroundSize: 'cover' }} />
                        <UserInforContainer>
                            <UserName>John Doe</UserName>
                            <UserDescription>Admin</UserDescription>
                        </UserInforContainer>
                    </UserItem>
                </AdminListContainer>
            </SectionContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 25%;
    margin-top: 15px;
`;

const SectionContainer = styled.div`
    background: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 15px;

    &:not(:last-child) {
        margin-bottom: 15px;
    }
`;

const GroupTypeAndMemeber = styled.span`
    color: hsl(210, 8%, 45%);
`;

const GroupName = styled.h2``;

const GroupAvatar = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 15px auto;
`;

const SectionTitle = styled.h3`
    padding: 10px 0;
`;

const AdminListContainer = styled.div`
    text-align: left;
`;

const GroupType = styled.div`
    padding-bottom: 10px;
    font-weight: 500;
`;

const GroupDescription = styled.p`
    padding: 10px;
    font-size: 13px;
`;