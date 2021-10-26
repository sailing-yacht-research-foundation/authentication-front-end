import { SuggestionCriteria, SuggestionInnerWrapper, SuggestionWrapper } from 'app/components/SyrfGeneral';
import { useHomeSlice } from 'app/pages/HomePage/slice';
import { selectIsSearching } from 'app/pages/HomePage/slice/selectors';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSuggestion } from 'services/live-data-server/competition-units';
import styled from 'styled-components';
import { supportedSearchCriteria } from 'utils/constants';
import { debounce, isMobile } from 'utils/helpers';

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

    const { keyword, searchBarRef, isFilterPane } = props;

    const wrapperRef = React.useRef<any>();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const [criteria, setCriteria] = React.useState<any[]>([]);

    const isSearching = useSelector(selectIsSearching);

    const caretPosition = React.useRef<number>(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSuggestion = React.useCallback(debounce((keyword) => getSuggestionItems(keyword), 1000), []);

    const getSuggestionItems = async (keyword) => {
        let criteriaMatched: any[] = [];
        let searchKeyWord = keyword.slice(0, keyword.indexOf(' ', caretPosition.current));
        
        if (keyword.indexOf(' ', caretPosition.current)) searchKeyWord = keyword;

        const searchKeyWordAsArray = searchKeyWord.split(' ');

        if (!keyword || !searchKeyWord) {
            setCriteria([]);
            return;
        }

        searchKeyWord = searchKeyWordAsArray[searchKeyWordAsArray.length - 1];

        if (searchKeyWord.includes(':')) {
            searchKeyWord = searchKeyWord.split(':')[1];
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
            return String(item).toLowerCase().includes(keyword);
        });
    }

    const returnValueBasedOnCriteria = (criteria, result, keyword) => {
        switch (criteria) {
            case Criteria.NAME:
                return result._source?.name;
            case Criteria.START_CITY:
                return result._source?.start_city;
            case Criteria.START_COUNTRY:
                return result._source?.start_country;
            case Criteria.BOAT_NAMES:
                return findArrayItemByKey(result._source?.boat_names, keyword);
            case Criteria.BOAT_MODELS:
                return findArrayItemByKey(result._source?.boat_models, keyword);
            case Criteria.HANDICAP_RULES:
                return findArrayItemByKey(result._source?.handicap_rules, keyword);
            case Criteria.SOURCE:
                return result._source?.source;
            case Criteria.UNSTRUCTURED_TEXT:
                return result._source?.unstructured_text;
            default:
                return result._source?.name;
        }
    }

    const getSuggestionFieldFromSearchQuery = (keyword) => {
        const currentKeywordAtCaretPosition = keyword.substring(0, caretPosition.current);
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
        const lastWordPosition = keyword.match(/(?:\s|^)([\S]+)$/i).index;
        const words = keyword.split(' ');
        const wordsLength = words.length;
        const lastWord = words[wordsLength - 1];
        const firstWord = words[0];

        dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition)));

        if (wordsLength === 1) {
            if (firstWord.includes(':')) {
                dispatch(actions.setKeyword(firstWord.split(':')[0] + ':' + criteria));
            } else {
                dispatch(actions.setKeyword(criteria));
            }
        } else if (wordsLength > 1) {
            if (lastWord.includes(':')) {
                dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition) + ' ' + lastWord.split(':')[0] + ':' + criteria));
            } else {
                dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition) + ' ' + criteria));
            }
        }

        if (searchBarRef.current) {
            searchBarRef.current.focus();
        }

        setCriteria([]);
    }

    React.useEffect(() => {
        if (searchBarRef.current) {
            caretPosition.current = searchBarRef.current?.input.selectionEnd;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchBarRef]);

    React.useEffect(() => {
        if (isSearching) {
            setCriteria([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearching]);

    React.useEffect(() => {
        debounceSuggestion(keyword);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    const renderSuggestionCriteria = () => {
        return criteria.map(criteria => {
            return <SuggestionCriteria onClick={() => appendCriteria(criteria)}>{criteria}</SuggestionCriteria>
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