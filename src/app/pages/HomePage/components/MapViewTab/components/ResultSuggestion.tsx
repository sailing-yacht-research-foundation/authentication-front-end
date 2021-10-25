import { SuggestionCriteria, SuggestionInnerWrapper, SuggestionWrapper } from 'app/components/SyrfGeneral';
import { useHomeSlice } from 'app/pages/HomePage/slice';
import { selectIsSearching } from 'app/pages/HomePage/slice/selectors';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { search } from 'services/live-data-server/competition-units';
import styled from 'styled-components';
import { supportedSearchCriteria } from 'utils/constants';
import { debounce, isMobile } from 'utils/helpers';

export const ResultSuggestion = (props) => {

    const { keyword, searchBarRef, isFilterPane } = props;

    const wrapperRef = React.useRef<any>();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const [criteria, setCriteria] = React.useState<any[]>([]);

    const isSearching = useSelector(selectIsSearching);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSuggestion = React.useCallback(debounce((keyword) => getSuggestionItems(keyword), 1000), []);

    const getSuggestionItems = async (keyword) => {
        if (!keyword) {
            setCriteria([]);
            return;
        }

        let criteriaMatched: any[] = [];
        let lastWord: any = keyword.match(/(?:\s|^)([\S]+)$/i) || '';

        if (lastWord.length > 0)
            lastWord = lastWord[0];

        if (lastWord.length === 0) setCriteria([]);
        if (!supportedSearchCriteria.includes(lastWord)) {
            let searchKeyword = lastWord.split(':');

            if (searchKeyword.length > 1)
                searchKeyword = searchKeyword[1].trim();
            else searchKeyword = searchKeyword[0].trim();

            if (searchKeyword) {
                const response = await search({ keyword: searchKeyword });
                if (response.success) {
                    criteriaMatched = response.data?.hits?.hits?.map(race => {
                        return race._source.name;
                    })
                }
            }
        }
        setCriteria(criteriaMatched);
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