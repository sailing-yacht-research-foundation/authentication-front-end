import React from 'react';
import styled from 'styled-components';
import { Pagination } from 'antd';
import { ResultItem } from './ResultItem';
import { media } from 'styles/media';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useSelector } from 'react-redux';
import {
    selectIsSearching,
    selectNoResultsFound,
    selectPage, selectPageSize, selectResults,
    selectTotal
} from '../../slice/selectors';
import { LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import { renderNumberWithCommas } from 'utils/helpers';
import { LiveAndHappeningRaces } from './LiveAndHappeningRaces';

export const FilterResult = (props) => {

    const { onPaginationPageChanged } = props;

    const { t } = useTranslation();

    const results = useSelector(selectResults);

    const isSearching = useSelector(selectIsSearching);

    const total = useSelector(selectTotal);

    const page = useSelector(selectPage);

    const pageSize = useSelector(selectPageSize);

    const noResultsFound = useSelector(selectNoResultsFound);

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
                <>
                    {isSearching || noResultsFound ? <LottieWrapper>
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400} />

                        <LottieMessage>{isSearching ? t(translations.home_page.searching) : t(translations.home_page.no_results_found)}</LottieMessage>
                    </LottieWrapper> : <LiveAndHappeningRaces />}
                </>
            );

        return results.map((result, index) => {
            return <ResultItem item={result} key={index} index={index} />
        });
    }

    return (
        <Wrapper className="search-step-listview-show-detail-results playback-step">
            {(results.length > 0 && !isSearching) ?
                (<>
                    <ResultWrapper>
                        <ResultCountText>{t(translations.home_page.about_number_result, { total: renderNumberWithCommas(total) })}</ResultCountText>
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
