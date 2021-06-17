import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import InstgramPosts from '../InstagramPost';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<InstgramPosts />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<MyProvider>
      <InstgramPosts />
    </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
