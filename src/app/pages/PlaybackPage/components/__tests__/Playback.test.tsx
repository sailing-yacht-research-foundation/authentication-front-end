import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { Playback } from '../Playback';
import Provider from 'app/components/Provider/index';

const shallowRenderer = createRenderer();

describe('<Playback />', () => {
  it('should render and match snapshot', () => {
    shallowRenderer.render(
      <Provider>
        <Playback />
      </Provider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
