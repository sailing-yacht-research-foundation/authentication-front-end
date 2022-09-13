import MyProvider from 'app/components/Provider';
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { EventList } from '../EventList';
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
});
