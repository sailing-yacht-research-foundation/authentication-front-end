import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { FilterResult } from '../FilterResult';

const shallowRenderer = createRenderer();

describe('<FilterResult />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<FilterResult />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
