import React from 'react';
import styled from 'styled-components';
import { Pagination } from 'antd';
import { ResultItem } from './ResultItem';
import { media } from 'styles/media';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectFromDate,
    selectIsSearching,
    selectPage, selectPageSize, selectResults,
    selectSearchKeyword,
    selectToDate,
    selectTotal
} from '../../slice/selectors';
import { useHomeSlice } from '../../slice';
import { useHistory, useLocation } from 'react-router-dom';

export const FilterResult = (props) => {

    const { t } = useTranslation();

    const results = useSelector(selectResults);

    const isSearching = useSelector(selectIsSearching);

    const total = useSelector(selectTotal);

    const page = useSelector(selectPage);

    const searchKeyword = useSelector(selectSearchKeyword);

    const fromDate = useSelector(selectFromDate);

    const toDate = useSelector(selectToDate);

    const pageSize = useSelector(selectPageSize);

    const { actions } = useHomeSlice();

    const history = useHistory();

    const location = useLocation();

    const dispatch = useDispatch();

    const onPaginationPageChanged = (page, pageSize) => {
        handleOnPaginationChanged(page, pageSize);
    }

    const searchRacesOnEnter = () => {
        if (location.search) {
            const search = location.search.substring(1);
            const params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

            dispatch(actions.setKeyword(params.keyword ?? ''));
            dispatch(actions.setFromDate(params.from_date ?? ''));
            dispatch(actions.setToDate(params.to_date ?? ''));
            dispatch(actions.searchRaces(params));
        }
    }

    const handleOnPaginationChanged = (page, pageSize) => {
        const params: any = {};

        params.page = page;
        params.size = pageSize;
        params.keyword = searchKeyword;

        if (fromDate !== '') params.from_date = fromDate;
        if (toDate !== '') params.to_date = toDate;

        dispatch(actions.setPage(Number(params.page) ?? 1));
        dispatch(actions.setPageSize(params.size ?? 10));
        dispatch(actions.setKeyword(params.keyword));
        dispatch(actions.setFromDate(params.from_date ?? ''));
        dispatch(actions.setToDate(params.to_date ?? ''));
        dispatch(actions.searchRaces(params));

        history.push({
            pathname: '/',
            search: Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
        });
    }

    React.useEffect(() => {
        searchRacesOnEnter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderResult = () => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: NoResult,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        if (results.length === 0)
            return (
                <LottieWrapper>
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width={400} />
                    <LottieMessage>{isSearching ? t(translations.home_page.filter_tab.filter_result.searching) : t(translations.home_page.filter_tab.filter_result.start_searching_by_typing_something)}</LottieMessage>
                </LottieWrapper>);

        return results.map((result, index) => {
            return <ResultItem item={result} key={index} index={index} />
        });
    }

    return (
        <Wrapper>
            {(results.length > 0 && !isSearching) ?
                (<>
                    <ResultWrapper>
                        <ResultCountText>{t(translations.home_page.filter_tab.filter_result.about_number_result, { total: String(total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") })}</ResultCountText>
                        {renderResult()}
                    </ResultWrapper>
                    <PaginationWrapper>
                        <Pagination defaultCurrent={page} current={page} onChange={onPaginationPageChanged} total={total} pageSize={pageSize} />
                    </PaginationWrapper>
                </>) : (
                    <ResultWrapper>
                        {renderResult()}
                    </ResultWrapper>
                )
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 15px;

    ${media.medium`
        width: 65%;
        padding: 0 5px;
        height: 80vh;
        overflow-y: auto;
    `}
`;

const ResultCountText = styled.div`
    align-self: flex-start;
    margin-bottom: 10px;
    color: #70757a;
`;

const PaginationWrapper = styled.div`
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const ResultWrapper = styled.div`
    width: 100%;

    ${media.medium`
        width: 70%;
    `}
`;

const LottieWrapper = styled.div`
    text-align: center;
    margin-top: 15px;

    ${media.medium`
        margin-top: 100px;
    `}
`;

const LottieMessage = styled.span`
   color: #70757a;
`;