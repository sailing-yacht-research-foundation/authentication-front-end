import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { LoginPage } from '..';

const shallowRenderer = createRenderer();

describe('<LoginPage />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<LoginPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
