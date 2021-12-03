import { SuggestionCriteria, SuggestionInnerWrapper, SuggestionWrapper } from 'app/components/SyrfGeneral';
import { useHomeSlice } from 'app/pages/HomePage/slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { CRITERIA_TO_RAW_CRITERIA, formatterSupportedSearchCriteria } from 'utils/constants';
import { extractTextFromHTML, placeCaretAtEnd } from 'utils/helpers';

export const CriteriaSuggestion = (props) => {

    const { keyword, searchBarRef } = props;

    const wrapperRef = React.useRef<any>();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const [selectedCriteria, setSelectedCriteria] = React.useState<string>('');

    const selectedCriteriaRef = React.useRef<string>('');

    const suggestionItemsRef = React.useRef<any[]>([]);

    const selectedIndex = React.useRef<number>(0);

    const [suggestionItems, setSuggestionItems] = React.useState<any[]>([]); 

    const getSuggestionItems = () => {
        let criteriaMatched: any[] = [];
        let lastword: any = extractTextFromHTML(keyword).match(/(?:\s|^)([\S]+)$/i) || '';

        if (lastword.length > 0)
            lastword = lastword[0];

        if (lastword.length === 0) return [];

        formatterSupportedSearchCriteria.forEach(criteria => {
            if (criteria.toLowerCase().includes(lastword.trim()) && !keyword.includes(criteria.toLowerCase() + ':')) {
                criteriaMatched.unshift(criteria);
            }
        });

        return criteriaMatched;
    }

    const appendCriteria = (criteria) => {
        let keyword = searchBarRef.current.innerHTML;
        const lastWordPosition = keyword.match(/(?:\s|^)([\S]+)$/i).index || -1;
        const words = keyword.split(' ');
        const wordsLength = words.length;
        const pilledCriteria = `<span contenteditable="false" class="pill">${criteria}:</span>&nbsp;`;

        dispatch(actions.setKeyword(keyword.substring(0, CRITERIA_TO_RAW_CRITERIA[criteria])));

        if (wordsLength === 1) {
            dispatch(actions.setKeyword(pilledCriteria));
            searchBarRef.current.innerHTML = pilledCriteria;
        } else if (wordsLength > 1) {
            searchBarRef.current.innerHTML = (keyword.substring(0, lastWordPosition) + ' ' + pilledCriteria);
            dispatch(actions.setKeyword(keyword.substring(0, lastWordPosition) + ' ' + CRITERIA_TO_RAW_CRITERIA[criteria]));
        }

        if (searchBarRef.current) {
            searchBarRef.current.focus();
        }

        placeCaretAtEnd(searchBarRef.current);
        hideSuggestions();
    }

    const renderSuggestionCriteria = () => {
        return suggestionItems.map(criteria => {
            return <SuggestionCriteria className={selectedCriteria === criteria ? 'active' : ''} onClick={() => appendCriteria(criteria)}>{criteria}</SuggestionCriteria>
        });
    }

    const handleSelectionUsingArrowKey = (e) => {
        e = e || window.event;

        if (suggestionItemsRef.current.length === 0) return;

        if (e.keyCode === 38) { // arrow up
            selectedIndex.current--;
            handleSelectIndexSelection();
        }
        else if (e.keyCode === 40) { // arrow down
            selectedIndex.current++;
            handleSelectIndexSelection();
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

    const handleSelectIndexSelection = () => {
        const numberOfSuggestions = suggestionItemsRef.current.length - 1;
        if (selectedIndex.current > numberOfSuggestions) {
            selectedIndex.current = 0;
        } else if (selectedIndex.current < 0) {
            selectedIndex.current = numberOfSuggestions;
        }
        setSelectedCriteria(suggestionItemsRef.current[selectedIndex.current]);
        selectedCriteriaRef.current = suggestionItemsRef.current[selectedIndex.current];
    }

    const hideSuggestions = () => {
        suggestionItemsRef.current = [];
        setSelectedCriteria('');
        selectedCriteriaRef.current = ''
        setSuggestionItems([]);
    }

    React.useEffect(() => {
        if (keyword.length > 0) {
            suggestionItemsRef.current = getSuggestionItems();
            setSuggestionItems(getSuggestionItems());
            selectedIndex.current = (suggestionItemsRef?.current?.length - 1);
        } else {
            hideSuggestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    React.useEffect(() => {
        document.onkeydown = handleSelectionUsingArrowKey;
        return () => {
            document.onkeydown = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SuggestionWrapper>
            <SuggestionInnerWrapper ref={wrapperRef}>
                {renderSuggestionCriteria()}
            </SuggestionInnerWrapper>
        </SuggestionWrapper>
    )
}