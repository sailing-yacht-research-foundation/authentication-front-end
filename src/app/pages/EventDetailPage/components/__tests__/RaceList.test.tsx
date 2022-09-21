import React from 'react';
import MyProvider from 'app/components/Provider';
import { createRenderer } from 'react-test-renderer/shallow';
import { RaceList } from '../RaceList';
import * as EventCalendarServiceModule from 'services/live-data-server/competition-units';
import { render } from '@testing-library/react';
import { defineWindowMatchMedia } from 'utils/test-helpers';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';

const uuid = require('uuid');
const eventMock = { id: uuid.v4() }
const shallowRenderer = createRenderer();

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: () => jest.fn(),
}));

describe('RaceList', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(
            <MyProvider>
                <RaceList event={{}} />
            </MyProvider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('should call getAllByCalendarEventId on component renders', () => {
        defineWindowMatchMedia();
        const serviceSpy = jest.spyOn(EventCalendarServiceModule, 'getAllByCalendarEventId');

        render(<MyProvider>
            <RaceList event={eventMock} />
        </MyProvider>);

        expect(serviceSpy).toHaveBeenCalled();
    });

    it('should render the component with required title', async () => {
        defineWindowMatchMedia();

        const { getByText } = render(<MyProvider>
            <RaceList event={eventMock} />
        </MyProvider>);

        const t = await i18n;

        expect(getByText(String(t(translations.event_detail_page.races)))).toBeInTheDocument();
    });
});
