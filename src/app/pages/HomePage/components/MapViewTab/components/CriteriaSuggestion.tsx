import { useHomeSlice } from 'app/pages/HomePage/slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';

export const CriteriaSuggestion = (props) => {

    const { keyword, showAll } = props;

    const supportedCriteria = ['city', 'country', 'year', 'month', 'class', 'description', 'boat_name'];

    const wrapperRef = React.useRef<any>();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const getSuggestionItems = () => {
        let criteriaMatched: any[] = [];

        if (keyword.length === 0) return [];
        supportedCriteria.forEach(criteria => {
            if (criteria.includes(keyword)) {
                criteriaMatched.unshift(criteria);
            }
        });

        return criteriaMatched;
    }

    const appendCriteria = (criteria) => {
        const words = keyword.split(' ');
        console.log(words);
        dispatch(actions.setKeyword(keyword + ' ' + criteria + ':'));
    }

    const renderSuggestionCriteria = () => {
        let criteria: any = []
        if (!showAll)
            criteria = getSuggestionItems();
        else criteria = supportedCriteria;

        return criteria.map(criteria => {
            return <SuggestionCriteria onClick={() => appendCriteria(criteria)}>{criteria}</SuggestionCriteria>
        });
    }

    return (
        <>
            <Wrapper>
                <SuggestionInnerWrapper ref={wrapperRef}>
                    {renderSuggestionCriteria()}
                </SuggestionInnerWrapper>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 45px;
`;

const SuggestionCriteria = styled.div`
    width: 100%;
    background: #fff;
    padding: 5px;
    padding-left: 20px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    
    :hover {
        background: ${StyleConstants.MAIN_TONE_COLOR};
        color: #fff;
    }
`;

const SuggestionInnerWrapper = styled.div`
    border-radius: 5px;
    overflow: hidden;
`;