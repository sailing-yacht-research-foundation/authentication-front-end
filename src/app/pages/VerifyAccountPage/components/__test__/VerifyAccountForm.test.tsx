import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { VerifyAccountForm } from '../VerifyAccountForm';

const shallowRenderer = createRenderer();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3002/"
  })
}));

describe('<VerifyAccountForm />', () => {
  it('should render and matches the snaphshot', () => {
    shallowRenderer.render(<VerifyAccountForm />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});