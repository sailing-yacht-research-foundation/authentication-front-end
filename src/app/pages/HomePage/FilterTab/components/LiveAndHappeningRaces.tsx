import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHomeSlice } from '../../slice';
import {
    selectUpcomingRaceDistanceCriteria,
    selectUpcomingRaceDurationCriteria,
    selectUpcomingRacePage,
    selectUpcomingRacePageSize,
    selectUpcomingRaceTotal,
    selectUpcomingRaces,
    selectSearchKeyword
} from '../../slice/selectors';
import { ResultItem } from './ResultItem';
import { selectUserCoordinate } from 'app/pages/LoginPage/slice/selectors';
import { Pagination } from 'antd';
import { translations } from 'locales/translations';
import { PaginationContainer } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { LiveAndHappeningRaceFilter } from 'app/components/HomePage/LiveAndHappeningRaceFilter';

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

    const searchKeyword = useSelector(selectSearchKeyword);

    const { t } = useTranslation();

    React.useEffect(() => {
        if (results.length === 0)
            getLiveAndUpcomingRaces(2, 5, 1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getLiveAndUpcomingRaces = (duration, distance, page, size) => {
        const params = new URLSearchParams(window.location.search);
        if (searchKeyword.length === 0 && !params.get('keyword'))
            dispatch(actions.getLiveAndUpcomingRaces({ duration, distance, page, size, coordinate: userCoordinates }));
    }

    const renderResults = () => {
        if (results.length > 0)
            return results.map((result, index) => <ResultItem item={result} key={index} index={index} />);

        return <span>{t(translations.home_page.there_are_no_live_or_upcoming_races)}</span>
    }

    const onPaginationPageChanged = (page, pageSize) => {
        dispatch(actions.getLiveAndUpcomingRaces({ duration, distance, page: page, size: pageSize, coordinate: userCoordinates }));
    }

    return (<>
        <LiveAndHappeningRaceFilter/>

        {renderResults()}

        {
            resultsCount > pageSize && <PaginationContainer>
                <Pagination defaultCurrent={currentPage} current={currentPage} onChange={onPaginationPageChanged} total={resultsCount} pageSize={pageSize} />
            </PaginationContainer>
        }
    </>);
}
