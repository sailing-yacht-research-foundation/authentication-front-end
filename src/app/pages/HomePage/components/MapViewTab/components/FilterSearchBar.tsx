import React from 'react';
import { Spin } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { media } from 'styles/media';
import { useHomeSlice } from '../../../slice';
import { selectIsSearching, selectPageSize, selectSearchKeyword } from '../../../slice/selectors';
import { ReactComponent as SYRFLogo } from '../../assets/logo-dark.svg';
import { CriteriaSuggestion } from './CriteriaSuggestion';
import ReactTooltip from 'react-tooltip';
import { ResultSuggestion } from './ResultSuggestion';
import { removeWholeTextNodeOnBackSpace, replaceFormattedCriteriaWithRawCriteria } from 'utils/helpers';
import { ContentEditableTextRemover } from 'app/components/SyrfGeneral';
export const FilterSearchBar = (props) => {

    let inputTimeout;

    const { setIsFocusingOnSearchInput } = props;

    const searchKeyword = useSelector(selectSearchKeyword);

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const isSearching = useSelector(selectIsSearching);

    const history = useHistory();

    const pageSize = useSelector(selectPageSize);

    const { t } = useTranslation();

    const searchBarWrapperRef = React.useRef<any>();

    const searchBarRef = React.useRef<any>();

    const [keyword, setKeyword] = React.useState<string>('');

    const [showSuggestion, setShowSuggestion] = React.useState<boolean>(false);

    const handleOnSearchInputFocus = () => {
        window.scrollTo(0, 0);
        setIsFocusingOnSearchInput(true);
    }

    const handleOnSearchInputBlur = () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        setIsFocusingOnSearchInput(false);
    }

    const searchForRaces = (e) => {
        if (searchKeyword.length === 0) return;

        if (e.keyCode === 13 || e.which === 13) {
            const params: any = {};
            params.keyword = searchKeyword;
            params.size = pageSize;

            dispatch(actions.setPage(1));
            dispatch(actions.setKeyword(params.keyword ?? ''));
            dispatch(actions.setFromDate(''));
            dispatch(actions.setToDate(''));
            dispatch(actions.setSortType(''));
            dispatch(actions.searchRaces(params));

            history.push({
                pathname: '/',
                search: Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
            });
            window.scrollTo(0, 0);

            setShowSuggestion(false);
        }
    }

    const handleInput = (e) => {
        const target = e.target as HTMLDivElement;

        if (!showSuggestion) {
            setShowSuggestion(true);
        }
        if (inputTimeout) clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            dispatch(actions.setKeyword(replaceFormattedCriteriaWithRawCriteria(target.innerText)));
            setKeyword(replaceFormattedCriteriaWithRawCriteria(target.innerText));
        }, 100)
    }

    return (
        <SearchBarWrapper ref={searchBarWrapperRef}>
            <SearchBarInnerWrapper>
                <span className="contenteditable-search"
                    style={{ whiteSpace: 'nowrap', lineHeight: '30px' }}
                    contentEditable
                    data-tip={t(translations.tip.search_for_races_using_different_criteria)}
                    autoCorrect="off"
                    autoCapitalize="none"
                    onFocus={handleOnSearchInputFocus}
                    onBlur={handleOnSearchInputBlur}
                    placeholder={t(translations.home_page.map_view_tab.search_race_with_syrf)}
                    onKeyUp={searchForRaces}
                    ref={searchBarRef}
                    onKeyDown={(e) => {
                        removeWholeTextNodeOnBackSpace(e);
                    }}
                    onInput={handleInput}></span>
                {searchKeyword.length > 0 && <ContentEditableTextRemover onClick={() => {
                    dispatch(actions.setKeyword(''));
                    setKeyword('');
                    searchBarRef.current.innerHTML = '';
                }} />}
                <SearchBarLogo />
                <StyledSpin spinning={isSearching}></StyledSpin>
                {
                    showSuggestion && <>
                        <CriteriaSuggestion searchBarRef={searchBarRef} keyword={keyword} />
                        <ResultSuggestion setShowSuggestion={setShowSuggestion} searchBarRef={searchBarRef} keyword={keyword} />
                    </>
                }

            </SearchBarInnerWrapper>
            <AdvancedSearchTextWrapper>
                <a href="/" onClick={(e) => {
                    e.preventDefault();
                    dispatch(actions.setShowAdvancedSearch(true));
                }}>{t(translations.home_page.map_view_tab.advanced_search)}</a>
            </AdvancedSearchTextWrapper>
            <ReactTooltip />
        </SearchBarWrapper>
    )
}

const SearchBarWrapper = styled.div`
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 570px;
    max-width: 80%;
    z-index: 11;

    display: block;

    ${media.large`
        display: none;
    `}
`;

const SearchBarInnerWrapper = styled.div`
    position: relative;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(9,32,77,0.12),0 0 2px rgba(29,17,51,0.12);
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 70px;
    padding-right: 25px;
    white-space: nowrap;
    background: #fff;
`;

const SearchBarLogo = styled(SYRFLogo)`
    position: absolute;
    left: 15px;
    top: 0px;
    width: 45px;
    height: 45px;
    z-index: 10;
`;

const AdvancedSearchTextWrapper = styled.div`
    text-align:right;
    margin-top: 5px;
    a {
        color: #fff;
        font-size: 12px;
        margin-left: 5px;
    }
    display: block;

    ${media.large`
        display: none;
    `};
`;

const StyledSpin = styled(Spin)`
    position: absolute;
    right: 15px;
    top: 12px;
`;