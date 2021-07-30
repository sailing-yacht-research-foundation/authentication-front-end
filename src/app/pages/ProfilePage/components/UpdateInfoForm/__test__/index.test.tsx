
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { UpdateInfo } from '../index';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<UpdateInfo />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <UpdateInfo />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});