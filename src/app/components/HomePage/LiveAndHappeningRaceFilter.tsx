import { Dropdown, Menu, Space } from 'antd';
import { useHomeSlice } from 'app/pages/HomePage/slice';
import { selectUserCoordinate } from 'app/pages/LoginPage/slice/selectors';
import {
    selectUpcomingRaceDistanceCriteria,
    selectUpcomingRaceDurationCriteria,
    selectUpcomingRacePage,
    selectUpcomingRacePageSize,
    selectSearchKeyword
} from 'app/pages/HomePage/slice/selectors';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const LiveAndHappeningRaceFilter = ({ className } : { className?: any }) => {

    const { actions } = useHomeSlice();

    const userCoordinates = useSelector(selectUserCoordinate);

    const duration = useSelector(selectUpcomingRaceDurationCriteria);

    const distance = useSelector(selectUpcomingRaceDistanceCriteria);

    const currentPage = useSelector(selectUpcomingRacePage);

    const pageSize = useSelector(selectUpcomingRacePageSize);

    const searchKeyword = useSelector(selectSearchKeyword);

    const dispatch = useDispatch();

    const durations = [
        { name: '2 months', value: 2 },
        { name: '5 months', value: 5 },
        { name: '8 months', value: 8 },
        { name: '1 years', value: 12 },
        { name: '2 years', value: 24 }
    ];

    const distances = [5, 10, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

    const { t } = useTranslation();
    
    const durationToDurationName = (duration) => {
        const result = durations.find(d => {
            return d.value === duration;
        });

        if (result) return result.name;
        return durations[0].name;
    }

    const getLiveAndUpcomingRaces = (duration, distance, page, size) => {
        const params = new URLSearchParams(window.location.search);
        if (searchKeyword.length === 0 && !params.get('keyword'))
            dispatch(actions.getLiveAndUpcomingRaces({ duration, distance, page, size, coordinate: userCoordinates }));
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

    return (
        <HeaderContainer className={className}>
            <h3>{t(translations.home_page.live_and_upcoming.live_and_upcoming_events)}</h3>
            <Space size={10}>
                <Dropdown trigger={['click']} overlay={durationMenus}>
                    <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                        {durationToDurationName(duration)} <DownOutlined />
                    </a>
                </Dropdown>
                {userCoordinates && <Dropdown trigger={['click']} overlay={distanceMenus}>
                    <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                        {distance} {t(translations.home_page.live_and_upcoming.nmi)} <DownOutlined />
                    </a>
                </Dropdown>}
            </Space>
        </HeaderContainer>
    );
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