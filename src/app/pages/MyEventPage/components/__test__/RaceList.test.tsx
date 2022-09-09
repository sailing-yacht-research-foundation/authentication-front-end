import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { RaceList } from '../RaceList';
import { render } from '@testing-library/react';
import * as RaceListModule from '../RaceList';
import { defineWindowMatchMedia } from 'utils/test-helpers';
import * as RaceServicesModule from 'services/live-data-server/competition-units';

const shallowRenderer = createRenderer();

describe('RaceList', () => {
    beforeAll(() => {
        defineWindowMatchMedia();
    });

    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <RaceList />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('Should render with required props', () => {
        const raceListComponentSpy = jest.spyOn(RaceListModule, 'RaceList');

        render(<Provider>
            <RaceList event={{}} />
        </Provider>);

        expect(raceListComponentSpy).toHaveBeenCalledWith(expect.objectContaining({
            event: {}
        }), {});
    });

    it("should call getAllByCalendarEventId when the component is mounted", () => {
        const raceServicesModuleSpy = jest.spyOn(RaceServicesModule, 'getAllByCalendarEventId');

        render(<Provider>
            <RaceList event={{}} />
        </Provider>);

        expect(raceServicesModuleSpy).toHaveBeenCalled();
      });
});