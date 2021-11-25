import React from 'react';
import styled from 'styled-components';
import { AiFillLock } from 'react-icons/ai';
import { GiEarthAmerica } from 'react-icons/gi';
import { MdOutlineAddModerator } from 'react-icons/md';
import { renderNumberWithCommas, uppercaseFirstCharacter } from 'utils/helpers';
import { media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { GroupAvatar } from './GroupAvatar';

const enum GroupVisibility {
    public = 'PUBLIC',
    private = 'PRIVATE',
    moderated = 'MODERATED'
}

export const LeftPane = (props) => {

    const { t } = useTranslation();

    const { group } = props;

    const renderGroupVisibility = (visibility) => {
        switch (visibility) {
            case GroupVisibility.private:
                return <><AiFillLock /> {uppercaseFirstCharacter(visibility)}</>
            case GroupVisibility.public:
                return <><GiEarthAmerica /> {uppercaseFirstCharacter(visibility)}</>
            default:
                return <><MdOutlineAddModerator /> {uppercaseFirstCharacter(visibility)}</>
        }
    }

    return (
        <Wrapper>
            <SectionContainer className="center">
                <GroupAvatar group={group} />
                <GroupName>{group.groupName}</GroupName>
                <GroupType>{uppercaseFirstCharacter(group.groupType)}</GroupType>
                <GroupTypeAndMemeber>{renderGroupVisibility(group.visibility)} • {renderNumberWithCommas(group.memberCount)} members</GroupTypeAndMemeber>
            </SectionContainer>

            {
                group.description && <SectionContainer>
                    <SectionTitle>{t(translations.group.about)}</SectionTitle>
                    <GroupDescription>
                        {group.description}
                    </GroupDescription>
                </SectionContainer>
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    ${media.medium`
        width: 25%;
    `}

    width: 100%;
    margin-top: 15px;
`;

const SectionContainer = styled.div`
    background: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 15px;
    text-overflow: ellipsis;

    &:not(:last-child) {
        margin-bottom: 15px;
    }

    &.center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
`;

const GroupTypeAndMemeber = styled.span`
    color: hsl(210, 8%, 45%);
`;

const GroupName = styled.h2`
    margin-top: 20px;
    text-align: center;
`;

const SectionTitle = styled.h3`
    padding: 10px 0;
`;

const GroupType = styled.div`
    padding-bottom: 10px;
    font-weight: 500;
`;

const GroupDescription = styled.p`
    padding: 10px;
    font-size: 13px;
`;