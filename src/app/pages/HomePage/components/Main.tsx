import React from 'react';
import { Tabs, Button } from 'antd';
import { MapViewTab } from './MapViewTab/index';
import { FilterTab } from '../FilterTab';
import styled from 'styled-components';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FiMap } from 'react-icons/fi';
import { BsListUl } from 'react-icons/bs';
import { isMobile } from 'utils/helpers';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useHomeSlice } from '../slice';
import { useHistory, useLocation } from 'react-router';
import { selectFromDate, selectSearchKeyword, selectToDate } from '../slice/selectors';

const { TabPane } = Tabs;

export const Main = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const searchKeyword = useSelector(selectSearchKeyword);

    const fromDate = useSelector(selectFromDate);

    const toDate = useSelector(selectToDate);

    const history = useHistory();

    const location = useLocation();

    React.useEffect(() => {
        searchRacesOnEnter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTabChanged = (activeKey) => {
        localStorage.setItem('homepage_active_tab', activeKey);
    }

    const getDefaultActiveTabs = () => {
        return !!localStorage.getItem('homepage_active_tab') ? localStorage.getItem('homepage_active_tab') : '1';
    }

    const searchRacesOnEnter = () => {
        if (location.search) {
            const search = location.search.substring(1);
            const params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

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
        <StyledTabs<React.ElementType>
            onChange={onTabChanged}
            animated
            defaultActiveKey={getDefaultActiveTabs()}>
            <TabPane tab={<FiMap />} key="1">
                <MapViewTab onPaginationPageChanged={onPaginationPageChanged} />
            </TabPane>
            <TabPane tab={<BsListUl />} key="2">
                <FilterTab onPaginationPageChanged={onPaginationPageChanged} />
            </TabPane>
            {
                (isMobile() || !isAuthenticated) && <ButtonCreateContainer>
                    <Button
                        shape="round"
                        size={'large'}
                        icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}
                        type="primary">
                        {t(translations.home_page.nav.create)}
                    </Button>
                </ButtonCreateContainer>
            }
        </StyledTabs>
    )
}

const StyledTabs = styled(Tabs)`
    margin-bottom: 0;
    position: relative;

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