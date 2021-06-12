import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { VerifyAccountForm } from '../VerifyAccountForm';

const shallowRenderer = createRenderer();

describe('<VerifyAccountForm />', () => {
  it('should render and matches the snaphshot', () => {
    shallowRenderer.render(<VerifyAccountForm />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});