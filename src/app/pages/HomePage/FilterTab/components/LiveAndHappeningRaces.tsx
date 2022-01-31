import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useHomeSlice } from '../../slice';
import {
    selectUpcomingRaceDistanceCriteria,
    selectUpcomingRaceDurationCriteria,
    selectUpcomingRacePage,
    selectUpcomingRacePageSize,
    selectUpcomingRaceTotal,
    selectUpcomingRaces
} from '../../slice/selectors';
import { ResultItem } from './ResultItem';
import { selectUserCoordinate } from 'app/pages/LoginPage/slice/selectors';
import { Menu, Dropdown, Space, Pagination } from 'antd';
import { translations } from 'locales/translations';
import { DownOutlined } from '@ant-design/icons';
import { PaginationContainer } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';

export const LiveAndHappeningRaces = () => {

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const userCoordinates = useSelector(selectUserCoordinate);

    const results = useSelector(selectUpcomingRaces);

    const duration = useSelector(selectUpcomingRaceDurationCriteria);

    const distance = useSelector(selectUpcomingRaceDistanceCriteria);

    const currentPage = useSelector(selectUpcomingRacePage);

    const pageSize = useSelector(selectUpcomingRacePageSize);

    const resultsCount = useSelector(selectUpcomingRaceTotal);

    const durations = [
        { name: '2 months', value: 2 },
        { name: '5 months', value: 5 },
        { name: '8 months', value: 8 },
        { name: '1 years', value: 12 },
        { name: '2 years', value: 24 }
    ];

    const distances = [5, 10, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

    const { t } = useTranslation();

    React.useEffect(() => {
        if (results.length === 0)
            getLiveAndUpcomingRaces(2, 5, 1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getLiveAndUpcomingRaces = (duration, distance, page, size) => {
        dispatch(actions.getLiveAndUpcomingRaces({ duration, distance, page, size, coordinate: userCoordinates }));
    }

    const renderResults = () => {
        if (results.length > 0)
            return results.map((result, index) => <ResultItem item={result} key={index} index={index} />);

        return <span>{t(translations.home_page.live_and_upcoming.there_are_no_live_or_upcoming_races)}</span>
    }

    const durationMenus = (
        <Menu>
            {durations.map((duration, index) =>
                <Menu.Item key={index}>
                    <a onClick={(e) => {
                        e.preventDefault();
                        getLiveAndUpcomingRaces(duration.value, distance, currentPage, pageSize);
                    }} target="_blank" rel="noopener noreferrer" href="/">
                        {duration.name}
                    </a>
                </Menu.Item>)}
        </Menu>
    );

    const distanceMenus = (
        <Menu>
            {distances.map((distance, index) =>
                <Menu.Item key={index}>
                    <a onClick={(e) => {
                        e.preventDefault();
                        getLiveAndUpcomingRaces(duration, distance, currentPage, pageSize);
                    }} target="_blank" rel="noopener noreferrer" href="/">
                        {distance} {t(translations.home_page.live_and_upcoming.nmi)}
                    </a>
                </Menu.Item>)}
        </Menu>
    );

    const durationToDurationName = (duration) => {
        const result = durations.find(d => {
            return d.value === duration;
        });

        if (result) return result.name;
        return durations[0].name;
    }

    const onPaginationPageChanged = (page, pageSize) => {
        dispatch(actions.getLiveAndUpcomingRaces({ duration, distance, page: page, size: pageSize, coordinate: userCoordinates }));
    }

    return (<>
        <HeaderContainer>
            <h3>{t(translations.home_page.live_and_upcoming.live_and_upcoming_races)}</h3>
            <Space size={10}>
                <Dropdown overlay={durationMenus}>
                    <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                        {durationToDurationName(duration)} <DownOutlined />
                    </a>
                </Dropdown>
                {userCoordinates && <Dropdown overlay={distanceMenus}>
                    <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                        {distance} {t(translations.home_page.live_and_upcoming.nmi)} <DownOutlined />
                    </a>
                </Dropdown>}
            </Space>
        </HeaderContainer>

        {renderResults()}

        {
            resultsCount > pageSize && <PaginationContainer>
                <Pagination defaultCurrent={currentPage} current={currentPage} onChange={onPaginationPageChanged} total={resultsCount} pageSize={pageSize} />
            </PaginationContainer>
        }
    </>);
}

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
        margin: 0;
    }
`;