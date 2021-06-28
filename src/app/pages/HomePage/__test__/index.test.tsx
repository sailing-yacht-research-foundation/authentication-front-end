import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { HomePage } from '..';
// import i18next from 'i18next';

const shallowRenderer = createRenderer();

describe('<HomePage />', () => {
  it('should render the home page and matchs the snapshot', () => {
    shallowRenderer.render(<HomePage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});