import { SuggestionCriteria, SuggestionInnerWrapper, SuggestionWrapper } from 'app/components/SyrfGeneral';
import { useHomeSlice } from 'app/pages/HomePage/slice';
import { selectIsSearching } from 'app/pages/HomePage/slice/selectors';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSuggestion } from 'services/live-data-server/competition-units';
import styled from 'styled-components';
import { supportedSearchCriteria } from 'utils/constants';
import { debounce, getCaretPosition, isMobile, placeCaretAtEnd, replaceCriteriaWithPilledCriteria } from 'utils/helpers';

const enum Criteria {
    NAME = 'name',
    START_CITY = 'start_city',
    START_COUNTRY = 'start_country',
    BOAT_NAMES = 'boat_names',
    BOAT_MODELS = 'boat_models',
    HANDICAP_RULES = 'handicap_rules',
    SOURCE = 'source',
    UNSTRUCTURED_TEXT = 'unstructured_text',
};

export const ResultSuggestion = (props) => {

    const { keyword, searchBarRef, isFilterPane, setShowSuggestion } = props;

    const wrapperRef = React.useRef<any>();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const [criteria, setCriteria] = React.useState<any[]>([]);

    const isSearching = useSelector(selectIsSearching);

    const caretPosition = React.useRef<any>();

    const [selectedCriteria, setSelectedCriteria] = React.useState<string>('');

    const selectedCriteriaRef = React.useRef<string>('');

    const suggestionItems = React.useRef<any[]>([]);

    const selectedIndex = React.useRef<number>(-1);

    const keywordRef = React.useRef<string>('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSuggestion = React.useCallback(debounce((keyword) => getSuggestionItems(keyword), 100), []);

    const getSuggestionItems = async (keyword) => {
        const caretPosition = getCaretPosition(searchBarRef.current);
        let criteriaMatched: any[] = [];
        let searchKeyWord = keyword.slice(0, caretPosition);

        // no search keyword or keyword given, stop suggesting
        if (!keyword || !searchKeyWord) {
            setCriteria([]);
            return;
        }

        // get the last words in the right side of the last colon within the caret position length.
        if (searchKeyWord.includes(':')) {
            const splittedSearchKeyword = searchKeyWord.split(':');
            searchKeyWord = splittedSearchKeyword[splittedSearchKeyword.length - 1];
        }

        const criteriaSuggestionItem = supportedSearchCriteria.find(criteria => {
            return criteria.includes(searchKeyWord);
        });

        if (criteriaSuggestionItem) {
            setCriteria([]);
            return;
        }

        const criteriaField = getSuggestionFieldFromSearchQuery(keyword);
        const response = await getSuggestion(criteriaField, searchKeyWord);
        if (response.success) {
            criteriaMatched = response.data?.suggest?.autocomplete[0]?.options?.map(result => {
                return returnValueBasedOnCriteria(criteriaField, result, searchKeyWord);
            });
        }

        setCriteria(criteriaMatched.filter(Boolean));
    }

    const findArrayItemByKey = (array, keyword) => {
        return array.find(item => {
            return String(item).toLowerCase().includes(keyword.trim());
        });
    }

    const returnValueBasedOnCriteria = (criteria, result, keyword) => {
        switch (criteria) {
            case Criteria.NAME:
            case Criteria.START_CITY:
            case Criteria.START_COUNTRY:
            case Criteria.SOURCE:
                return result._source[criteria];
            case Criteria.UNSTRUCTURED_TEXT:
            case Criteria.BOAT_NAMES:
            case Criteria.BOAT_MODELS:
            case Criteria.HANDICAP_RULES:
                return findArrayItemByKey(result._source[criteria], keyword);
            default:
                return result._source?.name;
        }
    }

    const getSuggestionFieldFromSearchQuery = (keyword) => {
        const currentKeywordAtCaretPosition = keyword.substring(0, getCaretPosition(searchBarRef.current));
        const currentKeywordAtCaretPositionLength = currentKeywordAtCaretPosition.split(' ').length;
        const splittedKeyword = currentKeywordAtCaretPosition.split(' ');
        let criteria = Criteria.NAME;

        for (let i = currentKeywordAtCaretPositionLength - 1; i >= 0; i--) {
            if (splittedKeyword[i].includes(':')) {
                criteria = splittedKeyword[i].split(':')[0];
                break;
            }
        }

        return criteria;
    }

    const appendCriteria = (criteria) => {
        const keyword = keywordRef.current;
        const wordsLength = keywordRef.current.split(' ').length;
        // in case we have one word
        if (wordsLength === 1) {
            // and that word includes the criteria, we include it
            if (keyword.includes(':')) {
                const parsedKeyword = [keyword.split(':')[0], criteria].join(':').trim();
                dispatch(actions.setKeyword(parsedKeyword));
                searchBarRef.current.innerHTML = replaceCriteriaWithPilledCriteria(parsedKeyword);
            } else { // that word does not include the criteria, we append the whole criteria.
                dispatch(actions.setKeyword(criteria));
                searchBarRef.current.innerHTML = criteria;
            }
        } else {// we have more than 1 word
            const wordsFromBeginningToCaretPosition = keyword.slice(0, caretPosition.current);
            const splittedWords = wordsFromBeginningToCaretPosition.split(':').slice(0, -1).join(":") + ':';
            const wordsFromCaretPositionToEnd = keyword.substr(caretPosition.current);
            const parsedKeyword = [splittedWords, criteria, wordsFromCaretPositionToEnd.length === 1 ? '' : wordsFromCaretPositionToEnd].join(' ').trim();
            dispatch(actions.setKeyword(parsedKeyword));
            searchBarRef.current.innerHTML = replaceCriteriaWithPilledCriteria(parsedKeyword);
        }

        placeCaretAtEnd(searchBarRef.current);
        hideSuggestions();
    }

    const hideSuggestions = () => {
        setCriteria([]);
        suggestionItems.current = [];
        setSelectedCriteria('');
        selectedCriteriaRef.current = '';
        if (setShowSuggestion) setShowSuggestion(false);
    }

    const handleSelectIndexSelection = (numberOfSuggestions) => {
        if (selectedIndex.current > numberOfSuggestions) {
            selectedIndex.current = 0;
        } else if (selectedIndex.current < 0) {
            selectedIndex.current = numberOfSuggestions;
        }
        setSelectedCriteria(suggestionItems.current[selectedIndex.current]);
        selectedCriteriaRef.current = suggestionItems.current[selectedIndex.current];
    }

    const handleSelectionUsingArrowKey = (e) => {
        e = e || window.event;
        const numberOfSuggestions = suggestionItems.current.length - 1;

        if (suggestionItems.current.length === 0) return;

        if (e.keyCode === 38) { // arrow up
            selectedIndex.current--;
            handleSelectIndexSelection(numberOfSuggestions);
        }
        else if (e.keyCode === 40) { // arrow down
            selectedIndex.current++;
            handleSelectIndexSelection(numberOfSuggestions);
        }
        else if (e.keyCode === 13) { // enter keycode
            if (selectedCriteriaRef.current) {
                appendCriteria(selectedCriteriaRef.current);
            }
        }
        else if (e.keyCode === 27) { // esc
            hideSuggestions();
        }
    }

    React.useEffect(() => {
        if (isSearching) {
            setCriteria([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearching]);

    React.useEffect(() => {
        debounceSuggestion(keyword);
        caretPosition.current = getCaretPosition(searchBarRef.current);
        keywordRef.current = keyword;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    React.useEffect(() => {
        document.onkeyup = handleSelectionUsingArrowKey;
        return () => {
            document.onkeydown = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        suggestionItems.current = criteria;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [criteria]);

    const renderSuggestionCriteria = () => {
        return criteria.map((criteria, index) => {
            return <SuggestionCriteria key={index} className={selectedCriteria === criteria ? 'active' : ''} onClick={() => appendCriteria(criteria)}>{criteria}</SuggestionCriteria>
        });
    }

    return (
        <SuggestionWrapper style={{ top: !isMobile() && isFilterPane ? '40px' : 'auto' }}>
            {
                criteria.length > 0 && <>
                    <CloseButton onClick={() => setCriteria([])}>x</CloseButton>
                    <SuggestionInnerWrapper ref={wrapperRef}>
                        {renderSuggestionCriteria()}
                    </SuggestionInnerWrapper>
                </>
            }
        </SuggestionWrapper>
    )
}

const CloseButton = styled.div`
    position: absolute;
    right: 5px;
    padding: 5px;
    cursor: pointer;
    font-size: 15px;
`;