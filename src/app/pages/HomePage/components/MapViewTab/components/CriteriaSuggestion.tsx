import { SuggestionCriteria, SuggestionInnerWrapper, SuggestionWrapper } from 'app/components/SyrfGeneral';
import { useHomeSlice } from 'app/pages/HomePage/slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { formatterSupportedSearchCriteria } from 'utils/constants';
import { extractTextFromHTML, placeCaretAtEnd } from 'utils/helpers';

export const CriteriaSuggestion = (props) => {

    const { keyword, searchBarRef } = props;

    const wrapperRef = React.useRef<any>();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const [showSuggestion, setShowSuggestion] = React.useState<boolean>(false);

    const getSuggestionItems = () => {
        let criteriaMatched: any[] = [];
        console.log(keyword);
        let lastword: any = extractTextFromHTML(keyword.match(/(?:\s|^)([\S]+)$/i) || '');

        if (lastword.length > 0)
            lastword = lastword[0];

        if (lastword.length === 0) return [];

        formatterSupportedSearchCriteria.forEach(criteria => {
            if (criteria.toLowerCase().includes(lastword.trim()) && !keyword.includes(criteria.toLowerCase() + ':')) {
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
        const pilledCriteria = `<span class="pill">${criteria}</span>&nbsp;`;

        dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition)));

        if (wordsLength === 1) {
            dispatch(actions.setKeyword(pilledCriteria));
            searchBarRef.current.innerHTML = pilledCriteria;
        } else if (wordsLength > 1) {
            searchBarRef.current.innerHTML = (keyword.substring(0, lastWordPosition) + ' ' + pilledCriteria);
            dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition) + ' ' + pilledCriteria));
            console.log(lastWordPosition);
            console.log(keyword.substring(0, lastWordPosition) + ' ' + pilledCriteria);
        }

        if (searchBarRef.current) {
            searchBarRef.current.focus();
        }

        placeCaretAtEnd(searchBarRef.current);
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