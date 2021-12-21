import React from 'react';
import styled from 'styled-components';
import { Input, Spin } from 'antd';
import { ResultItem } from './ResultItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsSearching, selectResults } from '../slice/selectors';
import { useProfileSearchSlice } from '../slice';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute } from 'utils/user-utils';
import { PeopleYouMayKnow } from 'app/components/SocialProfile/PeopleYouMayKnow';
import Lottie from 'react-lottie';
import People from '../assets/people.json';
import { LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { SearchProfilesAutoComplete } from 'app/components/SocialProfile/SearchProfilesAutoComplete';

const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: People,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const Main = () => {

    const isSearching = useSelector(selectIsSearching)

    const results = useSelector(selectResults);

    const dispatch = useDispatch();

    const { actions } = useProfileSearchSlice();

    const user = useSelector(selectUser);

    const { t } = useTranslation();

    const [keyword, setKeyword] = React.useState<string>('');

    const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);

    const searchForProfiles = (keyword) => {
        setShowSuggestions(false);
        dispatch(actions.searchProfiles({ name: keyword, locale: getUserAttribute(user, 'locale') }));
    }

    const renderResults = () => {
        return results.map(profile => <ResultItem profile={profile} />)
    }

    return (
        <Wrapper>
            <SearchResultWrapper>
                <SearchBarWrapper>
                    <SearchBar onChange={e => {
                        setKeyword(e.target.value);
                        setShowSuggestions(true);
                    }} onSearch={searchForProfiles} allowClear placeholder={t(translations.public_profile.start_searching_by_typing_something)} />
                    {showSuggestions && <SearchProfilesAutoComplete keyword={keyword} user={user} />}
                </SearchBarWrapper>
                <Spin spinning={isSearching}>
                    {
                        results.length > 0 ? (
                            <ResultWrapper>
                                {renderResults()}
                            </ResultWrapper>) : (
                            <LottieWrapper>
                                <Lottie
                                    options={defaultLottieOptions}
                                    height={400}
                                    width={'100%'} />
                                <LottieMessage>{t(translations.public_profile.start_searching_by_typing_something)}</LottieMessage>
                            </LottieWrapper>)
                    }
                </Spin>
            </SearchResultWrapper>
            <RightPaneWrapper>
                <PeopleYouMayKnow />
            </RightPaneWrapper>
        </Wrapper>
    );
}

const SearchResultWrapper = styled.div`
    flex: .7;
    text-align: right;
    
`;

const SearchBar = styled(Input.Search)``;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;

    ${media.medium`
        flex-direction: row;
    `};
`;

const ResultWrapper = styled.div`
    background: #fff;
    padding: 15px;
    border-radius: 5px;
`;

const RightPaneWrapper = styled.div`
    ${media.medium`
        flex: .3;
        margin-left: 15px;
    `};
    padding: 15px;
`;

const SearchBarWrapper = styled.div`
    position: relative;
    width: 255px;
    margin-top: 30px;
    display: inline-block;
`;