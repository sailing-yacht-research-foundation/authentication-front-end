import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { RaceMap } from '../RaceMap';
import Provider from 'app/components/Provider/index';

const shallowRenderer = createRenderer();

describe('<RaceMap />', () => {
  it('should render and match snapshot', () => {
    shallowRenderer.render(
      <Provider>
        <RaceMap />
      </Provider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
