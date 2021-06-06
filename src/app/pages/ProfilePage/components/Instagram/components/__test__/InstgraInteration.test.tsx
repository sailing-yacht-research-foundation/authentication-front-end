import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import InstagramIntegration from '../InstagramIntegration';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<InstagramIntegration />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <InstagramIntegration />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
