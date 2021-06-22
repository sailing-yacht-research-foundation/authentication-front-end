import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import FacebookIntegration from '../FacebookIntegration';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<FacebookIntegration />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <FacebookIntegration />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
