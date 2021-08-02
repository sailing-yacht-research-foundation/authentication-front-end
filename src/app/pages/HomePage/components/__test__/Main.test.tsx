import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { Main } from '../Main';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<Main />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <Main />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
