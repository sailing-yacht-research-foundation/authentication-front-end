import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { MapView } from '../MapViewTab/components/MapView';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<MapViewTab />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <MapView />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
