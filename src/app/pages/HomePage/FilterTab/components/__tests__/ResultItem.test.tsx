import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ResultItem } from '../ResultItem';

const shallowRenderer = createRenderer();

describe('<ResultItem />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<ResultItem item={{
      _source: {
        'name': 'Race at Wales west coast',
        'approx_start_time_ms': 1498206000000,
        'start_country': 'California Coast'
      }
    }} />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
