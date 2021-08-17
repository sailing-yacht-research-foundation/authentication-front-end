import React from 'react';
import styled from 'styled-components';
import { Pagination } from 'antd';
import { ResultItem } from './ResultItem';
import { media } from 'styles/media';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

const resultData = [
    {
        'name': 'Race at Italy west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'East Viginia'
    },
    {
        'name': 'Race at US west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'South America'
    },
    {
        'name': 'Race at Wales west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'South New Wales'
    },
    {
        'name': 'Race at Wales west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'Florida Coast'
    },
    {
        'name': 'Race at Wales west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'California Coast'
    },
    {
        'name': 'Race at Wales west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'California Coast'
    },
    {
        'name': 'Race at Wales west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'California Coast'
    },
    {
        'name': 'Race at Wales west coast',
        'date': '2021-07-21',
        'time': '1:00:22',
        'location': 'California Coast'
    }
];

export const FilterResult = () => {

    const { t } = useTranslation();

    const renderResultByPage = (page: number) => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: NoResult,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        if (resultData.length === 0)
            return (
                <LottieWrapper>
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width={400} />
                    <LottieMessage>{t(translations.home_page.filter_tab.filter_result.start_searching_by_typing_something)}</LottieMessage>
                </LottieWrapper>);

        return resultData.map((result, index) => {
            return <ResultItem item={result} key={index} index={index} />
        });
    }

    return (
        <Wrapper>
            <ResultWrapper>
                <ResultCountText>{t(translations.home_page.filter_tab.filter_result.about_number_result)}</ResultCountText>
                {renderResultByPage(1)}
            </ResultWrapper>
            {
                resultData.length > 0 && <PaginationWrapper>
                    <Pagination defaultCurrent={1} total={50} />
                </PaginationWrapper>
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
`;

const LottieMessage = styled.span`
   color: #70757a;
`;