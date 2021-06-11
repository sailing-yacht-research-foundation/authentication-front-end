
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ProfilePage } from '..';

const shallowRenderer = createRenderer();

describe('<ProfilePage />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(<ProfilePage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});