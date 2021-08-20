import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { FilterPane } from '../FilterPane';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<FilterPane />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <FilterPane />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
