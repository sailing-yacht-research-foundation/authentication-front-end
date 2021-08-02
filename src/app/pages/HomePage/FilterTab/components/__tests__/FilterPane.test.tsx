import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { FilterPane } from '../FilterPane'

const shallowRenderer = createRenderer();

describe('<FilterPane />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<FilterPane />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
