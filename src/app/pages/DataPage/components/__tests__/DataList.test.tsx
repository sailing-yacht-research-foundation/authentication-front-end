import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { DataList } from '../DataList';

const shallowRenderer = createRenderer();

describe('<DataList />', () => {
  it('should render the deals page and matchs the snapshot', () => {
    shallowRenderer.render(<DataList />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});