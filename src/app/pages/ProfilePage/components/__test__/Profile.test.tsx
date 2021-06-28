
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { Profile } from '../Profile';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<Profile />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <Profile />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});