
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ShowInfoView } from '../ShowInfoView';

const shallowRenderer = createRenderer();

describe('<ShowInfoView />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(<ShowInfoView />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});