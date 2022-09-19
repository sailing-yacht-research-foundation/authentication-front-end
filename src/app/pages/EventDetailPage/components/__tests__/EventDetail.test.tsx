import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { render } from '@testing-library/react';
import { EventDetail } from '../EventDetail';
import * as EventCalendarModule from 'services/live-data-server/event-calendars';


const shallowRenderer = createRenderer();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useLocation: () => jest.fn(),
    useParams: () => jest.fn()
}));

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: () => jest.fn(),
}));

describe('EventDetail', () => {
    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <EventDetail />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('Should get event detail when component is mounted', () => {
        const getEventSpy = jest.spyOn(EventCalendarModule, 'get');

        render(<Provider>
            <EventDetail />
        </Provider>);

        expect(getEventSpy).toHaveBeenCalled();
    });
});
