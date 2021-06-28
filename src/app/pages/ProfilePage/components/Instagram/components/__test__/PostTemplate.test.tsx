import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import PostTemplate from '../PostTemplate';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<PostTemplate />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <PostTemplate post={null} />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
