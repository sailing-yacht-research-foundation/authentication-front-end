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
    selectPage, selectResults,
    selectSearchKeyword,
    selectToDate,
    selectTotal
} from '../../slice/selectors';
import { useHomeSlice } from '../../slice';
import { LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';

export const FilterResult = () => {

    const { t } = useTranslation();

    const results = useSelector(selectResults);

    const isSearching = useSelector(selectIsSearching);

    const total = useSelector(selectTotal);

    const page = useSelector(selectPage);

    const searchKeyword = useSelector(selectSearchKeyword);

    const fromDate = useSelector(selectFromDate);

    const toDate = useSelector(selectToDate);

    const { actions } = useHomeSlice();

    const dispatch = useDispatch();

    const onPaginationChanged = (page) => {
        const params: any = {};

        params.page = page;
        params.keyword = searchKeyword;

        if (fromDate !== '') params.from_date = fromDate;
        if (toDate !== '') params.to_date = toDate;

        dispatch(actions.searchRaces(params));
    }

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
                        <Pagination defaultCurrent={page} onChange={onPaginationChanged} total={total} />
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