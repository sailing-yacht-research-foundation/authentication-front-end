import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ResultItem } from '../ResultItem';

const shallowRenderer = createRenderer();

describe('<ResultItem />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<ResultItem item={{
      'name': 'Race at Wales west coast',
      'date': '2021-07-21',
      'time': '1:00:22',
      'location': 'California Coast'
    }} />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
