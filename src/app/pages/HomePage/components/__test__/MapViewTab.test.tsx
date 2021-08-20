import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { MapViewTab } from '../MapViewTab';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<MapViewTab />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <MapViewTab />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
