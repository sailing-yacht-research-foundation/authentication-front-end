
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { VerifyPhoneModal } from '../VerifyPhoneModal';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<VerifyPhoneModal />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <VerifyPhoneModal />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});