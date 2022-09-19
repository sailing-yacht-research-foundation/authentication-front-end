import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { searchGroups } from 'services/live-data-server/groups';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { appendThumbnail, renderNumberWithCommas, uppercaseFirstCharacter } from 'utils/helpers';
import { VisibilityOfGroup } from './VisibilityOfGroup';
import { debounce } from 'utils/helpers';
import { useHistory } from 'react-router';
import { DEFAULT_GROUP_AVATAR } from 'utils/constants';
import { SYRFImage } from 'app/components/SyrfGeneral/SYRFImage';

export const GroupSearchAutoComplete = ({ keyword, showSuggestions, setShowSuggestions }) => {

    const history = useHistory();

    const [results, setResults] = React.useState<any[]>([]);

    const { t } = useTranslation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSuggestion = React.useCallback(debounce((keyword) => getSuggestions(keyword), 300), []);

    React.useEffect(() => {
        if (keyword && keyword.length > 0)
            debounceSuggestion(keyword);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    const getSuggestions = async (keyword) => {
        const response = await searchGroups(keyword, 1, 10);

        if (response.success) {
            setResults(response?.data?.rows);
        }
    }

    const renderGroupResult = () => {
        if (keyword.length === 0) return <></>;
        return results.map(group => {
            return (
                <GroupRow key={group.id} onClick={() => history.push(`/groups/${group.id}`)}>
                    <GroupAvatarContainer>
                        <SYRFImage alt={group?.groupName} fallback={group.groupImage} src={appendThumbnail(group.groupImage) || DEFAULT_GROUP_AVATAR} />
                    </GroupAvatarContainer>
                    <GroupRightInfoContainer>
                        <GroupName>{group.groupName}</GroupName>
                        <GroupInfo>{uppercaseFirstCharacter(group.groupType)} • <VisibilityOfGroup visibility={group.visibility} /> • {t(translations.group.number_of_members, { numberOfMembers: renderNumberWithCommas(group.memberCount) })}</GroupInfo>
                    </GroupRightInfoContainer>
                </GroupRow>
            )
        })
    }

    return (
        <Wrapper>
            {showSuggestions && renderGroupResult()}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    border: 1px solid #eee;
    position: absolute;
    background: #fff;
    width: 100%;
    z-index: 10;
`;

const GroupRow = styled.div`
    width: 100%;
    padding: 10px;
    display: flex;
    cursor: pointer;

    &:hover {
        background: ${StyleConstants.MAIN_TONE_COLOR};
        color: #fff;

        h3 {
            color: #fff;
        }
    }

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }
`;

const GroupAvatarContainer = styled.div`
    width: 40px;
    height: 40px;
    margin-right: 10px;
    flex: 0 0 auto;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #eee;
    }
`;

const GroupRightInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const GroupName = styled.h3`
    margin-bottom: 5px;
    font-size: 14px;
`;

const GroupInfo = styled.span`

`;
