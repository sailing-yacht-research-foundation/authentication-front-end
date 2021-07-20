import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { ChangePasswordForm } from '../ChangePasswordForm';

const shallowRenderer = createRenderer();

describe('<ChangePasswordForm />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<ChangePasswordForm />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
