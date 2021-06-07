import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { SignupPage } from '..';

const shallowRenderer = createRenderer();

describe('<SignupPage />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<SignupPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});