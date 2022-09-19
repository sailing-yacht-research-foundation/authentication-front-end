import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { render } from '@testing-library/react';
import * as EventAdminsModule from '../EventAdmins';
import * as EventCalendarModule from 'services/live-data-server/event-calendars';

const uuid = require('uuid');
const eventMock = { id: uuid.v4() };
const shallowRenderer = createRenderer();

describe('EventAdmins', () => {
    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <EventAdminsModule.EventAdmins event={{}} headless={true} groups={[]} editors={[]} />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('Should not call getEditors when groups and editors props are not provided', () => {
        const getEditorsSpy = jest.spyOn(EventCalendarModule, 'getEditors');

        render(<Provider>
            <EventAdminsModule.EventAdmins event={eventMock} headless={true} groups={[]} editors={[]} />
        </Provider>);

        expect(getEditorsSpy).not.toHaveBeenCalled();
    });
});
