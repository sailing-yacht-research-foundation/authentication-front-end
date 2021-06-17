
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ProfilePage } from '..';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<ProfilePage />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <ProfilePage />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});