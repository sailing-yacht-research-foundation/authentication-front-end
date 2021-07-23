import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { AboutPage } from '..';
// import i18next from 'i18next';

const shallowRenderer = createRenderer();

describe('<AboutPage />', () => {
  it('should render the home page and matchs the snapshot', () => {
    shallowRenderer.render(<AboutPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});