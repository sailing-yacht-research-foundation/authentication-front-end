import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import FacebookPosts from '../FacebookPosts';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<FacebookPosts />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <FacebookPosts isConnected={false} />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
