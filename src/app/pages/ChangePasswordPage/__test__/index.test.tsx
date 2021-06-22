
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ChangePasswordPage } from '..';

const shallowRenderer = createRenderer();

describe('<ChangePasswordPage />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(<ChangePasswordPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});