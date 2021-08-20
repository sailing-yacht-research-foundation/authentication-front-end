import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { PlayerInfo } from '../PlayerInfo';
import Provider from 'app/components/Provider/index';

const shallowRenderer = createRenderer();

describe('<PlayerInfo />', () => {
  it('should render and match snapshot', () => {
    shallowRenderer.render(
      <Provider>
        <PlayerInfo />
      </Provider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
