
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { PublicUserInformation } from '../PublicUserInformation';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<PublicUserInformation />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <PublicUserInformation />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});