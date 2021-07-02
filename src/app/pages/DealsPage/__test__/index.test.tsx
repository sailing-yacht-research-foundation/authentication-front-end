import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { DealsPage } from '..';
// import i18next from 'i18next';

const shallowRenderer = createRenderer();

describe('<HomePage />', () => {
  it('should render the deals page and matchs the snapshot', () => {
    shallowRenderer.render(<DealsPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});