import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import { GroupMemberStatus } from 'utils/constants';
import { Tag } from 'antd'

export const UserItemRow = (props) => {

    const { item } = props;

    const { t } = useTranslation();

    const renderTag = () => {
        switch (item.status) {
            case GroupMemberStatus.invited:
                return <StyledTag color="cyan">{t(translations.group.pending)}</StyledTag>;
            case GroupMemberStatus.requested:
                return <StyledTag color="cyan">{t(translations.group.requested)}</StyledTag>;
            case GroupMemberStatus.declined:
                return <StyledTag color="magenta">{t(translations.group.declined)}</StyledTag>;
            default:
                return <></>;
        }
    }

    return (
        <UserItem>
            <UserInnerContainer>
                <UserAvatarContainer style={{ background: "url('/default-avatar.png')", backgroundSize: 'cover' }} />
                <UserInforContainer>
                    <UserName>{item?.member?.name} {renderTag()}</UserName>
                    <UserDescription>{item?.isAdmin ? t(translations.group.admin) : t(translations.group.member)}</UserDescription>
                </UserInforContainer>
            </UserInnerContainer>
            <UserActionButtonContainer>
                {props.buttons}
            </UserActionButtonContainer>
        </UserItem>
    )
}

const UserItem = styled.div`
    display: flex;
    align-items: center;
    &:not(:last-child) {
        padding-bottom: 15px;
        margin-bottom: 15px;
        border-bottom: 1px solid #eee;
    }
`;

const UserAvatarContainer = styled.div`
    width: 35px;
    height: 35px;
    border: 1px solid #eee;
    border-radius: 50%;
    margin-right: 15px;
`;

const UserInforContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const UserName = styled.a`
    font-weight: bold;
`;

const UserDescription = styled.span`
    color: hsl(210, 8%, 45%);
    font-size: 13px;
`;

const UserInnerContainer = styled.div`
    display: flex;
    flex: .5;
`;

const UserActionButtonContainer = styled.div`
    flex: .5;
    display: flex;
    justify-content: flex-end;
`;

const StyledTag = styled(Tag)`
    font-weight: normal;
    margin-left: 10px;
`;