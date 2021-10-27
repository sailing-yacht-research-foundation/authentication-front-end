import { SuggestionCriteria, SuggestionInnerWrapper, SuggestionWrapper } from 'app/components/SyrfGeneral';
import { useHomeSlice } from 'app/pages/HomePage/slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { supportedSearchCriteria } from 'utils/constants';

export const CriteriaSuggestion = (props) => {

    const { keyword, searchBarRef } = props;

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
            if (criteria.includes(lastword.trim()) && !keyword.includes(criteria + ':')) {
                criteriaMatched.unshift(criteria);
            }
        });

        if (showSuggestion)
            return criteriaMatched;

        return [];
    }

    const appendCriteria = (criteria) => {
        const lastWordPosition = keyword.match(/(?:\s|^)([\S]+)$/i).index;
        const words = keyword.split(' ');
        const wordsLength = words.length;

        dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition)));

        if (wordsLength === 1) {
            dispatch(actions.setKeyword(criteria + ':'));
        } else if (wordsLength > 1) {
            dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition) + ' ' + criteria + ':'));
        }

        if (searchBarRef.current) {
            searchBarRef.current.focus();
        }

        setShowSuggestion(false);
    }

    const renderSuggestionCriteria = () => {
        return getSuggestionItems().map(criteria => {
            return <SuggestionCriteria onClick={() => appendCriteria(criteria)}>{criteria}</SuggestionCriteria>
        });
    }

    React.useEffect(() => {
        if (keyword.length > 0) setShowSuggestion(true);
    }, [keyword]);

    return (
        <SuggestionWrapper>
            <SuggestionInnerWrapper ref={wrapperRef}>
                {renderSuggestionCriteria()}
            </SuggestionInnerWrapper>
        </SuggestionWrapper>
    )
}