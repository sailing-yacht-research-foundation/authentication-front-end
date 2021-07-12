import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { Deals } from '../deal';

const shallowRenderer = createRenderer();

describe('<Deals />', () => {
  it('should render the deals and matchs the snapshot', () => {
    shallowRenderer.render(<Deals />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});