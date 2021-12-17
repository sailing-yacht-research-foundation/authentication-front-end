import React from 'react';
import styled from 'styled-components';
import { Input, Spin } from 'antd';
import { ResultItem } from './ResultItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsSearching, selectResults } from '../slice/selectors';
import { useProfileSearchSlice } from '../slice';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute } from 'utils/user-utils';
import { PeopleYouMayKnow } from 'app/pages/PublicProfilePage/components/PeopleYouMayKnow';
import Lottie from 'react-lottie';
import People from '../assets/people.json';
import { LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';

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

    const searchForProfiles = (keyword) => {
        dispatch(actions.searchProfiles({ name: keyword, locale: getUserAttribute(user, 'locale') }));
    }

    const renderResults = () => {
        return results.map(profile => <ResultItem profile={profile} />)
    }

    return (
        <Wrapper>
            <SearchResultWrapper>
                <SearchBar onSearch={searchForProfiles} allowClear placeholder="Search people..." />
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
                            <LottieMessage>Start searching by typing something.</LottieMessage>
                        </LottieWrapper>)
                }
                </Spin>
            </SearchResultWrapper>
            <PeopleYouMayKnow />
        </Wrapper>
    );
}

const SearchResultWrapper = styled.div`
    flex: .7;
    text-align: right;
`;

const SearchBar = styled(Input.Search)`
    width: 255px;
    margin-top: 30px;
`;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
`;

const ResultWrapper = styled.div`
    background: #fff;
    padding: 15px;
    border-radius: 5px;
`;