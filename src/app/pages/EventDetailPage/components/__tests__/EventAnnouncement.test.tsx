import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { render } from '@testing-library/react';
import * as EventCalendarServiceModule from 'services/live-data-server/event-calendars';
import { defineWindowMatchMedia } from 'utils/test-helpers';
import { EventAnnouncement } from '../EventAnnouncement';

const uuid = require('uuid');
const eventMock = { id: uuid.v4() }
const shallowRenderer = createRenderer();

describe('EventAnnouncement', () => {
    beforeAll(() => {
        defineWindowMatchMedia();
    });

    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <EventAnnouncement event={{}} />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('Should call getEventMessages when the component is rendered', () => {
        const getEventMessagesSpy = jest.spyOn(EventCalendarServiceModule, 'getEventMessages');

        render(<Provider>
            <EventAnnouncement event={eventMock} />
        </Provider>);

        expect(getEventMessagesSpy).toHaveBeenCalledWith(eventMock.id);
    });
});