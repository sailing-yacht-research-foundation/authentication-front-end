import React from 'react';
import { Tabs, Button } from 'antd';
import { MapViewTab } from './MapViewTab/index';
import { FilterTab } from '../FilterTab';
import styled from 'styled-components';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FiMap } from 'react-icons/fi';
import { BsListUl, BsSearch } from 'react-icons/bs';
import { isMobile, screenWidthIsGreaterThan1024 } from 'utils/helpers';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useHomeSlice } from '../slice';
import { useHistory, useLocation } from 'react-router';
import { selectFromDate, selectSearchKeyword, selectShowAdvancedSearch, selectSortType, selectToDate } from '../slice/selectors';
import { media } from 'styles/media';
import { FilterPane } from './FilterPane';
import { StyleConstants } from 'styles/StyleConstants';

const { TabPane } = Tabs;

export const Main = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const searchKeyword = useSelector(selectSearchKeyword);

    const fromDate = useSelector(selectFromDate);

    const toDate = useSelector(selectToDate);

    const sortType = useSelector(selectSortType);

    const history = useHistory();

    const location = useLocation();

    const showAdvancedSearch = useSelector(selectShowAdvancedSearch);

    React.useEffect(() => {
        searchRacesOnEnter();
        disableBodyScrollOnMapView(getDefaultActiveTabs());
        // eslint-disable-next-line react-hooks/exhaustive-deps

        return () => {
            document.body.className = '';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTabChanged = (activeKey) => {
        disableBodyScrollOnMapView(activeKey);
        localStorage.setItem('homepage_active_tab', activeKey);
    }

    const disableBodyScrollOnMapView = (activeKey) => {
        if (activeKey === '1') {
            document.body.className = 'no-scroll';
        } else {
            document.body.className = '';
        }
    }

    const getDefaultActiveTabs = () => {
        return !!localStorage.getItem('homepage_active_tab') ? localStorage.getItem('homepage_active_tab') : '2';
    }

    const searchRacesOnEnter = () => {
        if (location.search) {
            const search = location.search.substring(1);
            const params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

            dispatch(actions.setPageSize(params.size ?? 10));
            dispatch(actions.setKeyword(params.keyword ?? ''));
            dispatch(actions.setFromDate(params.from_date ?? ''));
            dispatch(actions.setToDate(params.to_date ?? ''));
            dispatch(actions.searchRaces(params));
        }
    }

    const onPaginationPageChanged = (page, pageSize) => {
        const params: any = {};

        params.page = page;
        params.size = pageSize;
        params.keyword = searchKeyword;
        params.sort = sortType;

        if (fromDate !== '') params.from_date = fromDate;
        if (toDate !== '') params.to_date = toDate;

        dispatch(actions.setPage(Number(params.page) ?? 1));
        dispatch(actions.setPageSize(params.size ?? 10));
        dispatch(actions.setKeyword(params.keyword));
        dispatch(actions.setFromDate(params.from_date ?? ''));
        dispatch(actions.setToDate(params.to_date ?? ''));
        dispatch(actions.searchRaces(params));

        history.push({
            pathname: '/',
            search: Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
        });
    }

    return (
        <Wrapper>
            <StyledTabs<React.ElementType>
                onChange={onTabChanged}
                animated
                defaultActiveKey={getDefaultActiveTabs()}>
                <TabPane tab={<BsListUl className="select-list-view-tap-step" />} key="2">
                    <FilterTab onPaginationPageChanged={onPaginationPageChanged} />
                </TabPane>
                <TabPane tab={<FiMap className="select-map-view-tap-step"/>} key="1">
                    <MapViewTab onPaginationPageChanged={onPaginationPageChanged} />
                </TabPane>
                {
                    (isMobile() && isAuthenticated) && <ButtonCreateContainer>
                        <Button
                            shape="round"
                            size={'large'}
                            onClick={() => history.push("/events/create")}
                            icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}
                            type="primary">
                            {t(translations.home_page.nav.create)}
                        </Button>
                    </ButtonCreateContainer>
                }
            </StyledTabs>
            {(showAdvancedSearch || screenWidthIsGreaterThan1024()) && <FilterPane defaultFocus close={() => dispatch(actions.setShowAdvancedSearch(false))} />}
            <ToggleFilterPane onClick={() => {
                dispatch(actions.setShowAdvancedSearch(true));
                window.scroll(0, 0);
            }} >
                <BsSearch size={25} color={StyleConstants.MAIN_TONE_COLOR} />
            </ToggleFilterPane>
        </Wrapper >
    )
}

const Wrapper = styled.div`
    display: flex;
`;

const StyledTabs = styled(Tabs)`
    margin-bottom: 0;
    position: relative;
    width: 100%;

    ${media.large`
        width: 65%;
    `}

    .ant-tabs-tab {
        font-size: 22px;
    }
    .ant-tabs-tab:first-child {
        margin-left: 10px;
    }
`;

const ButtonCreateContainer = styled.div`
    position: absolute;
    right: 20px;
    top: 10px;
`;

const ToggleFilterPane = styled.div`
    position: fixed;
    bottom: 10%;
    right: 20px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 3px 8px rgba(9, 32, 77, 0.12), 0 0 2px rgba(29, 17, 51, 0.12);
    cursor: pointer;
    z-index: 12;

    ${media.medium`
        display: none;
    `}
`;