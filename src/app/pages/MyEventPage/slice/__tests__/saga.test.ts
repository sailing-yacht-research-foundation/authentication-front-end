import { call, put, takeLatest } from 'redux-saga/effects';
import { getMany } from 'services/live-data-server/event-calendars';
import { EventState, TableFilteringType } from 'utils/constants';
import * as slice from '..';

import myEventListSaga, { getEvents } from '../saga';

describe('event list Saga', () => {
    let getEventsIterator: ReturnType<typeof getEvents>;
    const getEventsParam = {
        page: 1,
        size: 10,
        filter: [{ key: 'status', value: EventState.ON_GOING, type: TableFilteringType.TEXT }],
        sorter: { key: 'status', order: 'esc' }
    }

    // We have to test twice, once for a successful load and once for an unsuccessful one
    // so we do all the stuff that happens beforehand automatically in the beforeEach
    beforeEach(() => {
        getEventsIterator = getEvents({
            payload: {
                ...getEventsParam
            }
        });
    });

    it('should set results if events are returned from server', () => {
        const response = {
            success: true,
            data: {
                rows: [],
                count: 10,
                page: 1,
                size: 10       
            }
        };

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setIsChangingPage(true)),
        );

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setPage(response.data.page)),
        );

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setSize(response.data.size)),
        );

        expect(getEventsIterator.next().value).toEqual(
            call(getMany, getEventsParam.page, getEventsParam.size, getEventsParam.filter, getEventsParam.sorter),
        );


        expect(getEventsIterator.next(response).value).toEqual(
            put(slice.myEventListActions.setIsChangingPage(false)),
        );

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setResults(response.data.rows)),
        );

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setTotal(response.data.count)),
        );

        const iteration = getEventsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('should do nothing when the server does not response', () => {
        const response = {
            success: false
        };

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setIsChangingPage(true)),
        );

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setPage(getEventsParam.page)),
        );

        expect(getEventsIterator.next().value).toEqual(
            put(slice.myEventListActions.setSize(getEventsParam.size)),
        );

        expect(getEventsIterator.next().value).toEqual(
            call(getMany, getEventsParam.page, getEventsParam.size, getEventsParam.filter, getEventsParam.sorter),
        );

        expect(getEventsIterator.next(response).value).toEqual(
            put(slice.myEventListActions.setIsChangingPage(false)),
        );

        const iteration = getEventsIterator.next();
        expect(iteration.done).toBe(true);
    });
});

describe('MyEvent Saga Init', () => {
    const homeIterator = myEventListSaga();
    it('should start task to watch for getEvents action', () => {
        const takeLatestDescriptor = homeIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.myEventListActions.getEvents.type, getEvents),
        );
    });
});