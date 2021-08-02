import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { FilterTab } from '../index';

const shallowRenderer = createRenderer();

describe('<FilterTab />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<FilterTab />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
