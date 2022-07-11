import * as React from 'react';
import { Logo } from '../Logo';
import Provider from 'app/components/Provider/index';
import { createRenderer } from 'react-test-renderer/shallow';

const shallowRenderer = createRenderer();

describe('<Logo />', () => {
  it('should render to match the snapshot', () => {
  shallowRenderer.render(
    <Provider>
      <Logo />
    </Provider>);
  const renderedOutput = shallowRenderer.getRenderOutput();
  expect(renderedOutput).toMatchSnapshot();
  });
});
