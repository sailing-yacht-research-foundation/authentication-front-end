import React from 'react';
import { Input, Spin } from 'antd';
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

export const FilterSearchBar = (props) => {

    const { setIsFocusingOnSearchInput } = props;

    const searchKeyword = useSelector(selectSearchKeyword);

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const isSearching = useSelector(selectIsSearching);

    const history = useHistory();

    const pageSize = useSelector(selectPageSize);

    const { t } = useTranslation();

    const [showAllCriteria, setShowAllCriteria] = React.useState<boolean>(false);

    const searchBarWrapperRef = React.useRef<any>()

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
        if (e.keyCode === 13 || e.which === 13) {
            const params: any = {};
            params.keyword = searchKeyword;
            params.size = pageSize;

            dispatch(actions.setPage(1));
            dispatch(actions.setKeyword(params.keyword ?? ''));
            dispatch(actions.setFromDate(''));
            dispatch(actions.setToDate(''));
            dispatch(actions.searchRaces(params));

            history.push({
                pathname: '/',
                search: Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
            });
            window.scrollTo(0, 0);
        }
    }

    return (
        <SearchBarWrapper className="search-step-input" ref={searchBarWrapperRef}>
            <SearchBarInnerWrapper>
                <StyledSearchBar
                    type={'search'}
                    value={searchKeyword}
                    onChange={(e) => {
                        dispatch(actions.setKeyword(e.target.value));
                    }}
                    onKeyUp={searchForRaces}
                    onFocus={handleOnSearchInputFocus}
                    onBlur={handleOnSearchInputBlur}
                    placeholder={t(translations.home_page.map_view_tab.search_race_with_syrf)} />
                <SearchBarLogo />
                <StyledSpin spinning={isSearching}></StyledSpin>
                <CriteriaSuggestion showAll={showAllCriteria} keyword={searchKeyword}/>
            </SearchBarInnerWrapper>
            <AdvancedSearchTextWrapper>
                <a href="/" onClick={(e) => {
                    e.preventDefault();
                    dispatch(actions.setShowAdvancedSearch(true));
                }}>{t(translations.home_page.map_view_tab.advanced_search)}</a>
            </AdvancedSearchTextWrapper>
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
    z-index: 10;
`;

const SearchBarInnerWrapper = styled.div`
    position: relative;
`;

const SearchBarLogo = styled(SYRFLogo)`
    position: absolute;
    left: 15px;
    top: 0px;
    width: 45px;
    height: 45px;
`;

const StyledSearchBar = styled(Input)`
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(9, 32, 77, 0.12), 0 0 2px rgba(29, 17, 51, 0.12);
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 70px;
    padding-right: 50px;
    white-space:nowrap;
    text-overflow:ellipsis;

    ::placeholder {
        font-weight: 500;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
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

    ${media.medium`
        display: none;
    `};
`;

const StyledSpin = styled(Spin)`
    position: absolute;
    right: 15px;
    top: 12px;
`;
