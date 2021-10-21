import { useHomeSlice } from 'app/pages/HomePage/slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { supportedSearchCriteria } from 'utils/constants';

export const CriteriaSuggestion = (props) => {

    const { keyword, showAll, searchBarRef } = props;

    const wrapperRef = React.useRef<any>();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const [showSuggestion, setShowSuggestion] = React.useState<boolean>(false);

    const getSuggestionItems = () => {
        let criteriaMatched: any[] = [];
        let lastword: any = keyword.match(/(?:\s|^)([\S]+)$/i) || '';

        if (lastword.length > 0)
            lastword = lastword[0];

        if (lastword.length === 0) return [];
        supportedSearchCriteria.forEach(criteria => {
            if (criteria.includes(lastword.trim())) {
                criteriaMatched.unshift(criteria);
            }
        });

        if (showSuggestion)
            return criteriaMatched;

        return [];
    }

    const appendCriteria = (criteria) => {
        let lastWordPosition = keyword.match(/(?:\s|^)([\S]+)$/i).index;
        dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition)));
        const words = keyword.split(' ');
        if (words.length == 1) {
            dispatch(actions.setKeyword(criteria + ':'));
        } else {
            dispatch(actions.setKeyword(keyword.substring(0, keyword.match(/(?:\s|^)([\S]+)$/i).index) + ' ' + criteria + ':'));
        }

        if (searchBarRef.current) {
            searchBarRef.current.focus();
        }

        setShowSuggestion(false);
    }

    const renderSuggestionCriteria = () => {
        let criteria: any = []
        if (!showAll)
            criteria = getSuggestionItems();
        else criteria = supportedSearchCriteria;

        return criteria.map(criteria => {
            return <SuggestionCriteria onClick={() => appendCriteria(criteria)}>{criteria}</SuggestionCriteria>
        });
    }

    React.useEffect(() => {
        if (keyword.length > 0) setShowSuggestion(true);
    },[keyword]);

    return (
        <Wrapper>
            <SuggestionInnerWrapper ref={wrapperRef}>
                {renderSuggestionCriteria()}
            </SuggestionInnerWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 45px;
    box-shadow: 0 3px 8px rgba(9,32,77,0.12),0 0 2px rgba(29,17,51,0.12);
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