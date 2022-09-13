import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { render } from '@testing-library/react';
import * as EventAdminsModule from '../EventAdmins';
import { EventAdmins } from '../EventAdmins';
import * as EventCalendarModule from 'services/live-data-server/event-calendars';

const shallowRenderer = createRenderer();

describe('EventAdmins', () => {
    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <EventAdmins event={{}} headless={true} groups={[]} editors={[]} />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('Should render with required props', () => {
        const eventAdminsComponentSpy = jest.spyOn(EventAdminsModule, 'EventAdmins');

        render(<Provider>
            <EventAdmins event={{}} headless={true} groups={[]} editors={[]} />
        </Provider>);

        expect(eventAdminsComponentSpy).toHaveBeenCalledWith(expect.objectContaining({
            event: {}, headless: true, groups: [], editors: []
        }), {});
    });

    it('Should call getEditors when groups and editors props are not provided', () => {
        const getEditorsSpy = jest.spyOn(EventCalendarModule, 'getEditors');

        render(<Provider>
            <EventAdmins event={{}} headless={true} />
        </Provider>);

        expect(getEditorsSpy).toHaveBeenCalled();
    });
});