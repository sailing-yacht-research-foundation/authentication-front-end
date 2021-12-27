import React from 'react';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { debounce } from 'utils/helpers';
import { useHistory } from 'react-router';
import { searchForProfiles } from 'services/live-data-server/profile';
import { getUserAttribute, renderAvatar } from 'utils/user-utils';

export const SearchProfilesAutoComplete = ({ keyword, user }) => {

    const history = useHistory();

    const [results, setResults] = React.useState<any[]>([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSuggestion = React.useCallback(debounce((keyword) => getSuggestions(keyword), 300), []);

    React.useEffect(() => {
        if (keyword && keyword.length > 0)
            debounceSuggestion(keyword);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    const getSuggestions = async (keyword) => {
        const response = await searchForProfiles(keyword, getUserAttribute(user, 'locale'));

        if (response.success) {
            setResults(response?.data?.rows);
        }
    }

    const renderProfileResults = () => {
        if (keyword.length === 0) return <></>;
        return results.map(profile => {
            return (
                <Row key={profile.id} onClick={() => history.push(`/profile/${profile.id}`)}>
                    <AvatarContainer>
                        <img src={renderAvatar(profile.avatar)} alt={profile.name} />
                    </AvatarContainer>
                    <RightInfoContainer>
                        <Name>{profile.name}</Name>
                    </RightInfoContainer>
                </Row>
            )
        })
    }

    return (
        <Wrapper>
            {renderProfileResults()}
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

const Row = styled.div`
    width: 100%;
    padding: 10px;
    display: flex;
    cursor: pointer;
    align-items: center;

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

const AvatarContainer = styled.div`
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

const RightInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Name = styled.h3`
    margin-bottom: 5px;
    font-size: 14px;
`;