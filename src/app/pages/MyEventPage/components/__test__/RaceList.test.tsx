import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { render } from '@testing-library/react';
import * as RaceListModule from '../RaceList';
import { defineWindowMatchMedia } from 'utils/test-helpers';
import * as RaceServicesModule from 'services/live-data-server/competition-units';

const uuid = require('uuid');
const shallowRenderer = createRenderer();

describe('RaceList', () => {
    beforeAll(() => {
        defineWindowMatchMedia();
    });

    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <RaceListModule.RaceList />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it("should call getAllByCalendarEventId when the component is mounted", () => {
        const raceServicesModuleSpy = jest.spyOn(RaceServicesModule, 'getAllByCalendarEventId');
        const eventMock = { id: uuid.v4() };

        render(<Provider>
            <RaceListModule.RaceList event={eventMock} />
        </Provider>);

        expect(raceServicesModuleSpy).toHaveBeenCalled();
      });
});
