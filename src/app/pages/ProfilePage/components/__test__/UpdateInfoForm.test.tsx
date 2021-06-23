
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { UpdateInfo } from '../UpdateInfoForm';

const shallowRenderer = createRenderer();

describe('<UpdateInfo />', () => {
  it('should render to match the snapshot', () => {
    shallowRenderer.render(<UpdateInfo />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});