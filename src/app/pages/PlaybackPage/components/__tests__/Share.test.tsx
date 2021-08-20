import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { Share } from '../Share';
import Provider from 'app/components/Provider/index';

const shallowRenderer = createRenderer();

describe('<Share />', () => {
  it('should render and match snapshot', () => {
    shallowRenderer.render(
      <Provider>
        <Share />
      </Provider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
