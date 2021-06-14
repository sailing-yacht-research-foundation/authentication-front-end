import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { VerifyAccountPage } from '..';

const shallowRenderer = createRenderer();

describe('<VerifyAccountPage />', () => {
  it('should render and matches the snaphshot', () => {
    shallowRenderer.render(<VerifyAccountPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});