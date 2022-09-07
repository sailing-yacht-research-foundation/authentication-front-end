import MyProvider from 'app/components/Provider';
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { EventList } from '../EventList';
import * as EventListModule from '../EventList';
import { render } from '@testing-library/react';

const shallowRenderer = createRenderer();

describe('EventList', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(
            <MyProvider>
                <EventList />
            </MyProvider>
        );
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it("It should have been rendered with correct received props", () => {
        const eventListComponentSpy = jest.spyOn(EventListModule, 'EventList');

        const { container, getByText } = render(
            <MyProvider>
                <EventList />
            </MyProvider>
        );

        expect(eventListComponentSpy).toHaveBeenCalled();
    });
});
