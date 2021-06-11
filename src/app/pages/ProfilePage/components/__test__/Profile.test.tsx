
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { Profile } from '../Profile';

const shallowRenderer = createRenderer();

describe('<Profile />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(<Profile />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});