import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { Footer } from '../Footer';

const shallowRenderer = createRenderer();

describe('<Footer />', () => {
  it('should render and matchs the snapshot', () => {
    shallowRenderer.render(<Footer />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});