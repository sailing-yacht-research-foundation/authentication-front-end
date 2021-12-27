import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import { GroupMemberStatus } from 'utils/constants';
import { Tag } from 'antd';
import { renderAvatar } from 'utils/user-utils';
import { media } from 'styles/media';
import { useHistory } from 'react-router-dom';

export const UserItemRow = (props) => {

    const { item, pendingJoinRequest } = props;

    const { t } = useTranslation();

    const history = useHistory();

    const renderTag = () => {
        switch (item.status) {
            case GroupMemberStatus.INVITED:
                return <StyledTag color="cyan">{t(translations.group.pending)}</StyledTag>;
            case GroupMemberStatus.REQUESTED:
                return <StyledTag color="cyan">{t(translations.group.requested)}</StyledTag>;
            case GroupMemberStatus.DECLINED:
                return <StyledTag color="magenta">{t(translations.group.declined)}</StyledTag>;
            default:
                return <></>;
        }
    }

    return (
        <UserItem className={pendingJoinRequest ? 'breakline' : ''}>
            <UserInnerContainer>
                <UserAvatarContainer>
                    <img src={renderAvatar(item?.member?.avatar)} alt={item?.member?.name}/>
                </UserAvatarContainer>
                <UserInforContainer>
                    <UserName onClick={()=> history.push(`/profile/${item?.member?.id}`)}>{item?.member?.name || item?.email} {renderTag()}</UserName>
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

    &.breakline {
        flex-direction: column;
        align-items: flex-start;

        ${media.medium`
            flex-direction: row;
            align-items: flex-start;
        `}
    }
`;

const UserAvatarContainer = styled.div`
    width: 35px;
    height: 35px;
    margin-right: 15px;
    flex: 0 0 auto;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: 1px solid #eee;
        border-radius: 50%;
    }
`;

const UserInforContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const UserName = styled.a`
    font-weight: bold;
    cursor: pointer;
`;

const UserDescription = styled.span`
    color: hsl(210, 8%, 45%);
    font-size: 13px;
`;

const UserInnerContainer = styled.div`
    display: flex;
`;

const UserActionButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
`;

const StyledTag = styled(Tag)`
    font-weight: normal;
    margin-left: 10px;
`;