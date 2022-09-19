import MyProvider from 'app/components/Provider';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { VesselList } from '../VesselList';
import * as CalendarEventModule from 'services/live-data-server/event-calendars';
import { render } from '@testing-library/react';
import { translations } from 'locales/translations';
import { defineWindowMatchMedia } from 'utils/test-helpers';
import { i18n } from 'locales/i18n';

const uuid = require('uuid');
const eventMock = { id: uuid.v4() };
const shallowRenderer = createRenderer();

describe('VesselList', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(
            <MyProvider>
                <VesselList event={{}} />
            </MyProvider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('should call getEventRegisteredVessels on component rendered', () => {
        defineWindowMatchMedia();
        const serviceSpy = jest.spyOn(CalendarEventModule, 'getEventRegisteredVessels');

        render(<MyProvider>
            <VesselList event={eventMock} />
        </MyProvider>);

        expect(serviceSpy).toHaveBeenCalled();
    });

    it('should render the component with required title', async () => {
        defineWindowMatchMedia();
        const { getByText } = render(<MyProvider>
            <VesselList event={eventMock} />
        </MyProvider>);
        const t = await i18n;

        expect(getByText(String(t(translations.event_detail_page.boats)))).toBeInTheDocument();
    });
});
