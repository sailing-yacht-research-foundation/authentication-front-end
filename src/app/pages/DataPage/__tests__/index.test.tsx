import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { DataPage } from '..';

const shallowRenderer = createRenderer();

describe('<DataPage />', () => {
  it('should render the deals page and matchs the snapshot', () => {
    shallowRenderer.render(<DataPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});