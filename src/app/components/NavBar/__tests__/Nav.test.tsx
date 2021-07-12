import * as React from 'react';
import { Nav } from '../Nav';
import Provider from 'app/components/Provider/index';
import { createRenderer } from 'react-test-renderer/shallow';

const shallowRenderer = createRenderer();

describe('<Nav />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(
      <Provider>
        <Nav />
      </Provider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
