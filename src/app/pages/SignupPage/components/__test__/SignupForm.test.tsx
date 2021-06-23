
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { SignupForm } from '../SignupForm';

const shallowRenderer = createRenderer();

describe('<SignupForm />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<SignupForm />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});