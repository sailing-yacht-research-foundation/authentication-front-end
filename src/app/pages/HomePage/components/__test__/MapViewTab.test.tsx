import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { MapViewTab } from '../MapViewTab';

const shallowRenderer = createRenderer();

describe('<MapViewTab />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<MapViewTab />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
