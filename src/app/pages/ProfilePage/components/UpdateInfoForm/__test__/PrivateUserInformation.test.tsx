
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { PrivateUserInformation } from '../PrivateUserInformation';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<PrivateUserInformation />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <PrivateUserInformation />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});