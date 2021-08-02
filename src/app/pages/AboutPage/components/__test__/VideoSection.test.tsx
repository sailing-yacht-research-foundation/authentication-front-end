import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { VideoSection } from '../VideoSection';

const shallowRenderer = createRenderer();

describe('<VideoSection />', () => {
  it('should render and matchs the snapshot', () => {
    shallowRenderer.render(<VideoSection />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});