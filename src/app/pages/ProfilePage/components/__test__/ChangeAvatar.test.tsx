
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ChangeAvatar } from '../ChangeAvatar';

const shallowRenderer = createRenderer();

describe('<ChangeAvatar />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(<ChangeAvatar />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});